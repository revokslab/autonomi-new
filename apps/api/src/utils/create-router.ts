import type { AppBindings } from "@api/types";

import { OpenAPIHono } from "@hono/zod-openapi";

export function createRouter() {
	return new OpenAPIHono<AppBindings>();
}
