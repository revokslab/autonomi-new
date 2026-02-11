import { and, eq } from "drizzle-orm";

import type { Database } from "@api/db";
import {
	type AgentTaskMemory,
	type AgentTaskMemoryCategory,
	agentTaskMemories,
} from "@api/db/schema";

export type AgentTaskMemoryInsert = {
	id: string;
	content?: string | null;
	memoryCategory?: AgentTaskMemoryCategory | null;
	userId?: string | null;
	taskId?: string | null;
};

export type AgentTaskMemoryUpdate = {
	id: string;
	content?: string | null;
	memoryCategory?: AgentTaskMemoryCategory | null;
	userId?: string | null;
	taskId?: string | null;
};

export const createAgentTaskMemory = async (
	db: Database,
	data: AgentTaskMemoryInsert,
): Promise<AgentTaskMemory[]> => {
	return db.insert(agentTaskMemories).values(data).returning();
};

export const getAgentTaskMemoryById = async (
	db: Database,
	memoryId: string,
): Promise<AgentTaskMemory | undefined> => {
	return db.query.agentTaskMemories.findFirst({
		where: eq(agentTaskMemories.id, memoryId),
	});
};

export const getAgentTaskMemoriesByUserId = async (
	db: Database,
	userId: string,
): Promise<AgentTaskMemory[]> => {
	return db.query.agentTaskMemories.findMany({
		where: eq(agentTaskMemories.userId, userId),
	});
};

export const getAgentTaskMemoriesByTaskId = async (
	db: Database,
	taskId: string,
): Promise<AgentTaskMemory[]> => {
	return db.query.agentTaskMemories.findMany({
		where: eq(agentTaskMemories.taskId, taskId),
	});
};

export const getAgentTaskMemoriesByCategory = async (
	db: Database,
	category: AgentTaskMemoryCategory,
): Promise<AgentTaskMemory[]> => {
	return db.query.agentTaskMemories.findMany({
		where: eq(agentTaskMemories.memoryCategory, category),
	});
};

export const getAgentTaskMemoriesByUserIdAndCategory = async (
	db: Database,
	userId: string,
	category: AgentTaskMemoryCategory,
): Promise<AgentTaskMemory[]> => {
	return db.query.agentTaskMemories.findMany({
		where: and(
			eq(agentTaskMemories.userId, userId),
			eq(agentTaskMemories.memoryCategory, category),
		),
	});
};

export const getAgentTaskMemoriesByTaskIdAndCategory = async (
	db: Database,
	taskId: string,
	category: AgentTaskMemoryCategory,
): Promise<AgentTaskMemory[]> => {
	return db.query.agentTaskMemories.findMany({
		where: and(
			eq(agentTaskMemories.taskId, taskId),
			eq(agentTaskMemories.memoryCategory, category),
		),
	});
};

export const updateAgentTaskMemory = async (
	db: Database,
	data: AgentTaskMemoryUpdate,
): Promise<AgentTaskMemory[]> => {
	const { id, ...updateData } = data;
	return db
		.update(agentTaskMemories)
		.set(updateData)
		.where(eq(agentTaskMemories.id, id))
		.returning();
};

export const deleteAgentTaskMemoryById = async (
	db: Database,
	id: string,
): Promise<AgentTaskMemory[]> => {
	return db
		.delete(agentTaskMemories)
		.where(eq(agentTaskMemories.id, id))
		.returning();
};
