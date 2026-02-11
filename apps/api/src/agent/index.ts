import type {
	CustomUIMessageChunk,
	Message,
	MessageMetadata,
} from "@autonomi/types";
import type { ToolSet } from "ai";
import { asc, desc, eq } from "drizzle-orm";

import { LLMService } from "@api/agent/llm";
import { createTools } from "@api/agent/tools";
import { db } from "@api/db";
import { updateAgentTaskStatus } from "@api/db/queries/agent-tasks";
import { createChatMessage } from "@api/db/queries/chat-messages";
import { chatMessages } from "@api/db/schema";
import { generateId } from "@api/utils/generate-id";
import {
	emitStreamChunk,
	endStream,
	handleStreamError,
	startStream,
} from "@api/websocket/agent";

export class AgentService {
	private llmService: LLMService;
	private activeStreams: Map<string, AbortController> = new Map();
	private stopRequested: Set<string> = new Set();

	constructor() {
		this.llmService = new LLMService();
	}

	private async getNextSequence(taskId: string): Promise<number> {
		return db.transaction(async (tx) => {
			const lastMessage = await tx.query.chatMessages.findFirst({
				where: eq(chatMessages.taskId, taskId),
				orderBy: [desc(chatMessages.sequence)],
				columns: { sequence: true },
			});
			return (lastMessage?.sequence ?? 0) + 1;
		});
	}

	async saveUserMessage(
		taskId: string,
		content: string,
		metadata?: MessageMetadata,
	) {
		const sequence = await this.getNextSequence(taskId);
		return createChatMessage(db, {
			id: generateId("msg"),
			taskId,
			content,
			role: "user",
			sequence,
			metadata: metadata as Record<string, unknown> | null,
			createdAt: new Date(),
		});
	}

	async saveAssistantMessage(
		taskId: string,
		content: string,
		sequence?: number,
		metadata?: MessageMetadata,
	) {
		const finalSequence = sequence ?? (await this.getNextSequence(taskId));
		return createChatMessage(db, {
			id: generateId("msg"),
			taskId,
			content,
			role: "assistant",
			sequence: finalSequence,
			metadata: metadata as Record<string, unknown> | null,
			createdAt: new Date(),
		});
	}

	async saveSystemMessage(
		taskId: string,
		content: string,
		sequence?: number,
		metadata?: MessageMetadata,
	) {
		const finalSequence = sequence ?? (await this.getNextSequence(taskId));
		return createChatMessage(db, {
			id: generateId("msg"),
			taskId,
			content,
			role: "system",
			sequence: finalSequence,
			metadata: metadata as Record<string, unknown> | null,
			createdAt: new Date(),
		});
	}

	async getChatHistory(taskId: string): Promise<Message[]> {
		const dbMessages = await db.query.chatMessages.findMany({
			where: eq(chatMessages.taskId, taskId),
			orderBy: [asc(chatMessages.sequence), asc(chatMessages.createdAt)],
		});

		return dbMessages.map(
			(msg): Message => ({
				id: msg.id,
				role: msg.role,
				parts: [{ type: "text", text: msg.content }],
				metadata: msg.metadata as MessageMetadata | undefined,
			}),
		);
	}

	async processUserMessage({
		taskId,
		userMessage,
		enableTools = true,
		skipUserMessageSave = false,
		queue = false,
	}: {
		taskId: string;
		userMessage: string;
		enableTools?: boolean;
		skipUserMessageSave?: boolean;
		queue?: boolean;
	}) {
		if (queue && this.activeStreams.has(taskId)) {
			return;
		}

		if (this.activeStreams.has(taskId)) {
			await this.stopStream(taskId);
		}

		await updateAgentTaskStatus(db, taskId, "RUNNING");

		if (!skipUserMessageSave) {
			await this.saveUserMessage(taskId, userMessage);
		}

		const history = await this.getChatHistory(taskId);
		const messages: Message[] = [
			...history,
			{
				id: generateId("msg"),
				role: "user",
				parts: [{ type: "text", text: userMessage }],
			},
		];

		const systemPrompt = "You are a helpful AI assistant.";

		startStream(taskId);

		const abortController = new AbortController();
		this.activeStreams.set(taskId, abortController);

		let assistantText = "";
		let finishReason: MessageMetadata["finishReason"];
		let hasError = false;

		let availableTools: ToolSet | undefined;
		if (enableTools) {
			availableTools = createTools(taskId);
		}

		try {
			const stream = this.llmService.createMessageStream(
				systemPrompt,
				messages,
				taskId,
				abortController.signal,
				availableTools,
			);

			const reader = stream.getReader();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = value as CustomUIMessageChunk;

				if (this.stopRequested.has(taskId)) {
					break;
				}

				emitStreamChunk(chunk, taskId);

				// Extract text content from chunks for storage
				if ("textDelta" in chunk && chunk.textDelta) {
					assistantText += chunk.textDelta;
				} else if ("content" in chunk && typeof chunk.content === "string") {
					assistantText += chunk.content;
				}

				// Handle errors
				if ("type" in chunk && chunk.type === "error") {
					hasError = true;
					finishReason = "error";
				}
			}

			const wasStoppedEarly = this.stopRequested.has(taskId);

			await this.saveAssistantMessage(taskId, assistantText, undefined, {
				isStreaming: false,
				finishReason,
			});

			if (hasError) {
				await updateAgentTaskStatus(db, taskId, "FAILED");
			} else if (wasStoppedEarly) {
				await updateAgentTaskStatus(db, taskId, "STOPPED");
			} else {
				await updateAgentTaskStatus(db, taskId, "COMPLETED");
			}

			this.activeStreams.delete(taskId);
			this.stopRequested.delete(taskId);
			endStream(taskId);
		} catch (error) {
			hasError = true;
			await updateAgentTaskStatus(db, taskId, "FAILED");
			handleStreamError(error, taskId);
			this.activeStreams.delete(taskId);
			this.stopRequested.delete(taskId);
			endStream(taskId);
			throw error;
		}
	}

	async stopStream(taskId: string) {
		this.stopRequested.add(taskId);

		const abortController = this.activeStreams.get(taskId);
		if (abortController) {
			abortController.abort();
			this.activeStreams.delete(taskId);
		}

		endStream(taskId);
	}

	async cleanupTask(taskId: string) {
		const abortController = this.activeStreams.get(taskId);
		if (abortController) {
			abortController.abort();
			this.activeStreams.delete(taskId);
		}
		this.stopRequested.delete(taskId);
	}
}

export const agentService = new AgentService();
