import { HTTPException } from "hono/http-exception";

import type { Database } from "@api/db";
import { getAgentTaskById } from "@api/db/queries";

/**
 * Verify that the given task belongs to the provided user.
 *
 * Throws HTTPException on failure to match the patterns used across the API.
 */
export const verifyTaskOwnership = async (
	dbConn: Database,
	userId: string,
	taskId: string,
) => {
	const task = await getAgentTaskById(dbConn, taskId);

	if (!task) {
		throw new HTTPException(404, { message: "Agent task not found" });
	}

	if (task.userId !== userId) {
		throw new HTTPException(403, { message: "Forbidden" });
	}

	return task;
};
