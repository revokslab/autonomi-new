import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	agentTasks: many(agentTasks),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

// Agent

export const agentTaskStatus = pgEnum("agent_task_status", [
	"STOPPED",
	"INITIALIZING",
	"ARCHIVED",
	"RUNNING",
	"COMPLETED",
	"FAILED",
]);

export type AgentTaskStatus = (typeof agentTaskStatus.enumValues)[number];

export const agentTaskInitStatus = pgEnum("agent_task_init_status", [
	"ACTIVE",
	"INACTIVE",
]);

export type AgentTaskInitStatus =
	(typeof agentTaskInitStatus.enumValues)[number];

export const agentTasks = pgTable("agent_tasks", {
	id: text().primaryKey(),
	title: text(),
	taskStatus: agentTaskStatus("task_status").default("INITIALIZING"),
	mainModel: text("main_model"),
	initStatus: agentTaskInitStatus("init_status").default("INACTIVE"),
	initializationError: text(),
	errorMessage: text(),
	userId: text("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
});

export const agentTaskRelations = relations(agentTasks, ({ many }) => ({
	todos: many(agentTodos),
	chatMessages: many(chatMessages),
}));

export const agentTodoStatus = pgEnum("agent_todo_status", [
	"PENDING",
	"INPROGRESS",
	"COMPLETED",
	"CANCELLED",
]);

export type AgentTodoStatus = (typeof agentTodoStatus.enumValues)[number];

export const agentTodos = pgTable(
	"agent_todos",
	{
		id: text().primaryKey(),
		content: text(),
		status: agentTodoStatus().default("PENDING"),
		sequence: integer(),
		taskId: text("task_id")
			.references(() => agentTasks.id, {
				onDelete: "cascade",
			})
			.notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at"),
	},
	(table) => [
		index("todo_task_id_idx").on(table.taskId),
		index("todo_task_sequence_idx").on(table.sequence),
		index("todo_task_status_idx").on(table.status),
	],
);

export const agentTodosRelations = relations(agentTodos, ({ one }) => ({
	task: one(agentTasks, {
		fields: [agentTodos.id],
		references: [agentTasks.id],
	}),
}));

export const chatMessages = pgTable("chat_messages", {
	id: text().primaryKey(),
	content: text().notNull(),
	role: text().notNull().$type<"user" | "assistant" | "system">(),
	metadata: jsonb(),
	sequence: integer(),
	promptTokens: integer("prompt_tokens"),
	completionTokens: integer("completion_tokens"),
	totalTokens: integer("total_tokens"),
	finishReason: text(),
	taskId: text("task_id")
		.references(() => agentTasks.id)
		.notNull(),
	stackedTaskId: text("stacked_task_id").references(() => agentTasks.id),
	createdAt: timestamp("created_at"),
});

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
	stackedTask: one(agentTasks, {
		fields: [chatMessages.stackedTaskId],
		references: [agentTasks.id],
	}),
	task: one(agentTasks, {
		fields: [chatMessages.taskId],
		references: [agentTasks.id],
	}),
}));

export const agentTaskMemoryCategory = pgEnum("agent_task_memory_category", [
	"STYLES",
	"PERFORMANCE",
	"CONFIG",
	"GENERAL",
]);

export const agentTaskMemories = pgTable("agent_task_memories", {
	id: text().primaryKey(),
	content: text(),
	memoryCategory: agentTaskMemoryCategory("memory_category"),

	// User and task context
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	taskId: text("task_id").references(() => agentTasks.id, {
		onDelete: "cascade",
	}),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at"),
});

export const agentTaskMemoriesRelations = relations(
	agentTaskMemories,
	({ one }) => ({
		user: one(user, {
			fields: [agentTaskMemories.userId],
			references: [user.id],
		}),
		task: one(agentTasks, {
			fields: [agentTaskMemories.taskId],
			references: [agentTasks.id],
		}),
	}),
);

export const userSettings = pgTable("user_settings", {
	id: text().primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	memoriesEnabled: boolean("memories_enabled").default(true).notNull(),
	rules: text(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at"),
});

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type AgentTask = InferSelectModel<typeof agentTasks>;
export type AgentTodo = InferSelectModel<typeof agentTodos>;
export type ChatMessage = InferSelectModel<typeof chatMessages>;
export type AgentTaskMemory = InferSelectModel<typeof agentTaskMemories>;
export type UserSetting = InferSelectModel<typeof userSettings>;

export type AgentTaskMemoryCategory =
	(typeof agentTaskMemoryCategory.enumValues)[number];
