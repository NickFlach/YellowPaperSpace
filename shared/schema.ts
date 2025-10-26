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
