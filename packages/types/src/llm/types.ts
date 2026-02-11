import type { UIMessageChunk } from "ai";

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

export type CustomDataParts = {
	"todo-update": {
		todos: Array<{
			id: string;
			content: string;
			status: "pending" | "in_progress" | "completed" | "cancelled";
			sequence: number;
		}>;
		action: "updated" | "replaced";
		totalTodos?: number;
		completedTodos?: number;
	};
	"validation-error": ValidationErrorResult;
};

export type CustomUIMessageChunk = UIMessageChunk<CustomDataParts>;
