import { and, eq } from "drizzle-orm";

import type { Database } from "@api/db";
import {
	type AgentTodo,
	type AgentTodoStatus,
	agentTodos,
} from "@api/db/schema";

export type AgentTodoInsert = {
	id: string;
	taskId: string;
	content?: string | null;
	status?: AgentTodoStatus;
	sequence?: number | null;
};

export type AgentTodoUpdate = {
	id: string;
	content?: string | null;
	status?: AgentTodoStatus;
	sequence?: number | null;
};

export const createAgentTodo = async (
	db: Database,
	data: AgentTodoInsert,
): Promise<AgentTodo[]> => {
	return db.insert(agentTodos).values(data).returning();
};

export const getAgentTodoById = async (
	db: Database,
	todoId: string,
): Promise<AgentTodo | undefined> => {
	return db.query.agentTodos.findFirst({
		where: eq(agentTodos.id, todoId),
	});
};

export const getAgentTodosByTaskId = async (
	db: Database,
	taskId: string,
): Promise<AgentTodo[]> => {
	return db.query.agentTodos.findMany({
		where: eq(agentTodos.taskId, taskId),
	});
};

export const getAgentTodosByStatus = async (
	db: Database,
	status: AgentTodoStatus,
): Promise<AgentTodo[]> => {
	return db.query.agentTodos.findMany({
		where: eq(agentTodos.status, status),
	});
};

export const getAgentTodosByTaskIdAndStatus = async (
	db: Database,
	taskId: string,
	status: AgentTodoStatus,
): Promise<AgentTodo[]> => {
	return db.query.agentTodos.findMany({
		where: and(eq(agentTodos.taskId, taskId), eq(agentTodos.status, status)),
	});
};

export const updateAgentTodo = async (
	db: Database,
	data: AgentTodoUpdate,
): Promise<AgentTodo[]> => {
	const { id, ...updateData } = data;
	return db
		.update(agentTodos)
		.set(updateData)
		.where(eq(agentTodos.id, id))
		.returning();
};

export const updateAgentTodoStatus = async (
	db: Database,
	id: string,
	status: AgentTodoStatus,
): Promise<AgentTodo[]> => {
	return db
		.update(agentTodos)
		.set({ status })
		.where(eq(agentTodos.id, id))
		.returning();
};

export const deleteAgentTodoById = async (
	db: Database,
	id: string,
): Promise<AgentTodo[]> => {
	return db.delete(agentTodos).where(eq(agentTodos.id, id)).returning();
};
