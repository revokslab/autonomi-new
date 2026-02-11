import {
	AddMemoryParamsSchema,
	ListMemoriesParamsSchema,
	RemoveMemoryParamsSchema,
	TodoWriteParamsSchema,
	WebSearchParamsSchema,
} from "@autonomi/types";
import { type ToolSet, tool } from "ai";

export function createTools(taskId: string): ToolSet {
	return {
		web_search: tool({
			description:
				"Search the web for real-time information about any topic. Returns text snippets and URLs.",
			inputSchema: WebSearchParamsSchema,
			execute: async ({ query, domain }) => {
				console.log(
					`[TOOL:${taskId}] web_search: "${query}" (domain: ${domain ?? "any"})`,
				);
				return {
					success: true,
					message: "Web search not yet implemented",
					results: [] as { text: string; url: string; title?: string }[],
					query,
					domain,
				};
			},
		}),

		add_memory: tool({
			description:
				"Store a persistent memory for future reference across conversations.",
			inputSchema: AddMemoryParamsSchema,
			execute: async ({ content, category }) => {
				console.log(`[TOOL:${taskId}] add_memory: "${content}" (${category})`);
				return {
					success: true,
					message: "Memory storage not yet implemented",
				};
			},
		}),

		list_memories: tool({
			description: "List all stored memories, optionally filtered by category.",
			inputSchema: ListMemoriesParamsSchema,
			execute: async ({ category }) => {
				console.log(
					`[TOOL:${taskId}] list_memories (category: ${category ?? "all"})`,
				);
				return {
					success: true,
					message: "Memory listing not yet implemented",
					memories: [] as {
						id: string;
						content: string;
						category: string;
						repoFullName: string;
						createdAt: Date;
					}[],
				};
			},
		}),

		remove_memory: tool({
			description: "Remove a stored memory by its ID.",
			inputSchema: RemoveMemoryParamsSchema,
			execute: async ({ memoryId }) => {
				console.log(`[TOOL:${taskId}] remove_memory: ${memoryId}`);
				return {
					success: true,
					message: "Memory removal not yet implemented",
				};
			},
		}),

		todo_write: tool({
			description:
				"Create or update task todos to track progress on complex, multi-step tasks.",
			inputSchema: TodoWriteParamsSchema,
			execute: async ({ todos, merge }) => {
				console.log(
					`[TOOL:${taskId}] todo_write: ${todos.length} todos (merge: ${merge})`,
				);
				return {
					success: true,
					message: `${merge ? "Merged" : "Replaced"} ${todos.length} todos`,
				};
			},
		}),
	};
}
