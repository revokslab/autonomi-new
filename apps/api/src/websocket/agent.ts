import type {
	ClientToServerEvents,
	CustomUIMessageChunk,
	ServerToClientEvents,
} from "@autonomi/types";
import type { Server as Engine } from "@socket.io/bun-engine";
import { Server, type Socket } from "socket.io";

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
	io = new Server({});

	io.bind(engine);

	io.on("connection", (socket: TypedSocket) => {
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

		socket.on("heartbeat", () => {
			const state = connectionStates.get(connectionId);
			if (state) {
				state.lastSeen = Date.now();
				connectionStates.set(connectionId, state);
			}
		});

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
