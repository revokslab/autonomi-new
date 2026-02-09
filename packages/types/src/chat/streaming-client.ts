import type { FinishReason } from "ai";
import type { ToolResultTypes } from "../tools/tool-schemas";
import type { CompletionTokenUsage } from "./messages";

// Validation error result interface
export interface ValidationErrorResult {
	success: false;
	error: string;
	suggestedFix?: string;
	originalResult?: unknown;
	validationDetails?: {
		expectedType: string;
		receivedType: string;
		fieldPath?: string;
	};
}

export interface StreamChunk {
	type:
		| "content"
		| "usage"
		| "complete"
		| "error"
		| "tool-call"
		| "tool-call-start"
		| "tool-call-delta"
		| "tool-result"
		| "reasoning"
		| "reasoning-signature"
		| "redacted-reasoning"
		| "todo-update";

	// For content chunks
	content?: string;

	// For reasoning chunks
	reasoning?: string; // Incremental reasoning text delta
	reasoningSignature?: string; // Verification signature
	redactedReasoningData?: string; // Complete redacted reasoning block

	usage?: CompletionTokenUsage & {
		// Provider-specific tokens
		cacheCreationInputTokens?: number;
		cacheReadInputTokens?: number;
	};

	// For completion/error
	finishReason?: FinishReason;
	error?: string;

	// For tool calls
	toolCall?: {
		id: string;
		name: string;
		args: Record<string, unknown>;
	};

	// For tool results
	toolResult?: {
		id: string;
		result: ToolResultTypes["result"] | ValidationErrorResult;
		isValid?: boolean;
	};

	// For tool call streaming start
	toolCallStart?: {
		id: string;
		name: string;
	};
}
