import { eq } from "drizzle-orm";

import type { Database } from "@api/db";
import { type ChatMessage, chatMessages } from "@api/db/schema";

export type ChatMessageInsert = {
	id: string;
	content: string;
	role: "user" | "assistant" | "system";
	taskId: string;
	metadata?: Record<string, unknown> | null;
	sequence?: number | null;
	promptTokens?: number | null;
	completionTokens?: number | null;
	totalTokens?: number | null;
	finishReason?: string | null;
	stackedTaskId?: string | null;
	createdAt?: Date | null;
};

export type ChatMessageUpdate = {
	id: string;
	content?: string;
	role?: "user" | "assistant" | "system";
	metadata?: Record<string, unknown> | null;
	sequence?: number | null;
	promptTokens?: number | null;
	completionTokens?: number | null;
	totalTokens?: number | null;
	finishReason?: string | null;
	stackedTaskId?: string | null;
	createdAt?: Date | null;
};

export const createChatMessage = async (
	db: Database,
	data: ChatMessageInsert,
): Promise<ChatMessage[]> => {
	return db.insert(chatMessages).values(data).returning();
};

export const getChatMessageById = async (
	db: Database,
	messageId: string,
): Promise<ChatMessage | undefined> => {
	return db.query.chatMessages.findFirst({
		where: eq(chatMessages.id, messageId),
	});
};

export const getChatMessagesByTaskId = async (
	db: Database,
	taskId: string,
): Promise<ChatMessage[]> => {
	return db.query.chatMessages.findMany({
		where: eq(chatMessages.taskId, taskId),
	});
};

export const getChatMessagesByStackedTaskId = async (
	db: Database,
	stackedTaskId: string,
): Promise<ChatMessage[]> => {
	return db.query.chatMessages.findMany({
		where: eq(chatMessages.stackedTaskId, stackedTaskId),
	});
};

export const updateChatMessage = async (
	db: Database,
	data: ChatMessageUpdate,
): Promise<ChatMessage[]> => {
	const { id, ...updateData } = data;
	return db
		.update(chatMessages)
		.set(updateData)
		.where(eq(chatMessages.id, id))
		.returning();
};

export const deleteChatMessageById = async (
	db: Database,
	id: string,
): Promise<ChatMessage[]> => {
	return db.delete(chatMessages).where(eq(chatMessages.id, id)).returning();
};
