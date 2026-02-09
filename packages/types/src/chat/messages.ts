import type {
	ToolCallPart as BaseToolCallPart,
	FinishReason,
	TextPart,
	ToolResultPart,
} from "ai";

import type { TaskStatus } from "../core/index";
import type { ToolExecutionStatusType } from "../tools/execution";
import type { ToolResultTypes } from "../tools/tool-schemas";

// Error part type for AI SDK error chunks
export interface ErrorPart {
	type: "error";
	error: string;
	finishReason?: FinishReason;
}

export interface ReasoningPart {
	type: "reasoning";
	text: string;
	signature?: string;
}

export interface RedactedReasoningPart {
	type: "redacted-reasoning";
	data: string;
}

// Extended ToolCallPart with streaming state tracking
export interface ToolCallPart extends BaseToolCallPart {
	// Streaming state properties
	streamingState?: "starting" | "streaming" | "complete";
	argsComplete?: boolean; // Are args fully received?

	accumulatedArgsText?: string;
	partialArgs?: {
		target_coin?: string;
		action?: string;
		amount?: string;
		price?: string;
		stop_loss?: string;
		take_profit?: string;
	};
}

export type AssistantMessagePart =
	| TextPart
	| ToolCallPart
	| ToolResultPart
	| ReasoningPart
	| RedactedReasoningPart
	| ErrorPart;

export type CompletionTokenUsage = {
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
};

export type Message = {
	id: string;
	role: "user" | "assistant" | "tool" | "system";
	content: string;
	llmModel: string;
	createdAt: string;
	metadata?: MessageMetadata;
	stackedTaskId?: string;
	stackedTask?: {
		id: string;
		title: string;
		shadowBranch?: string;
		status?: TaskStatus;
	};
};

export interface MessageMetadata {
	tool?: {
		name: string;
		args: Record<string, unknown>;
		status: ToolExecutionStatusType;
		result?: ToolResultTypes["result"];
	};

	parts?: AssistantMessagePart[];

	isStreaming?: boolean;
	streamingState?: "starting" | "streaming" | "complete";
	partialArgs?: {
		target_coin?: string;
		action?: string;
		amount?: number;
		price?: number;
		stop_loss?: number;
		take_profit?: number;
	};

	// LLM usage metadata
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};

	// Finish reason
	finishReason?: FinishReason;
}

// Type guards for runtime type checking
export const isUserMessage = (
	message: Message,
): message is Message & { role: "user" } =>
	message.role.toLowerCase() === "user";

export const isAssistantMessage = (
	message: Message,
): message is Message & { role: "assistant" } =>
	message.role.toLowerCase() === "assistant";

export const isSystemMessage = (
	message: Message,
): message is Message & { role: "system" } =>
	message.role.toLowerCase() === "system";
