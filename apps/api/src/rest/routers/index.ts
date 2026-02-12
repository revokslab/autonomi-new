import { createRouter } from "@api/utils";
import { protectedMiddleware, publicMiddleware } from "../middleware";
import { tasksRouter } from "./tasks";

const routers = createRouter();

// Public routes (not authenticated)

routers.use(...publicMiddleware);

// Authenticated routes

routers.use(...protectedMiddleware);

routers.route("/tasks", tasksRouter);

export { routers };
