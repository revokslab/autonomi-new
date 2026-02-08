import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import { env } from "./env-runtime";
import { auth } from "./lib/auth";
import { routers } from "./rest/routers";
import { createRouter } from "./utils";

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

export default {
	fetch: app.fetch,
	port: Number(env.PORT),
};
