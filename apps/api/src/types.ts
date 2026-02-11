import type { Environment } from "@api/env";

import type { Database } from "./db";

export type HonoVariables = {
	db: Database;
};

export type AppBindings = { Variables: HonoVariables; Bindings: Environment };
