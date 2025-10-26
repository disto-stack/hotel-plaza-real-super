import type { DocumentType } from "../types/guest.type.ts";
import { type FieldConfig, FieldValidator } from "../utils/field-validator.ts";

export const guestValidationConfig: FieldConfig = {
	firstName: {
		required: true,
		type: "string",
		minLength: 2,
		maxLength: 100,
		pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
	},
	lastName: {
		required: true,
		type: "string",
		minLength: 2,
		maxLength: 100,
		pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
	},
	email: {
		type: "email",
		maxLength: 255,
	},
	phone: {
		type: "phone",
		maxLength: 20,
	},
	documentType: {
		type: "string",
		enum: [
			"Passport",
			"National ID",
			"Identity Card",
			"Citizenship Card",
		] as DocumentType[],
	},
	documentNumber: {
		required: true,
		type: "string",
		maxLength: 50,
		pattern: /^[a-zA-Z0-9-]+$/,
	},
	occupation: {
		required: true,
		type: "string",
		maxLength: 100,
	},
	nationality: {
		type: "string",
		maxLength: 100,
	},
};

export class GuestValidator extends FieldValidator {
	constructor() {
		super(guestValidationConfig);
	}
}
