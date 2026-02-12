import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings } from "@api/types";

export function createRouter() {
	return new OpenAPIHono<AppBindings>();
}
