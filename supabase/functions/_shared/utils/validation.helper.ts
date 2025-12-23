// deno-lint-ignore-file no-explicit-any
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because we are using any> */

import {
	type ErrorDetails,
	ResponseBuilder,
} from "../lib/response.ts";
import type { FieldValidator, ValidationRule } from "./field-validator.ts";

export function validateRequest(
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

export function validatePartial<T>(
	data: any,
	validator: FieldValidator,
): {
	isValid: boolean;
	errors: ErrorDetails[];
	response?: Response;
	extractedData?: T;
} {
	const errors: ErrorDetails[] = [];
	const extractedData = {} as T;

	const config = (validator as any).config as Record<string, ValidationRule>;

	for (const [fieldName, value] of Object.entries(data)) {
		if (value === undefined || value === null) {
			continue;
		}

		const rules = config[fieldName];
		if (!rules) {
			continue;
		}

		const fieldErrors = validator.validateFieldValue(
			fieldName,
			value,
			rules,
			false,
			false,
		);

		errors.push(...fieldErrors);

		if (fieldErrors.length === 0) {
			(extractedData as any)[fieldName] = value;
		}
	}

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
		extractedData,
	};
}
