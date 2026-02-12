import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import { auth } from "@api/lib/auth";

export const withAuth: MiddlewareHandler = async (c, next) => {
	try {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });
		if (!session || !session.user) {
			throw new HTTPException(401, { message: "Not authenticated" });
		}
		c.set("session", session);
		await next();
	} catch {
		throw new HTTPException(401, { message: "Not authenticated" });
	}
};
