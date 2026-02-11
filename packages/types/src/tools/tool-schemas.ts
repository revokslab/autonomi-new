import { z } from "zod";
import type { ValidationErrorResult } from "../llm/types";

// === Base Schemas ===
const BaseResultSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	error: z.string().optional(),
});

const ExplanationSchema = z.object({
	explanation: z
		.string()
		.describe("One sentence explanation as to why this tool is being used"),
});

// === Tool Parameter Schemas ===
export const TodoWriteParamsSchema = z
	.object({
		merge: z
			.boolean()
			.describe(
				"Whether to merge with existing todos (true) or replace them (false)",
			),
		todos: z
			.array(
				z.object({
					id: z.string().describe("Unique identifier for the todo item"),
					content: z.string().describe("Descriptive content of the todo"),
					status: z
						.enum(["pending", "in_progress", "completed", "cancelled"])
						.describe("Current status of the todo item"),
				}),
			)
			.describe("Array of todo items to create or update"),
	})
	.merge(ExplanationSchema);

export const WebSearchParamsSchema = z
	.object({
		query: z.string().describe("The search query"),
		domain: z
			.string()
			.optional()
			.describe("Optional domain to filter results to"),
	})
	.merge(ExplanationSchema);

export const RemoveMemoryParamsSchema = z.object({
	memoryId: z.string().describe("ID of the memory to remove"),
	explanation: z
		.string()
		.describe("One sentence explanation for why this memory is being removed"),
});

export const AddMemoryParamsSchema = z.object({
	content: z.string().describe("Concise memory content to store"),
	category: z
		.enum(["STYLES", "GENERAL"])
		.describe("Category for organizing the memory"),
	explanation: z
		.string()
		.describe("One sentence explanation for why this memory is being added"),
});

export const ListMemoriesParamsSchema = z.object({
	category: z
		.enum(["STYLES", "GENERAL"])
		.optional()
		.describe("Optional category filter"),
	explanation: z
		.string()
		.describe("One sentence explanation for why memories are being listed"),
});

export const TodoWriteResultSchema = BaseResultSchema;

// ==== Tool Result Schemas ====
export const WebSearchResultSchema = BaseResultSchema.extend({
	results: z.array(
		z.object({
			text: z.string(),
			url: z.string(),
			title: z.string().optional(),
		}),
	),
	query: z.string(),
	domain: z.string().optional(),
});

export const AddMemoryResultSchema = BaseResultSchema.extend({
	memory: z
		.object({
			id: z.string(),
			content: z.string(),
			category: z.string(),
			repoFullName: z.string(),
			createdAt: z.date(),
		})
		.optional(),
});

export const ListMemoriesResultSchema = BaseResultSchema.extend({
	memories: z
		.array(
			z.object({
				id: z.string(),
				content: z.string(),
				category: z.string(),
				repoFullName: z.string(),
				createdAt: z.date(),
			}),
		)
		.optional(),
	memoriesByCategory: z.record(z.string(), z.array(z.any())).optional(),
	totalCount: z.number().optional(),
});

export const RemoveMemoryResultSchema = BaseResultSchema.extend({
	removedMemory: z
		.object({
			id: z.string(),
			content: z.string(),
			category: z.string(),
		})
		.optional(),
});

// === Inferred Types ===
export type WebSearchResult = z.infer<typeof WebSearchResultSchema>;
export type AddMemoryResult = z.infer<typeof AddMemoryResultSchema>;
export type ListMemoriesResult = z.infer<typeof ListMemoriesResultSchema>;
export type RemoveMemoryResult = z.infer<typeof RemoveMemoryResultSchema>;
export type TodoWriteResult = z.infer<typeof TodoWriteResultSchema>;

// === Tool Schema Map ===
export const ToolResultSchemas = {
	web_search: WebSearchResultSchema,
	add_memory: AddMemoryResultSchema,
	list_memories: ListMemoriesResultSchema,
	remove_memory: RemoveMemoryResultSchema,
	todo_write: TodoWriteResultSchema,
} as const;

export type ToolName = keyof typeof ToolResultSchemas;

// === Discriminated Union for Tool Results ===
export type ToolResultTypes =
	| { toolName: "web_search"; result: WebSearchResult }
	| { toolName: "add_memory"; result: AddMemoryResult }
	| { toolName: "list_memories"; result: ListMemoriesResult }
	| { toolName: "remove_memory"; result: RemoveMemoryResult }
	| { toolName: "todo_write"; result: TodoWriteResult };

// Extended type that includes validation errors
export type ToolResultTypesWithValidation = ToolResultTypes & {
	result: ToolResultTypes["result"] | ValidationErrorResult;
};

export enum ToolTypes {
	WEB_SEARCH = "web_search",
	ADD_MEMORY = "add_memory",
	LIST_MEMORIES = "list_memories",
	REMOVE_MEMORY = "remove_memory",
	TODO_WRITE = "todo_write",
	REASONING = "reasoning",
	REDACTED_REASONING = "redacted-reasoning",
}

// Tool prefixes for UI display
export const TOOL_PREFIXES: Record<ToolTypes, string> = {
	[ToolTypes.WEB_SEARCH]: "Web search",
	[ToolTypes.ADD_MEMORY]: "Add memory",
	[ToolTypes.LIST_MEMORIES]: "List memories",
	[ToolTypes.REMOVE_MEMORY]: "Remove memory",
	[ToolTypes.TODO_WRITE]: "Todo update",
	[ToolTypes.REASONING]: "Reasoning",
	[ToolTypes.REDACTED_REASONING]: "Reasoning",
};
