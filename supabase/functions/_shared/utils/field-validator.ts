// deno-lint-ignore-file no-explicit-any
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because we are using any> */

import { createValidationError, type ErrorDetails } from "../lib/response.ts";

export interface ValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	pattern?: RegExp;
	custom?: (value: any) => string | null;
	type?:
		| "string"
		| "number"
		| "boolean"
		| "email"
		| "phone"
		| "date"
		| "datetime"
		| "uuid"
		| "time";
	enum?: any[];
}

export interface FieldConfig {
	[fieldName: string]: ValidationRule;
}

export class FieldValidator {
	private errors: ErrorDetails[] = [];

	constructor(private config: FieldConfig) {}

	validate(data: Record<string, any>): ErrorDetails[] {
		this.errors = [];

		for (const [fieldName, rules] of Object.entries(this.config)) {
			const value = data[fieldName];
			this.validateField(fieldName, value, rules);
		}

		return this.errors;
	}

	private validateField(
		fieldName: string,
		value: any,
		rules: ValidationRule,
	): void {
		this.validateFieldValue(fieldName, value, rules, true, true);
	}

	validateFieldValue(
		fieldName: string,
		value: any,
		rules: ValidationRule,
		checkRequired: boolean = true,
		addToErrors: boolean = false,
	): ErrorDetails[] {
		const fieldErrors: ErrorDetails[] = [];

		if (
			checkRequired &&
			rules.required &&
			(value === undefined || value === null || value === "")
		) {
			const error = createValidationError(fieldName, `${fieldName} is required`);
			fieldErrors.push(error);
			if (addToErrors) {
				this.addError(fieldName, error.message);
			}
			return fieldErrors;
		}

		if (value === undefined || value === null || value === "") {
			return fieldErrors;
		}

		if (rules.type) {
			const typeError = this.validateType(fieldName, value, rules.type);
			if (typeError) {
				const error = createValidationError(fieldName, typeError);
				fieldErrors.push(error);
				if (addToErrors) {
					this.addError(fieldName, error.message);
				}
				return fieldErrors;
			}
		}

		if (typeof value === "string") {
			if (rules.minLength && value.length < rules.minLength) {
				const error = createValidationError(
					fieldName,
					`${fieldName} must be at least ${rules.minLength} characters`,
				);
				fieldErrors.push(error);
				if (addToErrors) {
					this.addError(fieldName, error.message);
				}
			}

			if (rules.maxLength && value.length > rules.maxLength) {
				const error = createValidationError(
					fieldName,
					`${fieldName} must be at most ${rules.maxLength} characters`,
				);
				fieldErrors.push(error);
				if (addToErrors) {
					this.addError(fieldName, error.message);
				}
			}

			if (rules.pattern && !rules.pattern.test(value)) {
				const error = createValidationError(
					fieldName,
					`${fieldName} has invalid format`,
				);
				fieldErrors.push(error);
				if (addToErrors) {
					this.addError(fieldName, error.message);
				}
			}
		}

		if (rules.enum && !rules.enum.includes(value)) {
			const error = createValidationError(
				fieldName,
				`${fieldName} must be one of: ${rules.enum.join(", ")}`,
			);
			fieldErrors.push(error);
			if (addToErrors) {
				this.addError(fieldName, error.message);
			}
		}

		if (typeof value === "number") {
			if (rules.min !== undefined && value < rules.min) {
				const error = createValidationError(
					fieldName,
					`${fieldName} must be greater than or equal to ${rules.min}`,
				);
				fieldErrors.push(error);
				if (addToErrors) {
					this.addError(fieldName, error.message);
				}
			}

			if (rules.max !== undefined && value > rules.max) {
				const error = createValidationError(
					fieldName,
					`${fieldName} must be less than or equal to ${rules.max}`,
				);
				fieldErrors.push(error);
				if (addToErrors) {
					this.addError(fieldName, error.message);
				}
			}
		}

		if (rules.custom) {
			const customError = rules.custom(value);
			if (customError) {
				const error = createValidationError(fieldName, customError);
				fieldErrors.push(error);
				if (addToErrors) {
					this.addError(fieldName, error.message);
				}
			}
		}

		return fieldErrors;
	}

	private validateType(
		fieldName: string,
		value: any,
		type: string,
	): string | null {
		switch (type) {
			case "string":
				return typeof value !== "string"
					? `${fieldName} must be a string`
					: null;
			case "number":
				return typeof value !== "number" || Number.isNaN(value)
					? `${fieldName} must be a number`
					: null;
			case "boolean":
				return typeof value !== "boolean"
					? `${fieldName} must be a boolean`
					: null;
			case "email": {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return !emailRegex.test(value)
					? `${fieldName} must be a valid email`
					: null;
			}
			case "phone": {
				const phoneRegex = /^\+?[1-9]\d{1,14}$/;
				return !phoneRegex.test(value)
					? `${fieldName} must be a valid phone number`
					: null;
			}
			case "date": {
				const date = new Date(value);
				return Number.isNaN(date.getTime())
					? `${fieldName} must be a valid date`
					: null;
			}
			case "datetime": {
				const datetime = new Date(value);
				return Number.isNaN(datetime.getTime())
					? `${fieldName} must be a valid datetime`
					: null;
			}
			case "uuid": {
				const uuidRegex =
					/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
				return !uuidRegex.test(value)
					? `${fieldName} must be a valid UUID`
					: null;
			}
			case "time": {
				const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
				return !timeRegex.test(value)
					? `${fieldName} must be in HH:mm:ss or HH:mm format`
					: null;
			}
			default:
				return null;
		}
	}

	private addError(fieldName: string, message: string): void {
		this.errors.push(createValidationError(fieldName, message));
	}

	isValid(): boolean {
		return this.errors.length === 0;
	}
}
