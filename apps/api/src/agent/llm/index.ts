import type {
	CustomDataParts,
	CustomUIMessageChunk,
	Message,
	ToolName,
} from "@autonomi/types";
import { ToolResultSchemas, type ValidationErrorResult } from "@autonomi/types";
import {
	convertToModelMessages,
	createUIMessageStream,
	generateText,
	NoSuchToolError,
	Output,
	stepCountIs,
	streamText,
	type ToolSet,
	type UIMessage,
} from "ai";
import type { ZodType } from "zod";

import { registry } from "@api/agent/registry";
import { createTools } from "@api/agent/tools";
import { ToolValidator } from "./validation/tool-validator";

const MAX_STEPS = 100;

export class LLMService {
	private toolValidator: ToolValidator;

	constructor() {
		this.toolValidator = new ToolValidator();
	}
	createMessageStream(
		systemPrompt: string,
		messages: Message[],
		taskId: string,
		abortSignal?: AbortSignal,
		preCreatedTools?: ToolSet,
	): ReadableStream<CustomUIMessageChunk> {
		const tools: ToolSet = preCreatedTools ?? createTools(taskId);

		const toolCallMap = new Map<string, ToolName>();

		type StreamUIMessage = UIMessage<never, CustomDataParts>;

		return createUIMessageStream<StreamUIMessage>({
			execute: async ({ writer }) => {
				try {
					const modelMessages = await convertToModelMessages(messages, {
						tools,
					});

					const result = streamText({
						model: registry.languageModel("google:gemini-2.0-flash"),
						system: systemPrompt,
						messages: modelMessages,
						tools,
						stopWhen: stepCountIs(MAX_STEPS),
						...(abortSignal ? { abortSignal } : {}),
						experimental_repairToolCall: async ({
							toolCall,
							tools: availableTools,
							inputSchema,
							error,
						}) => {
							if (NoSuchToolError.isInstance(error)) {
								return null;
							}

							try {
								const targetTool =
									availableTools[
										toolCall.toolName as keyof typeof availableTools
									];
								if (!targetTool || !("inputSchema" in targetTool)) {
									return null;
								}

								const toolInputSchema = (
									targetTool as {
										inputSchema: ZodType;
									}
								).inputSchema;

								const { output } = await generateText({
									model: registry.languageModel("google:gemini-2.0-flash"),
									output: Output.object({
										schema: toolInputSchema,
									}),
									prompt: [
										`The model tried to call "${toolCall.toolName}" with these inputs:`,
										JSON.stringify(toolCall.input),
										`Expected schema:\n${JSON.stringify(inputSchema(toolCall))}`,
										`Error: ${error instanceof Error ? error.message : String(error)}`,
										"Please provide the corrected inputs matching the schema exactly.",
									].join("\n"),
								});

								return {
									...toolCall,
									input: JSON.stringify(output),
								};
							} catch (repairError) {
								console.warn(
									`[REPAIR] Failed to repair ${toolCall.toolName}:`,
									repairError instanceof Error
										? repairError.message
										: String(repairError),
								);
								return null;
							}
						},
					});

					const toolValidator = this.toolValidator;
					(async () => {
						try {
							for await (const part of result.fullStream) {
								if (part.type === "tool-call") {
									if (part.toolName in ToolResultSchemas) {
										toolCallMap.set(part.toolCallId, part.toolName as ToolName);
									} else {
										const availableTools =
											Object.keys(ToolResultSchemas).join(", ");
										const errorResult: ValidationErrorResult = {
											success: false,
											error: `Unknown tool: ${part.toolName}. Available tools are: ${availableTools}`,
											suggestedFix: `Please use one of the available tools: ${availableTools}`,
											originalResult: undefined,
											validationDetails: {
												expectedType: "Known tool name",
												receivedType: `Unknown tool: ${part.toolName}`,
												fieldPath: "toolName",
											},
										};

										writer.write({
											type: "data-validation-error",
											id: `validation-error-${part.toolCallId}`,
											data: errorResult,
										});
									}
								}

								if (part.type === "tool-result") {
									const knownToolName =
										toolCallMap.get(part.toolCallId) ??
										(part.toolName in ToolResultSchemas
											? (part.toolName as ToolName)
											: undefined);

									if (knownToolName) {
										const validation = toolValidator.validateToolResult(
											knownToolName,
											part.output,
										);

										if (!validation.isValid && validation.errorDetails) {
											const errorResult: ValidationErrorResult = {
												success: false,
												error: validation.errorDetails.error,
												suggestedFix: validation.errorDetails.suggestedFix,
												originalResult: validation.errorDetails.originalResult,
											};

											writer.write({
												type: "data-validation-error",
												id: `validation-error-${part.toolCallId}`,
												data: errorResult,
											});
										}
									}
								}
							}
						} catch (streamError) {
							console.error(
								"[LLM_SERVICE] Stream processing error:",
								streamError,
							);
						}
					})();

					writer.merge(result.toUIMessageStream());
				} catch (error) {
					console.error("[LLM_SERVICE] Error:", error);
					writer.write({
						type: "error",
						errorText: error instanceof Error ? error.message : "Unknown error",
					});
				}
			},
		});
	}
}
