import { createRouter } from "@api/utils";

const routers = createRouter();

routers.get("/health", (c) => {
	return c.json({ status: "ok" });
});

export { routers };
