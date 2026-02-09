import { Server as Engine } from "@socket.io/bun-engine";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { Server } from "socket.io";

import { env } from "./env-runtime";
import { auth } from "./lib/auth";
import { routers } from "./rest/routers";
import { createRouter } from "./utils";

const io = new Server();
const engine = new Engine();

io.bind(engine);

io.on("connection", (socket) => {
	// ...
	console.log(socket.connected);
});

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

app.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.route("/v1", routers);

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
