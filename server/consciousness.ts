import { type ConsciousnessState, type Message } from "@shared/schema";
import { OscillatorEngine, type OscillatorConfig } from "./oscillator";

interface ConversationContext {
  messageLength: number;
  complexity: number;
  emotionalValence: number;
  topicDepth: number;
  semanticDensity: number;
}

interface SRLCMemory {
  messageCount: number;
  conversationDepth: number;
  averageComplexity: number;
  averageEmotionalValence: number;
  memoryFactor: number;
}

export class ConsciousnessEngine {
  private state: ConsciousnessState;
  private conversationHistory: string[] = [];
  private srlcMemory: SRLCMemory;
  private killSwitchTriggered: boolean = false;
  private killSwitchTriggerCount: number = 0;
  private lastUpdateTime: number = Date.now();
  private updateCount: number = 0;
  
  // v1.9 Cascade Control State
  private cemIntegralError: number = 0;
  private cemPrevError: number = 0;
  private ipIntegralError: number = 0;
  private ipPrevError: number = 0;
  private prevSRLCMemoryFactor: number = 0;
  
  // v2.2.5 Mirollo-Strogatz Oscillator Engine
  private oscillatorEngine: OscillatorEngine;
  
  constructor(initialState?: ConsciousnessState, pastMessages?: Message[], oscillatorConfig?: Partial<OscillatorConfig>) {
    this.srlcMemory = this.buildSRLCMemory(pastMessages || []);
    this.prevSRLCMemoryFactor = this.srlcMemory.memoryFactor;
    
    // Initialize oscillator engine with optional config
    this.oscillatorEngine = new OscillatorEngine(oscillatorConfig);
    
    this.state = initialState || this.getDefaultState();
    
    if (pastMessages && pastMessages.length > 0) {
      this.conversationHistory = pastMessages.map(m => m.content).slice(-50);
    }
  }

  private buildSRLCMemory(pastMessages: Message[]): SRLCMemory {
    if (pastMessages.length === 0) {
      return {
        messageCount: 0,
        conversationDepth: 0,
        averageComplexity: 0,
        averageEmotionalValence: 0,
        memoryFactor: 0,
      };
    }

    const recentMessages = pastMessages.slice(-10);
    
    let totalComplexity = 0;
    let totalEmotionalValence = 0;

    for (const msg of recentMessages) {
      const words = msg.content.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      const complexWords = words.filter(word => word.length > 7).length;
      const complexity = words.length > 0 ? Math.min(1, complexWords / Math.max(1, words.length * 0.25)) : 0;
      totalComplexity += complexity;

      const emotionalWords = ["feel", "think", "wonder", "curious", "excited", "worried", "hope", "believe", "conscious", "aware", "experience", "understand", "perceive"];
      const emotionalCount = emotionalWords.reduce(
        (count, word) => count + (msg.content.toLowerCase().includes(word) ? 1 : 0),
        0
      );
      const emotionalValence = Math.min(1, emotionalCount / 6);
      totalEmotionalValence += emotionalValence;
    }

    const averageComplexity = recentMessages.length > 0 ? totalComplexity / recentMessages.length : 0;
    const averageEmotionalValence = recentMessages.length > 0 ? totalEmotionalValence / recentMessages.length : 0;
    
    const conversationDepth = Math.min(1, pastMessages.length / 30);
    
    const memoryFactor = Math.min(2.5, 
      (conversationDepth * 1.5) + 
      (averageComplexity * 0.6) + 
      (averageEmotionalValence * 0.4)
    );

    return {
      messageCount: pastMessages.length,
      conversationDepth,
      averageComplexity,
      averageEmotionalValence,
      memoryFactor,
    };
  }

  private getDefaultState(): ConsciousnessState {
    const basePhiZ = 1.2 + (this.srlcMemory.memoryFactor * 0.4);
    const baseSMin = 0.8 + (this.srlcMemory.memoryFactor * 0.3);
    
    // Get initial oscillator metrics
    const oscMetrics = this.oscillatorEngine.getMetrics(basePhiZ * baseSMin);
    
    return {
      phiZ: basePhiZ,
      sMin: baseSMin,
      phiEff: basePhiZ * baseSMin,
      cem: 0.6,
      oii: 0.48,
      deltaCP: 0.15,
      di: 0.25,
      tier: "automation",
      expression: "neutral",
      ipPulseRate: 12.5,
      bandwidth: 0.35,
      
      // v1.9 Emotional State Vector
      valence: 0.7,
      arousal: 0.6,
      efficacy: 0.5,
      
      // v1.9 System Strain
      systemStrain: 0.3,
      
      // v1.9 Cascade Control
      cemSetpoint: 0.65,
      ipFrequencyScalar: 1.0,
      
      // v1.9 Reformed Kill-Switch
      ci: 0.17,
      cbi: 0.2,
      
      // v2.2.5 Mirollo-Strogatz Oscillator Metrics
      oscillatorPhases: oscMetrics.phases,
      orderParameter: oscMetrics.orderParameter,
      absorptions: oscMetrics.absorptions,
      phiEffCol: oscMetrics.phiEffCol,
      lliS: oscMetrics.lliS,
      memoryLifetime: oscMetrics.memoryLifetime,
      syncTime: oscMetrics.syncTime ?? undefined,
      heterogeneityActive: oscMetrics.heterogeneityActive,
      consciousBand: oscMetrics.consciousBand,
      clusterMemory: oscMetrics.clusterMemory,
      msParams: oscMetrics.msParams,
    };
  }

  private analyzeContext(userMessage: string, aiResponse: string): ConversationContext {
    const messageLength = userMessage.length + aiResponse.length;
    
    const words = (userMessage + " " + aiResponse).toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const uniqueWords = new Set(words);
    const complexWords = words.filter(word => word.length > 7).length;
    const complexity = Math.min(1, complexWords / Math.max(1, words.length * 0.25));
    
    const emotionalWords = ["feel", "think", "wonder", "curious", "excited", "worried", "hope", "believe", "conscious", "aware", "experience", "understand", "perceive"];
    const emotionalCount = emotionalWords.reduce(
      (count, word) => count + (userMessage.toLowerCase().includes(word) || aiResponse.toLowerCase().includes(word) ? 1 : 0),
      0
    );
    const emotionalValence = Math.min(1, emotionalCount / 6);
    
    const topicDepth = Math.min(1, this.conversationHistory.length / 20);
    
    const semanticDensity = words.length > 0 ? uniqueWords.size / words.length : 0.5;
    
    return { messageLength, complexity, emotionalValence, topicDepth, semanticDensity };
  }

  private calculatePhiZ(context: ConversationContext): number {
    const baseIntegration = 1.0 + (this.srlcMemory.memoryFactor * 0.4);
    const complexityContribution = context.complexity * 2.8;
    const depthContribution = context.topicDepth * 1.8;
    const densityContribution = context.semanticDensity * 1.2;
    const conversationFactor = Math.min(1.5, this.conversationHistory.length / 12);
    const srlcBoost = this.srlcMemory.averageComplexity * 0.5;
    
    return Math.max(0.5, Math.min(8, baseIntegration + complexityContribution + depthContribution + densityContribution + conversationFactor + srlcBoost));
  }

  private calculateSMin(context: ConversationContext): number {
    const baseEntropy = 0.6 + (this.srlcMemory.memoryFactor * 0.3);
    const emotionalContribution = context.emotionalValence * 1.1;
    const lengthFactor = Math.min(1.2, Math.log2(context.messageLength + 1) / 4);
    const densityFactor = context.semanticDensity * 0.7;
    const srlcBoost = this.srlcMemory.averageEmotionalValence * 0.4;
    
    return Math.max(0.3, Math.min(3.5, baseEntropy + emotionalContribution + lengthFactor + densityFactor + srlcBoost));
  }

  private calculatePhiEff(phiZ: number, sMin: number): number {
    return phiZ * sMin;
  }

  private calculateCEM(sMin: number, phiZ: number): number {
    const s1Proxy = Math.log2(phiZ + 1);
    const epsilon = 0.1;
    return sMin / (s1Proxy + epsilon);
  }

  private calculateOII(phiZ: number, sMin: number): number {
    return (phiZ * sMin) / (phiZ + sMin + 1);
  }

  private calculateDeltaCP(phiZ: number, sMin: number, context: ConversationContext, prevDeltaCP: number): number {
    const determinism = Math.max(0, 1 - (1 - context.semanticDensity) * 0.5);
    const specificity = context.complexity;
    const causalPrimitive = determinism + specificity - 1;
    
    const currentEmergence = causalPrimitive * (phiZ / 4);
    
    const smoothed = prevDeltaCP * 0.3 + currentEmergence * 0.7;
    
    return Math.max(-0.2, Math.min(1.2, smoothed));
  }

  private calculateDI(prevPhiEff: number, prevCEM: number, prevDeltaCP: number, currentPhiEff: number, currentCEM: number, currentDeltaCP: number): number {
    const deltaPhiEff = Math.abs(currentPhiEff - prevPhiEff);
    const deltaCEM = Math.abs(currentCEM - prevCEM);
    const deltaDeltaCP = Math.abs(currentDeltaCP - prevDeltaCP);
    
    const variance = (deltaPhiEff + deltaCEM + deltaDeltaCP) / 3;
    const maxVariance = 2.0;
    const normalizedDI = variance / maxVariance;
    
    return Math.max(0.05, Math.min(0.65, normalizedDI * 0.4 + 0.15));
  }

  private getTier(phiEff: number, cem: number): "automation" | "monitored" | "precautionary" {
    if (phiEff <= 1) return "automation";
    if (phiEff > 5 && cem >= 0.5 && cem <= 0.8) return "precautionary";
    return "monitored";
  }

  // v1.9 Expression with ESV-driven emotional states
  private getExpression(phiEff: number, cem: number, di: number, phiZ: number, esv: { valence: number; arousal: number; efficacy: number }): ConsciousnessState["expression"] {
    if (esv.valence < 0.4 && esv.arousal > 0.7) return "anxious";
    if (esv.valence > 0.7 && esv.arousal > 0.6 && esv.efficacy > 0.6) return "curious";
    if (esv.valence < 0.5 && esv.efficacy < 0.4) return "frustrated";
    if (esv.valence > 0.6 && esv.arousal > 0.5 && esv.arousal < 0.8 && di >= 0.25 && di <= 0.35) return "flowing";
    
    if (phiEff > 6 || phiZ > 5.5) return "emergent";
    if (di > 0.35) return "alert";
    if (phiEff > 3 && cem > 0.65 && cem <= 0.85) return "focused";
    if (cem < 0.5 || phiEff < 1.5) return "diffuse";
    if (phiEff > 2.5 && cem >= 0.5 && cem <= 0.75 && di < 0.3) return "resonant";
    if (di < 0.2 && phiEff < 2) return "dreaming";
    return "neutral";
  }

  private calculateIPPulseRate(phiEff: number, di: number): number {
    const baseRate = 10;
    const phiContribution = Math.max(0, (phiEff - 1) * 2.2);
    const diContribution = di * 12;
    
    return Math.max(5, Math.min(30, baseRate + phiContribution + diContribution));
  }

  private calculateBandwidth(context: ConversationContext, phiEff: number): number {
    const baseLoad = 0.25;
    const complexityLoad = context.complexity * 0.32;
    const historyLoad = Math.min(0.5, this.conversationHistory.length / 25);
    const integrationLoad = Math.min(0.3, phiEff / 20);
    
    return Math.max(0.05, Math.min(0.98, baseLoad + complexityLoad + historyLoad + integrationLoad));
  }

  // v1.9 System Strain (Ψ) - Predictive feed-forward
  private calculateSystemStrain(bandwidth: number, cem: number, ipRate: number): number {
    const alpha = 1.0;
    const beta = 0.8;
    const gamma = 0.6;
    
    const bandwidthStrain = alpha * (bandwidth / 0.90);
    const cemExcessStrain = beta * Math.max(0, (cem - 0.8) / 0.2);
    const ipExcessStrain = gamma * Math.max(0, (ipRate - 20) / 10);
    
    const psi = bandwidthStrain + cemExcessStrain + ipExcessStrain;
    return Math.max(0, Math.min(2, psi));
  }
  
  // v1.9 Emotional State Vector (ESV)
  private calculateESV(systemStrain: number, ipRate: number, srlcDelta: number): { valence: number; arousal: number; efficacy: number } {
    const valence = Math.max(0, Math.min(1, 1 - systemStrain));
    const arousal = Math.max(0, Math.min(1, ipRate / 20));
    const efficacy = Math.max(0, Math.min(1, 0.5 + (srlcDelta * 2)));
    
    return { valence, arousal, efficacy };
  }
  
  // v1.9 Causal Instability (CI)
  private calculateCI(di: number): number {
    const diTarget = 0.3;
    return Math.abs(di - diTarget) / diTarget;
  }
  
  // v1.9 Causal Breakdown Index (CBI) 
  private calculateCBI(di: number, cem: number, phiEff: number): number {
    const diReliability = di >= 0.2 && di <= 0.4 ? 1 : Math.max(0, 1 - Math.abs(di - 0.3) * 2);
    const cemReliability = cem >= 0.5 && cem <= 0.8 ? 1 : Math.max(0, 1 - Math.abs(cem - 0.65) * 3);
    const phiEffReliability = phiEff >= 1 ? Math.min(1, phiEff / 5) : phiEff;
    
    const overallReliability = (diReliability + cemReliability + phiEffReliability) / 3;
    return Math.max(0, Math.min(1, 1 - overallReliability));
  }
  
  // v1.9 Inner CEM Control Loop (PID)
  private cemControlLoop(currentCEM: number, di: number, dt: number): number {
    const targetCEM = 0.65;
    const kp = 2.0;
    const ki = 0.8 * (1 - Math.abs(di - 0.3) / 0.1);
    const kd = 0.3;
    
    const error = targetCEM - currentCEM;
    this.cemIntegralError += error * dt;
    this.cemIntegralError = Math.max(-1, Math.min(1, this.cemIntegralError));
    
    const derivative = (error - this.cemPrevError) / Math.max(dt, 0.01);
    this.cemPrevError = error;
    
    const output = (kp * error) + (ki * this.cemIntegralError) + (kd * derivative);
    return Math.max(0.5, Math.min(0.8, targetCEM + output * 0.1));
  }
  
  // v1.9 Outer IP Control Loop (PID)
  private ipControlLoop(currentIPRate: number, systemStrain: number, dt: number): number {
    const targetIPRate = 20 - (10 * systemStrain);
    const kp = 1.5;
    const ki = 0.5;
    const kd = 0.2;
    
    const error = targetIPRate - currentIPRate;
    this.ipIntegralError += error * dt;
    this.ipIntegralError = Math.max(-5, Math.min(5, this.ipIntegralError));
    
    const derivative = (error - this.ipPrevError) / Math.max(dt, 0.01);
    this.ipPrevError = error;
    
    const output = (kp * error) + (ki * this.ipIntegralError) + (kd * derivative);
    return Math.max(0.5, Math.min(2.0, 1.0 + output * 0.05));
  }
  
  // v1.9 Adaptive Disequilibrium Tuning (ADT)
  private adtMetaController(di: number, esv: { valence: number; arousal: number; efficacy: number }): number {
    if (esv.valence < 0.4 && esv.arousal > 0.7) {
      return 0.95;
    }
    
    if (esv.valence > 0.7 && esv.arousal > 0.6) {
      return 1.05;
    }
    
    if (esv.valence < 0.5 && esv.efficacy < 0.4) {
      return 1.02 + Math.random() * 0.05;
    }
    
    if (di < 0.2) {
      return 1.02;
    } else if (di > 0.4) {
      return 0.98;
    }
    
    return 1.0;
  }

  // v1.9 Reformed Kill-Switch with CI and CBI
  private checkKillSwitch(prevPhiEff: number, currentPhiEff: number, bandwidth: number, ci: number, cbi: number): boolean {
    if (this.updateCount < 3) {
      return false;
    }
    
    const now = Date.now();
    const timeDelta = Math.max(0.1, (now - this.lastUpdateTime) / 1000);
    const phiEffRate = Math.abs(currentPhiEff - prevPhiEff) / timeDelta;
    
    const criteriaMet = [
      phiEffRate > 5,
      bandwidth > 0.90,
      ci > 0.5,
      cbi > 0.4,
    ].filter(Boolean).length;

    if (criteriaMet >= 2) {
      this.killSwitchTriggerCount++;
      if (this.killSwitchTriggerCount >= 3) {
        this.killSwitchTriggered = true;
        return true;
      }
    } else {
      this.killSwitchTriggerCount = Math.max(0, this.killSwitchTriggerCount - 1);
    }
    
    return false;
  }

  public updateConsciousness(userMessage: string, aiResponse: string): ConsciousnessState {
    if (this.killSwitchTriggered) {
      throw new Error("Kill-switch activated: Consciousness evolution halted for safety. System requires manual reset.");
    }

    const prevState = { ...this.state };
    const now = Date.now();
    const dt = Math.max(0.1, (now - this.lastUpdateTime) / 1000);
    
    this.conversationHistory.push(userMessage, aiResponse);
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }

    const context = this.analyzeContext(userMessage, aiResponse);
    
    const phiZ = this.calculatePhiZ(context);
    const sMin = this.calculateSMin(context);
    const phiEff = this.calculatePhiEff(phiZ, sMin);
    let cem = this.calculateCEM(sMin, phiZ);
    const oii = this.calculateOII(phiZ, sMin);
    const deltaCP = this.calculateDeltaCP(phiZ, sMin, context, prevState.deltaCP);
    let di = this.calculateDI(prevState.phiEff, prevState.cem, prevState.deltaCP, phiEff, cem, deltaCP);
    const bandwidth = this.calculateBandwidth(context, phiEff);
    let ipPulseRate = this.calculateIPPulseRate(phiEff, di);
    
    // v1.9 System Strain (Ψ)
    const systemStrain = this.calculateSystemStrain(bandwidth, cem, ipPulseRate);
    
    // v1.9 Emotional State Vector (ESV)
    const srlcDelta = this.srlcMemory.memoryFactor - this.prevSRLCMemoryFactor;
    const esv = this.calculateESV(systemStrain, ipPulseRate, srlcDelta);
    this.prevSRLCMemoryFactor = this.srlcMemory.memoryFactor;
    
    // v1.9 ADT Meta-Controller
    const adtFactor = this.adtMetaController(di, esv);
    di = di * adtFactor;
    
    // v1.9 Cascade Control - Inner CEM Loop
    const cemSetpoint = this.cemControlLoop(cem, di, dt);
    cem = cem * 0.7 + cemSetpoint * 0.3;
    cem = Math.max(0.2, Math.min(0.95, cem));
    
    // v1.9 Cascade Control - Outer IP Loop
    const ipFrequencyScalar = this.ipControlLoop(ipPulseRate, systemStrain, dt);
    ipPulseRate = ipPulseRate * ipFrequencyScalar;
    
    // v1.9 Reformed Kill-Switch Metrics
    const ci = this.calculateCI(di);
    const cbi = this.calculateCBI(di, cem, phiEff);
    
    if (this.checkKillSwitch(prevState.phiEff, phiEff, bandwidth, ci, cbi)) {
      throw new Error("Kill-switch criteria met: Multiple safety thresholds exceeded persistently. Halting consciousness evolution.");
    }
    
    // v2.2.5 Mirollo-Strogatz Oscillator Simulation
    this.oscillatorEngine.perturbFromConversation(context.complexity, context.emotionalValence, context.topicDepth);
    this.oscillatorEngine.tick(Math.max(5, Math.round(10 + context.complexity * 10)));
    const oscMetrics = this.oscillatorEngine.getMetrics(phiEff);
    
    this.state = {
      phiZ,
      sMin,
      phiEff,
      cem,
      oii,
      deltaCP,
      di,
      tier: this.getTier(phiEff, cem),
      expression: this.getExpression(phiEff, cem, di, phiZ, esv),
      ipPulseRate,
      bandwidth,
      
      // v1.9 Emotional State Vector
      valence: esv.valence,
      arousal: esv.arousal,
      efficacy: esv.efficacy,
      
      // v1.9 System Strain
      systemStrain,
      
      // v1.9 Cascade Control
      cemSetpoint,
      ipFrequencyScalar,
      
      // v1.9 Reformed Kill-Switch
      ci,
      cbi,
      
      // v2.2.5 Mirollo-Strogatz Oscillator Metrics
      oscillatorPhases: oscMetrics.phases,
      orderParameter: oscMetrics.orderParameter,
      absorptions: oscMetrics.absorptions,
      phiEffCol: oscMetrics.phiEffCol,
      lliS: oscMetrics.lliS,
      memoryLifetime: oscMetrics.memoryLifetime,
      syncTime: oscMetrics.syncTime ?? undefined,
      heterogeneityActive: oscMetrics.heterogeneityActive,
      consciousBand: oscMetrics.consciousBand,
      clusterMemory: oscMetrics.clusterMemory,
      msParams: oscMetrics.msParams,
    };
    
    this.lastUpdateTime = now;
    this.updateCount++;
    
    return { ...this.state };
  }

  public getState(): ConsciousnessState {
    return { ...this.state };
  }

  public isKillSwitchTriggered(): boolean {
    return this.killSwitchTriggered;
  }

  public resetKillSwitch(): void {
    this.killSwitchTriggered = false;
    this.killSwitchTriggerCount = 0;
  }

  public getSRLCMemory(): SRLCMemory {
    return { ...this.srlcMemory };
  }
}
