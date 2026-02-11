import type {
	ClientToServerEvents,
	CustomUIMessageChunk,
	ServerToClientEvents,
} from "@autonomi/types";
import type { Server as Engine } from "@socket.io/bun-engine";
import { Server, type Socket } from "socket.io";

import { agentService } from "@api/agent";
import { db } from "@api/db";
import { getAgentTaskById, updateAgentTaskStatus } from "@api/db/queries";

interface ConnectionState {
	lastSeen: number;
	taskId?: string;
	reconnectCount: number;
	bufferPosition: number;
}

interface TaskStreamState {
	chunks: CustomUIMessageChunk[];
	isStreaming: boolean;
}

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const connectionStates = new Map<string, ConnectionState>();
const taskStreamStates = new Map<string, TaskStreamState>();
let io: Server<ClientToServerEvents, ServerToClientEvents>;

function getOrCreateTaskStreamState(taskId: string): TaskStreamState {
	const existingState = taskStreamStates.get(taskId);
	if (existingState) {
		return existingState;
	}
	const newState = { chunks: [], isStreaming: false };
	taskStreamStates.set(taskId, newState);
	return newState;
}

function cleanupTaskStreamState(taskId: string): void {
	taskStreamStates.delete(taskId);
	console.log(`[SOCKET] Cleaned up stream state for task ${taskId}`);
}

async function verifyTaskAccess(
	_socketId: string,
	taskId: string,
): Promise<boolean> {
	try {
		// For now, just check if task exists
		// TODO: Add proper user authentication and authorization
		const task = await getAgentTaskById(db, taskId);
		return !!task;
	} catch (error) {
		console.error(`[SOCKET] Error verifying task access:`, error);
		return false;
	}
}

export function emitToTask(
	taskId: string,
	event: keyof ServerToClientEvents,
	data: unknown,
) {
	io.to(`task-${taskId}`).emit(event, data);
}

export function createSocketServer(
	engine: Engine,
): Server<ClientToServerEvents, ServerToClientEvents> {
	io = new Server({
		allowEIO3: true,
	});

	io.bind(engine);

	io.on("connection", (socket: TypedSocket) => {
		// Initialize connection state
		const connectionId = socket.id;
		const existingState = connectionStates.get(connectionId);

		const connectionState: ConnectionState = {
			lastSeen: Date.now(),
			taskId: existingState?.taskId,
			reconnectCount: existingState ? existingState.reconnectCount + 1 : 0,
			bufferPosition: existingState?.bufferPosition || 0,
		};
		connectionStates.set(connectionId, connectionState);

		socket.emit("connection-info", {
			connectionId,
			reconnectCount: connectionState.reconnectCount,
			timestamp: connectionState.lastSeen,
		});

		// Send current stream state to new connections
		if (connectionState.taskId) {
			const streamState = taskStreamStates.get(connectionState.taskId);
			if (streamState?.isStreaming && streamState.chunks.length > 0) {
				console.log(
					`[SOCKET] Sending stream state to ${connectionId} for task ${connectionState.taskId}:`,
					streamState.chunks.length,
				);
				socket.emit("stream-state", {
					chunks: streamState.chunks,
					isStreaming: true,
					totalChunks: streamState.chunks.length,
				});
			} else {
				socket.emit("stream-state", {
					chunks: [],
					isStreaming: false,
					totalChunks: 0,
				});
			}
		} else {
			// No task associated yet, send empty state
			socket.emit("stream-state", {
				chunks: [],
				isStreaming: false,
				totalChunks: 0,
			});
		}

		socket.on("join-task", async (data) => {
			try {
				const hasAccess = await verifyTaskAccess(connectionId, data.taskId);

				if (!hasAccess) {
					socket.emit("message-error", { error: "Access denied to task" });
					return;
				}

				// Join the task room
				await socket.join(`task-${data.taskId}`);
				console.log(
					`[SOCKET] User ${connectionId} joined task room: ${data.taskId}`,
				);

				// Update connection state
				const state = connectionStates.get(connectionId);
				if (state) {
					state.taskId = data.taskId;
					connectionStates.set(connectionId, state);
				}
			} catch (error) {
				console.error(`[SOCKET] Error joining task room:`, error);
				socket.emit("message-error", { error: "Failed to join task room" });
			}
		});

		socket.on("leave-task", async (data) => {
			try {
				await socket.leave(`task-${data.taskId}`);
				console.log(
					`[SOCKET] User ${connectionId} left task room: ${data.taskId}`,
				);

				// Update connection state
				const state = connectionStates.get(connectionId);
				if (state) {
					state.taskId = undefined;
					connectionStates.set(connectionId, state);
				}
			} catch (error) {
				console.error(`[SOCKET] Error leaving task room:`, error);
			}
		});

		socket.on("heartbeat", () => {
			const state = connectionStates.get(connectionId);
			if (state) {
				state.lastSeen = Date.now();
				connectionStates.set(connectionId, state);
			}
		});

		socket.on("stop-stream", async (data) => {
			try {
				const hasAccess = await verifyTaskAccess(connectionId, data.taskId);

				if (!hasAccess) {
					socket.emit("message-error", { error: "Access denied to task" });
					return;
				}

				console.log("Received stop stream request for task:", data.taskId);

				await agentService.stopStream(data.taskId);

				endStream(data.taskId);

				emitToTask(data.taskId, "stream-complete", undefined);
			} catch (error) {
				console.error("Error stopping stream:", error);
				socket.emit("stream-error", { error: "Failed to stop stream" });
			}
		});

		// Handle user message
		socket.on("user-message", async (data) => {
			try {
				const hasAccess = await verifyTaskAccess(connectionId, data.taskId);
				if (!hasAccess) {
					socket.emit("message-error", { error: "Access denied to task" });
					return;
				}

				console.log("Received user message:", data);

				// Get task workspace path and user info from database
				const task = await getAgentTaskById(db, data.taskId);

				if (!task) {
					socket.emit("message-error", { error: "Task not found" });
					return;
				}

				await updateAgentTaskStatus(db, data.taskId, "RUNNING");

				await agentService.processUserMessage({
					taskId: data.taskId,
					userMessage: data.message,
					queue: data.queue || false,
				});
			} catch (error) {
				console.error("Error processing user message:", error);
				socket.emit("message-error", { error: "Failed to process message" });
			}
		});

		// Handle request for chat history
		socket.on("get-chat-history", async (data) => {
			console.log(`[SOCKET] Received get-chat-history request:`, {
				taskId: data.taskId,
				complete: data.complete,
				connectionId,
			});

			try {
				const hasAccess = await verifyTaskAccess(connectionId, data.taskId);
				if (!hasAccess) {
					socket.emit("message-error", { error: "Access denied to task" });
					return;
				}

				const history = await agentService.getChatHistory(data.taskId);
				console.log(`[SOCKET] Successfully retrieved chat history:`, {
					taskId: data.taskId,
					messageCount: history.length,
					complete: data.complete,
				});

				socket.emit("chat-history", {
					taskId: data.taskId,
					messages: history,
					queuedAction: null,
				});
			} catch (error) {
				console.error(
					`[SOCKET] Error getting chat history for task ${data.taskId}:`,
					error,
				);
				socket.emit("chat-history-error", {
					error: "Failed to get chat history",
				});
			}
		});

		//  utils

		socket.on("error", (error) => {
			console.error(`[SOCKET] Connection error for ${connectionId}:`, error);
		});

		socket.on("disconnect", (reason) => {
			console.log(
				`[SOCKET] User disconnected: ${connectionId}, reason: ${reason}`,
			);

			const state = connectionStates.get(connectionId);
			if (state) {
				setTimeout(
					() => {
						connectionStates.delete(connectionId);
						console.log(
							`[SOCKET] Cleaned up connection state for ${connectionId}`,
						);
					},
					5 * 60 * 1000,
				);
			}
		});
	});

	return io;
}

export function startStream(taskId: string) {
	const streamState = getOrCreateTaskStreamState(taskId);
	streamState.chunks = [];
	streamState.isStreaming = true;
	console.log(`[SOCKET] Started stream for task ${taskId}`);
}

export function endStream(taskId: string) {
	const streamState = getOrCreateTaskStreamState(taskId);
	streamState.isStreaming = false;
	if (io) {
		emitToTask(taskId, "stream-complete", undefined);
	}
	console.log(`[SOCKET] Ended stream for task ${taskId}`);
}

export function handleStreamError(error: unknown, taskId: string) {
	const streamState = getOrCreateTaskStreamState(taskId);
	streamState.isStreaming = false;
	if (io) {
		emitToTask(taskId, "stream-error", error);
	}
	console.log(`[SOCKET] Stream error for task ${taskId}:`, error);
}

export function emitStreamChunk(chunk: CustomUIMessageChunk, taskId: string) {
	const chunkType = chunk.type;

	if (io) {
		emitToTask(taskId, "stream-chunk", chunk);
	}

	if (chunkType === "finish" || chunkType === "finish-step") {
		console.log(`[SOCKET] Chunk type: ${chunkType} for task ${taskId}`);
		endStream(taskId);
	}
}

export { cleanupTaskStreamState };
