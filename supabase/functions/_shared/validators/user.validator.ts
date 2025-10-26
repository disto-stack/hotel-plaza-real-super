import { type FieldConfig, FieldValidator } from "../utils/field-validator.ts";

export const userValidationConfig: FieldConfig = {
	email: {
		required: true,
		type: "email",
		maxLength: 255,
	},
	password: {
		required: true,
		type: "string",
		minLength: 6,
		maxLength: 128,
		custom: (value: string) => {
			if (value.length < 6) {
				return "Password must be at least 6 characters";
			}

			if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
				return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
			}

			return null;
		},
	},
	firstName: {
		required: true,
		type: "string",
		minLength: 2,
		maxLength: 100,
	},
	lastName: {
		required: true,
		type: "string",
		minLength: 2,
		maxLength: 100,
	},
	role: {
		required: true,
		type: "string",
		enum: ["admin", "receptionist"],
	},
};

export class UserValidator extends FieldValidator {
	constructor() {
		super(userValidationConfig);
	}
}
