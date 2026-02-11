import type {
	ToolCallPart as BaseToolCallPart,
	FinishReason,
	TextPart,
	ToolResultPart,
	UIMessage,
} from "ai";

import type { ToolExecutionStatusType } from "../tools/execution";
import type { ToolResultTypes } from "../tools/tool-schemas";

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

export interface ToolCallPart extends BaseToolCallPart {
	streamingState?: "starting" | "streaming" | "complete";
	argsComplete?: boolean;
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

export interface MessageMetadata {
	tool?: {
		name: string;
		args: Record<string, unknown>;
		status: ToolExecutionStatusType;
		result?: ToolResultTypes["result"];
	};
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
	usage?: CompletionTokenUsage;
	finishReason?: FinishReason;
}

export type Message = UIMessage<MessageMetadata>;
