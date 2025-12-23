// deno-lint-ignore-file no-explicit-any
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because we are using any> */

import { type ErrorDetails, ResponseBuilder } from "../lib/response.ts";
import type { FieldValidator } from "./field-validator.ts";

export function validateRequest<T>(
	data: any,
	validator: FieldValidator,
): { isValid: boolean; errors: ErrorDetails[]; response?: Response } {
	const errors = validator.validate(data);

	if (errors.length > 0) {
		return {
			isValid: false,
			errors,
			response: ResponseBuilder.validationError(errors),
		};
	}

	return {
		isValid: true,
		errors: [],
	};
}

export function validateAndExtract<T>(
	data: any,
	validator: FieldValidator,
	requiredFields: (keyof T)[],
): {
	isValid: boolean;
	errors: ErrorDetails[];
	response?: Response;
	extractedData?: T;
} {
	const validation = validateRequest(data, validator);

	if (!validation.isValid) {
		return validation;
	}

	const extractedData = {} as T;
	for (const field of requiredFields) {
		if (data[field] !== undefined) {
			extractedData[field] = data[field];
		}
	}

	return {
		isValid: true,
		errors: [],
		extractedData,
	};
}
