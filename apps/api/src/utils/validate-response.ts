import type { ZodSchema } from "zod";

export const validateResponse = <T>(data: unknown, schema: ZodSchema<T>): T => {
	const result = schema.safeParse(data);

	if (!result.success) {
		const cause = result.error.flatten();

		throw new Error(`Response validation failed: ${JSON.stringify(cause)}`);
	}

	return result.data;
};
