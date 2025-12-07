// deno-lint-ignore-file no-explicit-any
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because the custom validator is using any> */

import type { ErrorDetails } from "../lib/response.ts";
import { OccupationStatus, StayType } from "../types/occupation.type.ts";
import { type FieldConfig, FieldValidator } from "../utils/field-validator.ts";

export const occupationValidationConfig: FieldConfig = {
	roomId: {
		required: true,
		type: "uuid",
	},
	checkInDate: {
		required: true,
		type: "date",
	},
	checkInTime: {
		required: true,
		type: "time",
	},
	checkOutDate: {
		required: true,
		type: "date",
	},
	checkOutTime: {
		required: true,
		type: "time",
	},
	stayType: {
		required: true,
		type: "string",
		enum: [StayType.HOURLY, StayType.NIGHTLY] as StayType[],
	},
	numberOfGuests: {
		required: true,
		type: "number",
		min: 1,
	},
	totalPrice: {
		required: true,
		type: "number",
		min: 0,
	},
	basePrice: {
		type: "number",
		min: 0,
	},
	discountAmount: {
		type: "number",
		min: 0,
	},
	status: {
		type: "string",
		enum: [
			OccupationStatus.RESERVED,
			OccupationStatus.CHECKED_IN,
			OccupationStatus.CHECKED_OUT,
			OccupationStatus.CANCELLED,
		],
	},
	notes: {
		type: "string",
		maxLength: 1000,
	},
	guests: {
		required: true,
		custom: (value: any) => {
			if (!Array.isArray(value)) {
				return "guests must be an array";
			}

			if (value.length === 0) {
				return "guests array must contain at least one guest";
			}

			for (let i = 0; i < value.length; i++) {
				const guest = value[i];
				if (!guest || typeof guest !== "object") {
					return `guests[${i}] must be an object`;
				}
				if (!guest.guestId || typeof guest.guestId !== "string") {
					return `guests[${i}].guestId is required and must be a string`;
				}
				if (typeof guest.isPrimary !== "boolean") {
					return `guests[${i}].isPrimary must be a boolean`;
				}
			}

			const primaryCount = value.filter(
				(g: any) => g.isPrimary === true,
			).length;

			if (primaryCount === 0) {
				return "At least one guest must be marked as primary (isPrimary: true)";
			}

			if (primaryCount > 1) {
				return "Only one guest can be marked as primary (isPrimary: true)";
			}

			return null;
		},
	},
};

export class OccupationValidator extends FieldValidator {
	constructor() {
		super(occupationValidationConfig);
	}

	override validate(data: Record<string, any>): ErrorDetails[] {
		const errors = super.validate(data);

		if (
			data.checkInDate &&
			data.checkInTime &&
			data.checkOutDate &&
			data.checkOutTime
		) {
			const checkInDateTime = new Date(
				`${data.checkInDate}T${data.checkInTime}`,
			);
			const checkOutDateTime = new Date(
				`${data.checkOutDate}T${data.checkOutTime}`,
			);

			if (checkOutDateTime <= checkInDateTime) {
				errors.push({
					field: "checkOutDate",
					message:
						"checkOutDate and checkOutTime must be after checkInDate and checkInTime",
				});
			}
		}

		return errors;
	}
}
