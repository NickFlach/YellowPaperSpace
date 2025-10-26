import { db } from "./db";
import { conversations, messages, type Conversation, type Message, type InsertConversation, type InsertMessage } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createConversation(data: InsertConversation): Promise<Conversation>;
  saveMessage(data: InsertMessage): Promise<Message>;
  getConversation(id: number): Promise<{ conversation: Conversation; messages: Message[] } | null>;
  getRecentConversations(limit?: number): Promise<Conversation[]>;
  getConversationMessages(conversationId: number, limit?: number): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async createConversation(data: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(data).returning();
    return conversation;
  }

  async saveMessage(data: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(data as any).returning();
    
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, data.conversationId));
    
    return message;
  }

  async getConversation(id: number): Promise<{ conversation: Conversation; messages: Message[] } | null> {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
      with: {
        messages: {
          orderBy: (messages, { asc }) => [asc(messages.timestamp)],
        },
      },
    });

    if (!conversation) {
      return null;
    }

    return {
      conversation: {
        id: conversation.id,
        userId: conversation.userId,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      messages: conversation.messages,
    };
  }

  async getRecentConversations(limit: number = 10): Promise<Conversation[]> {
    return db.query.conversations.findMany({
      orderBy: [desc(conversations.updatedAt)],
      limit,
    });
  }

  async getConversationMessages(conversationId: number, limit?: number): Promise<Message[]> {
    const query = db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: (messages, { asc }) => [asc(messages.timestamp)],
      limit,
    });

    return query;
  }
}

export const storage = new DatabaseStorage();
