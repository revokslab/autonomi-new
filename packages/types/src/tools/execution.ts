// Tool Execution Status
// This is specifically for tool execution status, separate from database TaskStatus
export const ToolExecutionStatus = {
	RUNNING: "RUNNING",
	COMPLETED: "COMPLETED",
	FAILED: "FAILED",
} as const;

export type ToolExecutionStatusType =
	(typeof ToolExecutionStatus)[keyof typeof ToolExecutionStatus];
