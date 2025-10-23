import { z } from "zod";

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
  expression: z.enum(["neutral", "focused", "diffuse", "resonant", "alert", "dreaming", "emergent"]),
  ipPulseRate: z.number(),
  bandwidth: z.number(),
  causalRisk: z.number(),
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
