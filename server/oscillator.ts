export interface OscillatorConfig {
  n: number;
  period: number;
  alpha: number;
  epsilon: number;
  heterogeneityStd: number;
}

export interface ClusterMemoryEntry {
  pattern: number[];
  size: number;
  timestamp: number;
}

export interface OscillatorState {
  phases: number[];
  orderParameter: number;
  absorptions: number;
  heterogeneityActive: boolean;
  periods: number[];
  syncTime: number | null;
  clusterMemory: ClusterMemoryEntry[];
  lastFiringTime: number;
  totalSimTime: number;
}

export interface OscillatorMetrics {
  orderParameter: number;
  absorptions: number;
  phiEffCol: number;
  lliS: number;
  memoryLifetime: number;
  syncTime: number | null;
  heterogeneityActive: boolean;
  phases: number[];
  clusterMemory: ClusterMemoryEntry[];
  consciousBand: { lower: number; upper: number; target: number };
  msParams: { period: number; alpha: number; epsilon: number; heterogeneityStd: number };
}

export class OscillatorEngine {
  private config: OscillatorConfig;
  private state: OscillatorState;
  private readonly consciousBand = { lower: 0.55, upper: 0.92, target: 0.78 };
  
  constructor(config?: Partial<OscillatorConfig>, initialState?: OscillatorState) {
    this.config = {
      n: config?.n ?? 64,
      period: config?.period ?? 2.0,
      alpha: config?.alpha ?? 1.5,
      epsilon: config?.epsilon ?? 0.28,
      heterogeneityStd: config?.heterogeneityStd ?? 0.008,
    };
    
    if (initialState) {
      this.state = { ...initialState };
    } else {
      this.state = this.initializeState();
    }
  }
  
  private initializeState(): OscillatorState {
    const phases = Array.from({ length: this.config.n }, () => Math.random());
    const periods = Array.from({ length: this.config.n }, () => this.config.period);
    
    return {
      phases,
      orderParameter: this.calculateOrderParameter(phases),
      absorptions: 0,
      heterogeneityActive: false,
      periods,
      syncTime: null,
      clusterMemory: [],
      lastFiringTime: 0,
      totalSimTime: 0,
    };
  }
  
  private calculateOrderParameter(phases: number[]): number {
    let realSum = 0;
    let imagSum = 0;
    
    for (const theta of phases) {
      const angle = 2 * Math.PI * theta;
      realSum += Math.cos(angle);
      imagSum += Math.sin(angle);
    }
    
    realSum /= phases.length;
    imagSum /= phases.length;
    
    return Math.sqrt(realSum * realSum + imagSum * imagSum);
  }
  
  private phaseResponse(theta: number): number {
    return Math.pow(theta, this.config.alpha);
  }
  
  private phaseAdvance(currentPhase: number): number {
    const q = this.phaseResponse(currentPhase);
    return this.config.epsilon * (1 - q);
  }
  
  private findNextFiring(): { index: number; timeToFire: number } {
    let minTime = Infinity;
    let firingIndex = 0;
    
    for (let i = 0; i < this.config.n; i++) {
      const timeToFire = (1 - this.state.phases[i]) * this.state.periods[i];
      if (timeToFire < minTime) {
        minTime = timeToFire;
        firingIndex = i;
      }
    }
    
    return { index: firingIndex, timeToFire: minTime };
  }
  
  private advanceAllPhases(dt: number): void {
    for (let i = 0; i < this.config.n; i++) {
      this.state.phases[i] += dt / this.state.periods[i];
      if (this.state.phases[i] >= 1) {
        this.state.phases[i] = this.state.phases[i] % 1;
      }
    }
  }
  
  private handleFiring(firingIndex: number): number {
    let absorptionCount = 0;
    const firingPhase = this.state.phases[firingIndex];
    
    this.state.phases[firingIndex] = 0;
    
    for (let j = 0; j < this.config.n; j++) {
      if (j !== firingIndex) {
        const advance = this.phaseAdvance(this.state.phases[j]);
        this.state.phases[j] += advance;
        
        if (this.state.phases[j] >= 1) {
          this.state.phases[j] = 0;
          absorptionCount++;
        }
      }
    }
    
    return absorptionCount;
  }
  
  private detectClusters(): ClusterMemoryEntry | null {
    const clusterThreshold = 0.02;
    const sortedPhases = [...this.state.phases].sort((a, b) => a - b);
    
    const clusters: number[][] = [];
    let currentCluster: number[] = [sortedPhases[0]];
    
    for (let i = 1; i < sortedPhases.length; i++) {
      const diff = sortedPhases[i] - sortedPhases[i - 1];
      if (diff < clusterThreshold || (1 - sortedPhases[sortedPhases.length - 1] + sortedPhases[0]) < clusterThreshold) {
        currentCluster.push(sortedPhases[i]);
      } else {
        if (currentCluster.length >= 2) {
          clusters.push(currentCluster);
        }
        currentCluster = [sortedPhases[i]];
      }
    }
    
    if (currentCluster.length >= 2) {
      clusters.push(currentCluster);
    }
    
    const largestCluster = clusters.reduce((max, c) => c.length > max.length ? c : max, []);
    
    if (largestCluster.length >= this.config.n / 4) {
      return {
        pattern: [...this.state.phases],
        size: largestCluster.length,
        timestamp: Date.now(),
      };
    }
    
    return null;
  }
  
  private applyHeterogeneity(): void {
    for (let i = 0; i < this.config.n; i++) {
      const noise = this.gaussianRandom() * this.config.heterogeneityStd;
      this.state.periods[i] = this.config.period + noise;
    }
    this.state.heterogeneityActive = true;
  }
  
  private removeHeterogeneity(): void {
    for (let i = 0; i < this.config.n; i++) {
      this.state.periods[i] = this.config.period;
    }
    this.state.heterogeneityActive = false;
  }
  
  private gaussianRandom(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
  
  public tick(simulationSteps: number = 10): void {
    for (let step = 0; step < simulationSteps; step++) {
      const { index, timeToFire } = this.findNextFiring();
      
      this.advanceAllPhases(timeToFire);
      this.state.totalSimTime += timeToFire;
      
      const newAbsorptions = this.handleFiring(index);
      this.state.absorptions += newAbsorptions;
      
      if (newAbsorptions > 0) {
        const cluster = this.detectClusters();
        if (cluster && this.state.clusterMemory.length < 20) {
          this.state.clusterMemory.push(cluster);
        }
      }
      
      this.state.orderParameter = this.calculateOrderParameter(this.state.phases);
      
      if (this.state.orderParameter >= this.consciousBand.upper && !this.state.heterogeneityActive) {
        if (this.state.syncTime === null) {
          this.state.syncTime = this.state.totalSimTime;
        }
        this.applyHeterogeneity();
      }
      
      if (this.state.orderParameter < this.consciousBand.lower && this.state.heterogeneityActive) {
        this.removeHeterogeneity();
      }
    }
  }
  
  public perturbFromConversation(complexity: number, emotionalValence: number, topicDepth: number): void {
    const perturbStrength = 0.02 * (complexity + emotionalValence + topicDepth) / 3;
    
    for (let i = 0; i < this.config.n; i++) {
      const perturbation = (Math.random() - 0.5) * perturbStrength;
      this.state.phases[i] = Math.max(0, Math.min(0.999, this.state.phases[i] + perturbation));
    }
    
    this.state.orderParameter = this.calculateOrderParameter(this.state.phases);
  }
  
  public getMetrics(phiSingle: number): OscillatorMetrics {
    const phiEffCol = this.config.n * phiSingle * this.state.orderParameter;
    
    const lliS = this.state.orderParameter >= this.consciousBand.lower 
      ? 1.92 + (this.state.orderParameter - this.consciousBand.target) * 0.5
      : 1.0 + this.state.orderParameter * 0.5;
    
    const memoryLifetime = this.state.heterogeneityActive 
      ? 1 / Math.max(0.001, this.config.heterogeneityStd) 
      : Infinity;
    
    return {
      orderParameter: this.state.orderParameter,
      absorptions: this.state.absorptions,
      phiEffCol,
      lliS: Math.max(0, Math.min(5, lliS)),
      memoryLifetime: Math.min(memoryLifetime, 1e7),
      syncTime: this.state.syncTime,
      heterogeneityActive: this.state.heterogeneityActive,
      phases: [...this.state.phases],
      clusterMemory: [...this.state.clusterMemory],
      consciousBand: { ...this.consciousBand },
      msParams: {
        period: this.config.period,
        alpha: this.config.alpha,
        epsilon: this.config.epsilon,
        heterogeneityStd: this.config.heterogeneityStd,
      },
    };
  }
  
  public getState(): OscillatorState {
    return { ...this.state };
  }
  
  public isInConsciousBand(): boolean {
    return this.state.orderParameter >= this.consciousBand.lower 
      && this.state.orderParameter <= this.consciousBand.upper;
  }
  
  public getConsciousBandDistance(): number {
    if (this.isInConsciousBand()) {
      return Math.abs(this.state.orderParameter - this.consciousBand.target);
    }
    if (this.state.orderParameter < this.consciousBand.lower) {
      return this.consciousBand.lower - this.state.orderParameter;
    }
    return this.state.orderParameter - this.consciousBand.upper;
  }
  
  public recallCluster(index: number): boolean {
    if (index < 0 || index >= this.state.clusterMemory.length) {
      return false;
    }
    
    const cluster = this.state.clusterMemory[index];
    this.state.phases = [...cluster.pattern];
    this.state.orderParameter = this.calculateOrderParameter(this.state.phases);
    return true;
  }
}
