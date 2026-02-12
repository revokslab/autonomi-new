import { z } from "zod";

export const AgentTaskStatusSchema = z.enum([
	"STOPPED",
	"INITIALIZING",
	"ARCHIVED",
	"RUNNING",
	"COMPLETED",
	"FAILED",
]);

export const AgentTaskInitStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const AgentTaskSchema = z.object({
	id: z.string().describe("Unique identifier for the agent task"),
	title: z.string().nullable().describe("Title of the agent task"),
	taskStatus: AgentTaskStatusSchema.default("INITIALIZING").describe(
		"Current status of the task",
	),
	initStatus: AgentTaskInitStatusSchema.default("INACTIVE").describe(
		"Initialization status of the task",
	),
	initializationError: z
		.string()
		.nullable()
		.describe("Error message from initialization if any"),
	errorMessage: z
		.string()
		.nullable()
		.describe("General error message if task failed"),
	userId: z.string().describe("ID of the user who owns this task"),
});

export const CreateAgentTaskRequestSchema = z.object({
	title: z.string().optional().describe("Title for the new agent task"),
});

export const UpdateAgentTaskRequestSchema = z.object({
	title: z.string().optional().describe("Updated title for the task"),
	taskStatus: AgentTaskStatusSchema.optional().describe(
		"Updated status for the task",
	),
	initStatus: AgentTaskInitStatusSchema.optional().describe(
		"Updated initialization status",
	),
	initializationError: z
		.string()
		.nullable()
		.optional()
		.describe("Updated initialization error"),
	errorMessage: z
		.string()
		.nullable()
		.optional()
		.describe("Updated error message"),
});

export const AgentTaskResponseSchema = z.object({
	data: AgentTaskSchema.describe("The agent task data"),
});

export const AgentTaskListResponseSchema = z.object({
	data: z.array(AgentTaskSchema).describe("List of agent tasks"),
});
