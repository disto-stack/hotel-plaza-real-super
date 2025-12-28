import type { GuestResponse } from "./guest.types";
import type { Room } from "./room.types";

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

export interface OccupationGuest {
	id: string;
	occupationId: string;
	guestId: string;
	guest?: GuestResponse;
	isPrimary: boolean;
	createdAt: string;
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
	room?: Room;
	guests?: OccupationGuest[];
}
