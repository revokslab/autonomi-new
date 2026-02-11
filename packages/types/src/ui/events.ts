import type { Message } from "../chat/messages";
import type { TaskStatus } from "../core/tasks";
import type { CustomUIMessageChunk } from "../llm/types";

export type QueuedActionUI = {
	type: "message";
	message: string;
};

export interface TaskStatusUpdateEvent {
	taskId: string;
	status: TaskStatus;
	timestamp: string;
	errorMessage?: string;
}

export type ServerToClientEvents = {
	"connection-info": (data: {
		connectionId: string;
		reconnectCount: number;
		timestamp: number;
	}) => void;

	"chat-history": (data: {
		taskId: string;
		messages: Message[];
		queuedAction: QueuedActionUI | null;
	}) => void;

	"chat-history-error": (data: { error: string }) => void;
	"stream-state": (state: {
		chunks: CustomUIMessageChunk[];
		isStreaming: boolean;
		totalChunks: number;
	}) => void;
	"stream-chunk": (chunk: CustomUIMessageChunk) => void;
	"stream-complete": () => void;
	"stream-error": (error: unknown) => void;
	"stream-update": (data: {
		content: string;
		isIncremental: boolean;
		fromPosition: number;
		totalLength: number;
	}) => void;
	"message-error": (data: { error: string }) => void;
	"history-complete": (data: { taskId: string; totalLength: number }) => void;
	"history-error": (data: { error: string }) => void;

	"task-status-updated": (data: TaskStatusUpdateEvent) => void;
	"queued-action-processing": (data: {
		taskId: string;
		type: "message";
		message: string;
		title?: string;
		newTaskId?: string;
	}) => void;
};

export interface ClientToServerEvents {
	"join-task": (data: { taskId: string }) => void;
	"leave-task": (data: { taskId: string }) => void;

	"user-message": (data: {
		taskId: string;
		message: string;
		queue?: boolean;
	}) => void;
	"edit-user-message": (data: {
		taskId: string;
		messageId: string;
		message: string;
	}) => void;
	"get-chat-history": (data: { taskId: string; complete: boolean }) => void;
	"stop-stream": (data: { taskId: string }) => void;
	"request-history": (data: { taskId: string; fromPosition?: number }) => void;
	"clear-queued-action": (data: { taskId: string }) => void;

	heartbeat: () => void;
}
