import { and, eq } from "drizzle-orm";

import type { Database } from "@api/db";
import {
	type AgentTask,
	type AgentTaskInitStatus,
	type AgentTaskStatus,
	type AgentTodo,
	agentTasks,
	type ChatMessage,
} from "@api/db/schema";

export type AgentTaskInsert = {
	id: string;
	userId: string;
	title?: string | null;
	taskStatus?: AgentTaskStatus;
	initStatus?: AgentTaskInitStatus;
	initializationError?: string | null;
	errorMessage?: string | null;
};

export type AgentTaskUpdate = {
	id: string;
	title?: string | null;
	taskStatus?: AgentTaskStatus;
	initStatus?: AgentTaskInitStatus;
	initializationError?: string | null;
	errorMessage?: string | null;
};

export const createAgentTask = async (
	db: Database,
	data: AgentTaskInsert,
): Promise<AgentTask[]> => {
	return db.insert(agentTasks).values(data).returning();
};

export const getAgentTaskById = async (
	db: Database,
	taskId: string,
): Promise<AgentTask | undefined> => {
	return db.query.agentTasks.findFirst({
		where: eq(agentTasks.id, taskId),
	});
};

export const getAgentTaskByUserId = async (
	db: Database,
	userId: string,
): Promise<AgentTask[]> => {
	return db.query.agentTasks.findMany({
		where: eq(agentTasks.userId, userId),
	});
};

export const getAgentTasksByStatus = async (
	db: Database,
	status: AgentTaskStatus,
): Promise<AgentTask[]> => {
	return db.query.agentTasks.findMany({
		where: eq(agentTasks.taskStatus, status),
	});
};

export const getAgentTasksByInitStatus = async (
	db: Database,
	initStatus: AgentTaskInitStatus,
): Promise<AgentTask[]> => {
	return db.query.agentTasks.findMany({
		where: eq(agentTasks.initStatus, initStatus),
	});
};

export const getAgentTasksByUserIdAndStatus = async (
	db: Database,
	userId: string,
	status: AgentTaskStatus,
): Promise<AgentTask[]> => {
	return db.query.agentTasks.findMany({
		where: and(
			eq(agentTasks.userId, userId),
			eq(agentTasks.taskStatus, status),
		),
	});
};

export const getAgentTaskByIdWithRelations = async (
	db: Database,
	taskId: string,
): Promise<
	| (AgentTask & {
			todos: AgentTodo[];
			chatMessages: ChatMessage[];
	  })
	| undefined
> => {
	return db.query.agentTasks.findFirst({
		where: eq(agentTasks.id, taskId),
		with: {
			todos: true,
			chatMessages: true,
		},
	});
};

export const updateAgentTask = async (
	db: Database,
	data: AgentTaskUpdate,
): Promise<AgentTask[]> => {
	const { id, ...updateData } = data;
	return db
		.update(agentTasks)
		.set(updateData)
		.where(eq(agentTasks.id, id))
		.returning();
};

export const updateAgentTaskStatus = async (
	db: Database,
	id: string,
	status: AgentTaskStatus,
): Promise<AgentTask[]> => {
	return db
		.update(agentTasks)
		.set({ taskStatus: status })
		.where(eq(agentTasks.id, id))
		.returning();
};

export const updateAgentTaskInitStatus = async (
	db: Database,
	id: string,
	initStatus: AgentTaskInitStatus,
): Promise<AgentTask[]> => {
	return db
		.update(agentTasks)
		.set({ initStatus })
		.where(eq(agentTasks.id, id))
		.returning();
};

export const deleteAgentTaskById = async (
	db: Database,
	id: string,
): Promise<AgentTask[]> => {
	return db.delete(agentTasks).where(eq(agentTasks.id, id)).returning();
};
