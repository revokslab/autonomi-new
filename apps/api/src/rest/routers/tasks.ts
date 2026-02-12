import { createRoute, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
	createAgentTask,
	deleteAgentTaskById,
	getAgentTaskById,
	getAgentTaskByUserId,
	updateAgentTask,
} from "@api/db/queries";
import { verifyTaskOwnership } from "@api/lib/auth";
import {
	AgentTaskListResponseSchema,
	AgentTaskResponseSchema,
	CreateAgentTaskRequestSchema,
	UpdateAgentTaskRequestSchema,
} from "@api/schemas/tasks";
import { createRouter, generateId, validateResponse } from "@api/utils";

const tasksRouter = createRouter();

tasksRouter.openapi(
	createRoute({
		method: "post",
		tags: ["Tasks"],
		path: "/",
		request: {
			body: {
				content: {
					"application/json": {
						schema: CreateAgentTaskRequestSchema,
					},
				},
			},
		},
		responses: {
			201: {
				description: "Create a new agent task",
				content: {
					"application/json": {
						schema: AgentTaskResponseSchema,
					},
				},
			},
		},
	}),
	async (c) => {
		const db = c.get("db");
		const session = c.get("session");

		const body = await c.req.json();
		const parsedBody = CreateAgentTaskRequestSchema.parse(body);

		const [createdTask] = await createAgentTask(db, {
			id: generateId("task"),
			userId: session.userId,
			title: parsedBody.title ?? null,
		});

		return c.json(
			validateResponse({ data: createdTask }, AgentTaskResponseSchema),
			201,
		);
	},
);

tasksRouter.openapi(
	createRoute({
		method: "get",
		tags: ["Tasks"],
		path: "/",
		responses: {
			200: {
				description: "List of all agent tasks",
				content: {
					"application/json": {
						schema: AgentTaskListResponseSchema,
					},
				},
			},
		},
	}),
	async (c) => {
		const db = c.get("db");
		const session = c.get("session");

		const agentTasks = await getAgentTaskByUserId(db, session.userId);

		return c.json(
			validateResponse({ data: agentTasks }, AgentTaskListResponseSchema),
		);
	},
);

tasksRouter.openapi(
	createRoute({
		method: "patch",
		tags: ["Tasks"],
		path: "/{id}",
		request: {
			params: z.object({
				id: z.string().describe("Task ID"),
			}),
			body: {
				content: {
					"application/json": {
						schema: UpdateAgentTaskRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Update an agent task",
				content: {
					"application/json": {
						schema: AgentTaskResponseSchema,
					},
				},
			},
			404: {
				description: "Agent task not found",
				content: {
					"application/json": {
						schema: z.object({
							message: z.string().describe("Error message"),
						}),
					},
				},
			},
		},
	}),
	async (c) => {
		const db = c.get("db");
		const session = c.get("session");
		const { id } = c.req.valid("param");
		const body = c.req.valid("json");

		await verifyTaskOwnership(db, session.userId, id);

		const [updatedTask] = await updateAgentTask(db, {
			id,
			...body,
		});

		if (!updatedTask) {
			throw new HTTPException(404, {
				message: "Agent task not found",
			});
		}

		return c.json(
			validateResponse({ data: updatedTask }, AgentTaskResponseSchema),
			200,
		);
	},
);

tasksRouter.openapi(
	createRoute({
		method: "delete",
		tags: ["Tasks"],
		path: "/{id}",
		request: {
			params: z.object({
				id: z.string().describe("Task ID"),
			}),
		},
		responses: {
			200: {
				description: "Delete an agent task",
				content: {
					"application/json": {
						schema: AgentTaskResponseSchema,
					},
				},
			},
			404: {
				description: "Agent task not found",
				content: {
					"application/json": {
						schema: z.object({
							message: z.string().describe("Error message"),
						}),
					},
				},
			},
		},
	}),
	async (c) => {
		const db = c.get("db");
		const session = c.get("session");
		const { id } = c.req.valid("param");

		await verifyTaskOwnership(db, session.userId, id);

		const [deletedTask] = await deleteAgentTaskById(db, id);

		if (!deletedTask) {
			throw new HTTPException(404, {
				message: "Agent task not found",
			});
		}

		return c.json(
			validateResponse({ data: deletedTask }, AgentTaskResponseSchema),
			200,
		);
	},
);

tasksRouter.openapi(
	createRoute({
		method: "get",
		tags: ["Tasks"],
		path: "/{id}",
		request: {
			params: z.object({
				id: z.string().describe("Task ID"),
			}),
		},
		responses: {
			200: {
				description: "Get an agent task by ID",
				content: {
					"application/json": {
						schema: AgentTaskResponseSchema,
					},
				},
			},
			404: {
				description: "Agent task not found",
				content: {
					"application/json": {
						schema: z.object({
							message: z.string().describe("Error message"),
						}),
					},
				},
			},
		},
	}),
	async (c) => {
		const db = c.get("db");
		const { id } = c.req.valid("param");

		const agentTask = await getAgentTaskById(db, id);

		if (!agentTask) {
			throw new HTTPException(404, {
				message: "Agent task not found",
			});
		}

		return c.json(
			validateResponse({ data: agentTask }, AgentTaskResponseSchema),
			200,
		);
	},
);

export { tasksRouter };
