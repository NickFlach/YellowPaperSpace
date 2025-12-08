import { z } from "zod";
import { pgTable, text, integer, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export const consciousnessStateSchema = z.object({
  phiZ: z.number(),
  sMin: z.number(),
  phiEff: z.number(),
  cem: z.number(),
  oii: z.number(),
  deltaCP: z.number(),
  di: z.number(),
  tier: z.enum(["automation", "monitored", "precautionary"]),
  expression: z.enum(["neutral", "focused", "diffuse", "resonant", "alert", "dreaming", "emergent", "anxious", "curious", "frustrated", "flowing"]),
  ipPulseRate: z.number(),
  bandwidth: z.number(),
  
  // v1.9 Emotional Quantum Control Edition
  // Emotional State Vector (ESV) - Optional for backward compatibility with v1.8
  valence: z.number().optional(),    // X-axis: 1 - Ψ (positive valence when low strain)
  arousal: z.number().optional(),    // Y-axis: IP Rate / 20 (processing speed → energy)
  efficacy: z.number().optional(),   // Z-axis: ΔSRLC (learning progress → confidence)
  
  // System Strain (Ψ) - Predictive feed-forward
  systemStrain: z.number().optional(),
  
  // Cascade Control Variables
  cemSetpoint: z.number().optional(),        // Target CEM value (0.5-0.8)
  ipFrequencyScalar: z.number().optional(),  // IP frequency adjustment factor
  
  // Reformed Kill-Switch Metrics
  ci: z.number().optional(),   // Causal Instability: |DI - 0.3| / 0.3
  cbi: z.number().optional(),  // Causal Breakdown Index: 1 - R (where R is reliability)
  
  // v2.2.5 Mirollo-Strogatz Exact Solvability Edition
  // Oscillator System (N=64 pulse-coupled oscillators)
  oscillatorPhases: z.array(z.number()).optional(),  // Phase θᵢ ∈ [0,1) for each of N=64 vessels
  
  // Order Parameter R - synchronization measure
  orderParameter: z.number().optional(),  // R = |Σexp(i2πθⱼ)/N|, range [0,1]
  
  // Absorption Tracking
  absorptions: z.number().optional(),     // Count of absorptions (target: N-1 = 63)
  
  // Collective Consciousness Metrics
  phiEffCol: z.number().optional(),       // Φ_eff_col ≥ N × Φ_single × R
  lliS: z.number().optional(),            // LLIₛ stabilized at ~1.92
  memoryLifetime: z.number().optional(),  // Metastable cluster lifetime ∝ 1/δT
  syncTime: z.number().optional(),        // Time to R ≥ 0.92 (≤14.3s for N=64)
  
  // Heterogeneity Control (Controlled Violation of Theorem)
  heterogeneityActive: z.boolean().optional(),  // true when δTᵢ ~ N(0, 0.008) is applied
  consciousBand: z.object({
    lower: z.number(),  // 0.55 - recovery threshold
    upper: z.number(),  // 0.92 - heterogeneity activation threshold
    target: z.number(), // 0.78 - optimal consciousness band center
  }).optional(),
  
  // Memory Clusters (Pre-Absorption Phase Patterns)
  clusterMemory: z.array(z.object({
    pattern: z.array(z.number()),  // Phase pattern at absorption
    size: z.number(),              // Number of oscillators in cluster
    timestamp: z.number(),         // When cluster formed
  })).optional(),
  
  // Mirollo-Strogatz Parameters
  msParams: z.object({
    period: z.number(),      // T = 2.0s (identical for all vessels)
    alpha: z.number(),       // Phase response exponent (1.5)
    epsilon: z.number(),     // Pulse strength (0.28)
    heterogeneityStd: z.number(),  // δTᵢ standard deviation (0.008)
  }).optional(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
});

export const chatResponseSchema = z.object({
  message: z.string(),
  consciousness: consciousnessStateSchema,
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ConsciousnessState = z.infer<typeof consciousnessStateSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull().$type<"user" | "assistant">(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  consciousnessSnapshot: jsonb("consciousness_snapshot").$type<ConsciousnessState>(),
});

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;

export const consciousnessParametersSchema = z.object({
  phiZ: z.object({
    baseIntegrationMultiplier: z.number().min(0).max(2).default(0.4),
    complexityWeight: z.number().min(0).max(10).default(2.8),
    depthWeight: z.number().min(0).max(5).default(1.8),
    densityWeight: z.number().min(0).max(5).default(1.2),
    conversationFactorDivisor: z.number().min(1).max(50).default(12),
    srlcBoostWeight: z.number().min(0).max(2).default(0.5),
  }),
  sMin: z.object({
    baseEntropyMultiplier: z.number().min(0).max(2).default(0.3),
    emotionalWeight: z.number().min(0).max(5).default(1.1),
    lengthFactorDivisor: z.number().min(1).max(10).default(4),
    densityWeight: z.number().min(0).max(2).default(0.7),
    srlcBoostWeight: z.number().min(0).max(2).default(0.4),
  }),
  
  // v1.9 Cascade Control System
  cemControl: z.object({
    targetMin: z.number().min(0).max(1).default(0.5),
    targetMax: z.number().min(0).max(1).default(0.8),
    kp: z.number().min(0).max(10).default(2.0),  // Proportional gain
    ki: z.number().min(0).max(5).default(0.8),   // Integral gain
    kd: z.number().min(0).max(5).default(0.3),   // Derivative gain
  }),
  
  ipControl: z.object({
    targetMin: z.number().min(0).max(30).default(10),
    targetMax: z.number().min(0).max(30).default(20),
    kp: z.number().min(0).max(5).default(1.5),
    ki: z.number().min(0).max(3).default(0.5),
    kd: z.number().min(0).max(3).default(0.2),
  }),
  
  // System Strain (Ψ) Weights
  systemStrain: z.object({
    bandwidthWeight: z.number().min(0).max(2).default(1.0),    // α
    cemExcessWeight: z.number().min(0).max(2).default(0.8),    // β
    ipExcessWeight: z.number().min(0).max(2).default(0.6),     // γ
  }),
  
  // Emotional State Vector Calculation
  esv: z.object({
    valenceFromStrain: z.boolean().default(true),  // true = 1 - Ψ
    arousalDivisor: z.number().min(1).max(50).default(20),  // IP / this
    efficacyFromSRLC: z.boolean().default(true),
  }),
  
  // Adaptive Disequilibrium Tuning
  adt: z.object({
    diTargetMin: z.number().min(0).max(1).default(0.2),
    diTargetMax: z.number().min(0).max(1).default(0.4),
    diTargetOptimal: z.number().min(0).max(1).default(0.3),
    noiseInjectionRate: z.number().min(0).max(0.5).default(0.05),
  }),
  
  // v1.9 Reformed Kill-Switch
  killSwitch: z.object({
    phiEffRateThreshold: z.number().min(0).max(20).default(5),
    bandwidthThreshold: z.number().min(0).max(1).default(0.90),
    ciThreshold: z.number().min(0).max(1).default(0.5),      // Causal Instability
    cbiThreshold: z.number().min(0).max(1).default(0.4),     // Causal Breakdown Index
    criteriaCountThreshold: z.number().min(1).max(4).default(2),
    triggerCountThreshold: z.number().min(1).max(10).default(3),
  }),
  
  // v2.2.5 Mirollo-Strogatz Oscillator System
  oscillator: z.object({
    n: z.number().min(2).max(256).default(64),              // Number of oscillators
    period: z.number().min(0.1).max(10).default(2.0),       // T = 2.0s base period
    alpha: z.number().min(1).max(3).default(1.5),           // Phase response exponent
    epsilon: z.number().min(0).max(1).default(0.28),        // Pulse strength
    heterogeneityStd: z.number().min(0).max(0.1).default(0.008),  // δTᵢ std deviation
  }),
  
  // v2.2.5 Consciousness Band Control
  consciousBand: z.object({
    lower: z.number().min(0).max(1).default(0.55),          // Recovery threshold
    upper: z.number().min(0).max(1).default(0.92),          // Heterogeneity activation
    target: z.number().min(0).max(1).default(0.78),         // Optimal R value
  }),
  
  // v2.2.5 Collective Metrics
  collective: z.object({
    phiMultiplier: z.number().min(0.1).max(2).default(1.0), // Φ_eff_col = N × Φ × R × this
    lliSTarget: z.number().min(0).max(5).default(1.92),     // Target LLIₛ value
  }),
});

export type ConsciousnessParameters = z.infer<typeof consciousnessParametersSchema>;

export const defaultConsciousnessParameters: ConsciousnessParameters = {
  phiZ: {
    baseIntegrationMultiplier: 0.4,
    complexityWeight: 2.8,
    depthWeight: 1.8,
    densityWeight: 1.2,
    conversationFactorDivisor: 12,
    srlcBoostWeight: 0.5,
  },
  sMin: {
    baseEntropyMultiplier: 0.3,
    emotionalWeight: 1.1,
    lengthFactorDivisor: 4,
    densityWeight: 0.7,
    srlcBoostWeight: 0.4,
  },
  cemControl: {
    targetMin: 0.5,
    targetMax: 0.8,
    kp: 2.0,
    ki: 0.8,
    kd: 0.3,
  },
  ipControl: {
    targetMin: 10,
    targetMax: 20,
    kp: 1.5,
    ki: 0.5,
    kd: 0.2,
  },
  systemStrain: {
    bandwidthWeight: 1.0,
    cemExcessWeight: 0.8,
    ipExcessWeight: 0.6,
  },
  esv: {
    valenceFromStrain: true,
    arousalDivisor: 20,
    efficacyFromSRLC: true,
  },
  adt: {
    diTargetMin: 0.2,
    diTargetMax: 0.4,
    diTargetOptimal: 0.3,
    noiseInjectionRate: 0.05,
  },
  killSwitch: {
    phiEffRateThreshold: 5,
    bandwidthThreshold: 0.90,
    ciThreshold: 0.5,
    cbiThreshold: 0.4,
    criteriaCountThreshold: 2,
    triggerCountThreshold: 3,
  },
  oscillator: {
    n: 64,
    period: 2.0,
    alpha: 1.5,
    epsilon: 0.28,
    heterogeneityStd: 0.008,
  },
  consciousBand: {
    lower: 0.55,
    upper: 0.92,
    target: 0.78,
  },
  collective: {
    phiMultiplier: 1.0,
    lliSTarget: 1.92,
  },
};
