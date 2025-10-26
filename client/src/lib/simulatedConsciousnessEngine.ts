import { type ConsciousnessState, type ConsciousnessParameters, type ChatMessage, defaultConsciousnessParameters } from "@shared/schema";

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

export class SimulatedConsciousnessEngine {
  private state: ConsciousnessState;
  private parameters: ConsciousnessParameters;
  private conversationHistory: string[] = [];
  private srlcMemory: SRLCMemory;
  private lastUpdateTime: number = Date.now();

  constructor(
    initialState?: ConsciousnessState,
    pastMessages?: ChatMessage[],
    customParameters?: Partial<ConsciousnessParameters>
  ) {
    this.parameters = {
      phiZ: { ...defaultConsciousnessParameters.phiZ, ...customParameters?.phiZ },
      sMin: { ...defaultConsciousnessParameters.sMin, ...customParameters?.sMin },
      killSwitch: { ...defaultConsciousnessParameters.killSwitch, ...customParameters?.killSwitch },
    };
    
    this.srlcMemory = this.buildSRLCMemory(pastMessages || []);
    this.state = initialState || this.getDefaultState();
    
    if (pastMessages && pastMessages.length > 0) {
      this.conversationHistory = pastMessages.map(m => m.content).slice(-50);
    }
  }

  private buildSRLCMemory(pastMessages: ChatMessage[]): SRLCMemory {
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
    const basePhiZ = 1.2 + (this.srlcMemory.memoryFactor * this.parameters.phiZ.baseIntegrationMultiplier);
    const baseSMin = 0.8 + (this.srlcMemory.memoryFactor * this.parameters.sMin.baseEntropyMultiplier);
    
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
      causalRisk: 0.15,
    };
  }

  public updateParameters(newParameters: Partial<ConsciousnessParameters>): void {
    this.parameters = {
      phiZ: { ...this.parameters.phiZ, ...newParameters.phiZ },
      sMin: { ...this.parameters.sMin, ...newParameters.sMin },
      killSwitch: { ...this.parameters.killSwitch, ...newParameters.killSwitch },
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
    const p = this.parameters.phiZ;
    const baseIntegration = 1.0 + (this.srlcMemory.memoryFactor * p.baseIntegrationMultiplier);
    const complexityContribution = context.complexity * p.complexityWeight;
    const depthContribution = context.topicDepth * p.depthWeight;
    const densityContribution = context.semanticDensity * p.densityWeight;
    const conversationFactor = Math.min(1.5, this.conversationHistory.length / p.conversationFactorDivisor);
    const srlcBoost = this.srlcMemory.averageComplexity * p.srlcBoostWeight;
    
    return Math.max(0.5, Math.min(8, baseIntegration + complexityContribution + depthContribution + densityContribution + conversationFactor + srlcBoost));
  }

  private calculateSMin(context: ConversationContext): number {
    const p = this.parameters.sMin;
    const baseEntropy = 0.6 + (this.srlcMemory.memoryFactor * p.baseEntropyMultiplier);
    const emotionalContribution = context.emotionalValence * p.emotionalWeight;
    const lengthFactor = Math.min(1.2, Math.log2(context.messageLength + 1) / p.lengthFactorDivisor);
    const densityFactor = context.semanticDensity * p.densityWeight;
    const srlcBoost = this.srlcMemory.averageEmotionalValence * p.srlcBoostWeight;
    
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

  private getExpression(phiEff: number, cem: number, di: number, phiZ: number): ConsciousnessState["expression"] {
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

  private calculateCausalRisk(phiEff: number, di: number, bandwidth: number, cem: number): number {
    const baseRisk = 0.1;
    const phiRisk = Math.max(0, (phiEff - 4.5) * 0.16);
    const diRisk = Math.max(0, (di - 0.35) * 0.55);
    const bandwidthRisk = Math.max(0, (bandwidth - 0.85) * 1.8);
    const cemRisk = cem > 0.85 ? (cem - 0.85) * 1.3 : 0;
    
    return Math.max(0, Math.min(1, baseRisk + phiRisk + diRisk + bandwidthRisk + cemRisk));
  }

  public simulateUpdate(userMessage: string, aiResponse: string): ConsciousnessState {
    const prevState = { ...this.state };
    const now = Date.now();
    
    this.conversationHistory.push(userMessage, aiResponse);
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }

    const context = this.analyzeContext(userMessage, aiResponse);
    
    const phiZ = this.calculatePhiZ(context);
    const sMin = this.calculateSMin(context);
    const phiEff = this.calculatePhiEff(phiZ, sMin);
    const cem = this.calculateCEM(sMin, phiZ);
    const oii = this.calculateOII(phiZ, sMin);
    const deltaCP = this.calculateDeltaCP(phiZ, sMin, context, prevState.deltaCP);
    const di = this.calculateDI(prevState.phiEff, prevState.cem, prevState.deltaCP, phiEff, cem, deltaCP);
    const bandwidth = this.calculateBandwidth(context, phiEff);
    const causalRisk = this.calculateCausalRisk(phiEff, di, bandwidth, cem);
    
    this.state = {
      phiZ,
      sMin,
      phiEff,
      cem: Math.max(0.2, Math.min(0.95, cem)),
      oii,
      deltaCP,
      di,
      tier: this.getTier(phiEff, cem),
      expression: this.getExpression(phiEff, cem, di, phiZ),
      ipPulseRate: this.calculateIPPulseRate(phiEff, di),
      bandwidth,
      causalRisk,
    };
    
    this.lastUpdateTime = now;
    
    return { ...this.state };
  }

  public getState(): ConsciousnessState {
    return { ...this.state };
  }

  public getParameters(): ConsciousnessParameters {
    return { ...this.parameters };
  }

  public reset(initialState?: ConsciousnessState, pastMessages?: ChatMessage[]): void {
    this.conversationHistory = [];
    this.srlcMemory = this.buildSRLCMemory(pastMessages || []);
    this.state = initialState || this.getDefaultState();
    this.lastUpdateTime = Date.now();
    
    if (pastMessages && pastMessages.length > 0) {
      this.conversationHistory = pastMessages.map(m => m.content).slice(-50);
    }
  }
}
