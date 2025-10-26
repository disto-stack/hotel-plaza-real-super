// deno-lint-ignore-file no-explicit-any
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because we are using any> */

import { createValidationError, type ErrorDetails } from "../lib/response.ts";

export interface ValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	custom?: (value: any) => string | null;
	type?: "string" | "number" | "boolean" | "email" | "phone" | "date";
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
		if (
			rules.required &&
			(value === undefined || value === null || value === "")
		) {
			this.addError(fieldName, `${fieldName} is required`);
			return;
		}

		if (value === undefined || value === null || value === "") {
			return;
		}

		if (rules.type) {
			const typeError = this.validateType(fieldName, value, rules.type);
			if (typeError) {
				this.addError(fieldName, typeError);
				return;
			}
		}

		if (typeof value === "string") {
			if (rules.minLength && value.length < rules.minLength) {
				this.addError(
					fieldName,
					`${fieldName} must be at least ${rules.minLength} characters`,
				);
			}

			if (rules.maxLength && value.length > rules.maxLength) {
				this.addError(
					fieldName,
					`${fieldName} must be at most ${rules.maxLength} characters`,
				);
			}

			if (rules.pattern && !rules.pattern.test(value)) {
				this.addError(fieldName, `${fieldName} has invalid format`);
			}
		}

		if (rules.enum && !rules.enum.includes(value)) {
			this.addError(
				fieldName,
				`${fieldName} must be one of: ${rules.enum.join(", ")}`,
			);
		}

		if (rules.custom) {
			const customError = rules.custom(value);
			if (customError) {
				this.addError(fieldName, customError);
			}
		}
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
