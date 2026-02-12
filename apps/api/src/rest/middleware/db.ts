import type { MiddlewareHandler } from "hono";

import { db } from "@api/db";

/**
 * Database middleware that connects to the database and sets it on context
 */
export const withDatabase: MiddlewareHandler = async (c, next) => {
	c.set("db", db);
	await next();
};
