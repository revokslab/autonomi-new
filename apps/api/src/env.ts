import { z } from "zod";

const EnvSchema = z.object({
	// generic stuff
	PORT: z.string().optional().default("4000"),
	DATABASE_URL: z.url(),

	// better-auth
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.url(),

	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),

	TWITTER_CLIENT_ID: z.string(),
	TWITTER_CLIENT_SECRET: z.string(),

	OPENROUTER_API_KEY: z.string().optional(),
});

export type Environment = z.infer<typeof EnvSchema>;

// biome-ignore lint/suspicious/noExplicitAny: Accepts unknown data structure from environment
export function parseEnv(data: any) {
	const { data: env, error, success } = EnvSchema.safeParse(data);

	if (!success) {
		console.error("Invalid environment variables:", error.format());
		process.exit(1);
	}

	return env;
}
