import { treeifyError, type z } from "zod";

export interface ValidationResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export function createValidator<T>(schema: z.ZodSchema<T>) {
	return (data: unknown): ValidationResult<T> => {
		const result = schema.safeParse(data);
		if (result.success) {
			return { success: true, data: result.data };
		} else {
			const errorMessage = treeifyError(result.error);
			return { success: false, error: errorMessage.errors.join(", ") };
		}
	};
}
