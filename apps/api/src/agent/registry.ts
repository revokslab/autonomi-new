import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createProviderRegistry } from "ai";

export const registry = createProviderRegistry({
	google: createGoogleGenerativeAI(),
});
