import type { Guest } from "./guest.types";

export enum StayType {
	HOURLY = "hourly",
	NIGHTLY = "nightly",
}

export enum OccupationStatus {
	RESERVED = "reserved",
	CHECKED_IN = "checked_in",
	CHECKED_OUT = "checked_out",
	CANCELLED = "cancelled",
}

export interface Occupation {
	id: string;
	roomId: string;
	checkInDatetime: string;
	checkOutDatetime: string;
	stayType: StayType;
	numberOfGuests: number;
	totalPrice: number;
	basePrice?: number;
	discountAmount?: number;
	status: OccupationStatus;
	notes?: string;
	createdBy?: string;
	updatedBy?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
	guests?: Guest[];
}
