// supabase/functions/_shared/mappers/occupation.mapper.ts

import type {
	CreateOccupationRequest,
	OccupationStatus,
	StayType,
	UpdateOccupationRequest,
} from "../types/occupation.type.ts";

export interface Occupation {
	id: string;
	roomId: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
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
}

export interface OccupationGuest {
	id: string;
	occupationId: string;
	guestId: string;
	isPrimary: boolean;
	createdAt: string;
}

export interface OccupationResponse {
	id: string;
	roomId: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
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
	guests?: OccupationGuest[];
}

export function occupationToDatabase(
	occupationData: CreateOccupationRequest | UpdateOccupationRequest,
): Record<string, unknown> {
	const dbData: Record<string, unknown> = {};

	if ("roomId" in occupationData) dbData.room_id = occupationData.roomId;
	if ("checkInDate" in occupationData)
		dbData.check_in_date = occupationData.checkInDate;
	if ("checkInTime" in occupationData)
		dbData.check_in_time = occupationData.checkInTime;
	if ("checkOutDate" in occupationData)
		dbData.check_out_date = occupationData.checkOutDate;
	if ("checkOutTime" in occupationData)
		dbData.check_out_time = occupationData.checkOutTime;
	if ("stayType" in occupationData) dbData.stay_type = occupationData.stayType;
	if ("numberOfGuests" in occupationData)
		dbData.number_of_guests = occupationData.numberOfGuests;
	if ("totalPrice" in occupationData)
		dbData.total_price = occupationData.totalPrice;
	if ("basePrice" in occupationData)
		dbData.base_price = occupationData.basePrice;
	if ("discountAmount" in occupationData)
		dbData.discount_amount = occupationData.discountAmount;
	if ("status" in occupationData) dbData.status = occupationData.status;
	if ("notes" in occupationData) dbData.notes = occupationData.notes;

	return dbData;
}

export function occupationToApi(
	occupationData: Record<string, unknown>,
): OccupationResponse {
	return {
		id: occupationData.id as string,
		roomId: occupationData.room_id as string,
		checkInDate: occupationData.check_in_date as string,
		checkInTime: occupationData.check_in_time as string,
		checkOutDate: occupationData.check_out_date as string,
		checkOutTime: occupationData.check_out_time as string,
		stayType: occupationData.stay_type as StayType,
		numberOfGuests: occupationData.number_of_guests as number,
		totalPrice: occupationData.total_price as number,
		basePrice: occupationData.base_price as number | undefined,
		discountAmount: occupationData.discount_amount as number | undefined,
		status: occupationData.status as OccupationStatus,
		notes: occupationData.notes as string | undefined,
		createdBy: occupationData.created_by as string | undefined,
		updatedBy: occupationData.updated_by as string | undefined,
		createdAt: occupationData.created_at as string,
		updatedAt: occupationData.updated_at as string,
		deletedAt: occupationData.deleted_at as string | undefined,
	};
}

export function occupationsToApiArray(
	occupationsData: Record<string, unknown>[],
): OccupationResponse[] {
	return occupationsData.map((occupation) => occupationToApi(occupation));
}

export function createOccupationToDatabase(
	occupationData: CreateOccupationRequest,
): Record<string, unknown> {
	return {
		room_id: occupationData.roomId,
		check_in_date: occupationData.checkInDate,
		check_in_time: occupationData.checkInTime,
		check_out_date: occupationData.checkOutDate,
		check_out_time: occupationData.checkOutTime,
		stay_type: occupationData.stayType,
		number_of_guests: occupationData.numberOfGuests,
		total_price: occupationData.totalPrice,
		base_price: occupationData.basePrice,
		discount_amount: occupationData.discountAmount,
		status: occupationData.status || "reserved",
		notes: occupationData.notes,
	};
}

export function updateOccupationToDatabase(
	occupationData: UpdateOccupationRequest,
): Record<string, unknown> {
	const dbData: Record<string, unknown> = {};

	if (occupationData.roomId !== undefined)
		dbData.room_id = occupationData.roomId;
	if (occupationData.checkInDate !== undefined)
		dbData.check_in_date = occupationData.checkInDate;
	if (occupationData.checkInTime !== undefined)
		dbData.check_in_time = occupationData.checkInTime;
	if (occupationData.checkOutDate !== undefined)
		dbData.check_out_date = occupationData.checkOutDate;
	if (occupationData.checkOutTime !== undefined)
		dbData.check_out_time = occupationData.checkOutTime;
	if (occupationData.stayType !== undefined)
		dbData.stay_type = occupationData.stayType;
	if (occupationData.numberOfGuests !== undefined)
		dbData.number_of_guests = occupationData.numberOfGuests;
	if (occupationData.totalPrice !== undefined)
		dbData.total_price = occupationData.totalPrice;
	if (occupationData.basePrice !== undefined)
		dbData.base_price = occupationData.basePrice;
	if (occupationData.discountAmount !== undefined)
		dbData.discount_amount = occupationData.discountAmount;
	if (occupationData.status !== undefined)
		dbData.status = occupationData.status;
	if (occupationData.notes !== undefined) dbData.notes = occupationData.notes;

	return dbData;
}

export function occupationGuestToApi(
	guestData: Record<string, unknown>,
): OccupationGuest {
	return {
		id: guestData.id as string,
		occupationId: guestData.occupation_id as string,
		guestId: guestData.guest_id as string,
		isPrimary: guestData.is_primary as boolean,
		createdAt: guestData.created_at as string,
	};
}

export function occupationGuestsToApiArray(
	guestsData: Record<string, unknown>[],
): OccupationGuest[] {
	return guestsData.map((guest) => occupationGuestToApi(guest));
}
