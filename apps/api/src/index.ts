import { Scalar } from "@scalar/hono-api-reference";
import { Server as Engine } from "@socket.io/bun-engine";
import { sql } from "drizzle-orm";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import { db } from "@api/db";
import { env } from "./env-runtime";
import { auth } from "./lib/auth";
import { routers } from "./rest/routers";
import { createRouter } from "./utils";
import { createSocketServer } from "./websocket";

const engine = new Engine();

createSocketServer(engine);

const app = createRouter();

app.use(secureHeaders());

app.use(
	"*",
	cors({
		origin: ["*"],
		credentials: true,
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowHeaders: [
			"Authorization",
			"Access-Control-Allow-Credentials",
			"Cookie",
			"Content-Type",
			"accept-language",
			"x-trpc-source",
			"x-user-locale",
			"x-user-timezone",
			"x-user-country",
			"X-Retry-After",
		],
		exposeHeaders: ["Content-Length"],
		maxAge: 86400,
	}),
);

app.doc("/openapi", {
	openapi: "3.1.0",
	info: {
		version: "0.0.1",
		title: "Autonomi Developer API",
		description: "Autonomi Developer API",
		contact: {
			name: "Support",
			email: "hello@autonomi.run",
			url: "autonomi.run",
		},
	},
	servers: [
		{
			url: env.BETTER_AUTH_URL,
			description: "Production API",
		},
	],
	security: [{ token: [] }],
});

// Register security scheme
app.openAPIRegistry.registerComponent("securitySchemes", "token", {
	type: "http",
	scheme: "bearer",
	description: "Default authenticaton mechanism",
});

app.get(
	"/",
	Scalar({ url: "/openapi", pageTitle: "Autonomi API", theme: "deepSpace" }),
);

app.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.route("/v1", routers);

app.get("/health", async (c) => {
	await db.execute(sql`SELECT 1`);
	return c.json({ status: "ok" });
});

app.all("/socket.io/", (c) => {
	const request = c.req.raw;
	const server = c.env;
	return engine.handleRequest(request, server);
});

export default {
	port: Number(env.PORT),
	...engine.handler(),
	fetch: app.fetch,
};
