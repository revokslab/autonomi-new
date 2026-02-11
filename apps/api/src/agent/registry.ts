import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createProviderRegistry } from "ai";

import { env } from "@api/env-runtime";

export const registry = createProviderRegistry({
	google: createGoogleGenerativeAI({
		apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
	}),
});
