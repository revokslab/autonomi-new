import { db } from "@api/db";
import { agentTasks } from "@api/db/schema";
import { eq } from "drizzle-orm";

export const getAgentTaskById = async (taskId: string) => {
	return db.query.agentTasks.findFirst({
		where: eq(agentTasks.id, taskId),
	});
};

export const getAgentTaskByUserId = async (userId: string) => {
	return db.query.agentTasks.findMany({
		where: eq(agentTasks.userId, userId),
	});
};
