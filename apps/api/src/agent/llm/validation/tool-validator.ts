import {
	createValidator,
	type ToolName,
	ToolResultSchemas,
	type ToolResultTypes,
	type ValidationErrorResult,
} from "@autonomi/types";

import { ValidationHelpers } from "./validation-helpers";

export class ToolValidator {
	private validationHelpers = new ValidationHelpers();

	validateToolResult(
		toolName: ToolName | string,
		result: unknown,
	): {
		isValid: boolean;
		validatedResult: ToolResultTypes["result"] | ValidationErrorResult;
		shouldEmitError: boolean;
		errorDetails?: {
			error: string;
			suggestedFix: string;
			originalResult: unknown;
		};
	} {
		try {
			const schema = ToolResultSchemas[toolName as ToolName];
			// biome-ignore lint/suspicious/noExplicitAny: Schema type is dynamic based on toolName
			const validation = createValidator(schema as any)(result);

			if (validation.success) {
				return {
					isValid: true,
					validatedResult:
						validation.data as unknown as ToolResultTypes["result"],
					shouldEmitError: false,
				};
			}

			console.log(`[VALIDATION_DEBUG] Validation failed for ${toolName}:`, {
				validationError: validation.error,
				validationSuccess: validation.success,
			});

			const errorMessage = `Tool call validation failed for ${toolName}: ${validation.error}`;
			const suggestedFix =
				this.validationHelpers.generateToolValidationSuggestion(
					toolName,
					validation.error || "",
				);

			const errorResult: ValidationErrorResult = {
				success: false,
				error: errorMessage,
				suggestedFix,
				originalResult: result,
				validationDetails: {
					expectedType: "Valid tool result schema",
					receivedType: typeof result,
					fieldPath: validation.error || "",
				},
			};

			return {
				isValid: false,
				validatedResult: errorResult,
				shouldEmitError: true,
				errorDetails: {
					error: errorMessage,
					suggestedFix,
					originalResult: result,
				},
			};
		} catch (error) {
			const fallbackMessage = `Unexpected validation error for tool ${toolName}: ${error instanceof Error ? error.message : "Unknown error"}`;

			return {
				isValid: false,
				validatedResult: {
					success: false,
					error: fallbackMessage,
					suggestedFix:
						"Please retry the tool call with valid parameters according to the tool schema.",
					originalResult: result,
				} as ValidationErrorResult,
				shouldEmitError: true,
				errorDetails: {
					error: fallbackMessage,
					suggestedFix:
						"Please retry the tool call with valid parameters according to the tool schema.",
					originalResult: result,
				},
			};
		}
	}
}
