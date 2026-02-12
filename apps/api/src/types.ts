import type { Session } from "better-auth";

import type { Environment } from "@api/env";
import type { Database } from "./db";

export type HonoVariables = {
	db: Database;
	session: Session;
};

export type AppBindings = { Variables: HonoVariables; Bindings: Environment };
