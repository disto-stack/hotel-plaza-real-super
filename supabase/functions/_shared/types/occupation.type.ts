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

export interface CreateOccupationRequest {
	roomId: string;
	checkInDatetime: string; // ISO datetime string (YYYY-MM-DDTHH:mm:ss.sssZ)
	checkOutDatetime: string; // ISO datetime string (YYYY-MM-DDTHH:mm:ss.sssZ)
	stayType: StayType;
	numberOfGuests: number;
	totalPrice: number;
	basePrice?: number;
	discountAmount?: number;
	status?: OccupationStatus;
	notes?: string;
	guests: CreateOccupationGuestRequest[];
}

export interface UpdateOccupationRequest {
	id: string;
	roomId?: string;
	checkInDatetime?: string;
	checkOutDatetime?: string;
	stayType?: StayType;
	numberOfGuests?: number;
	totalPrice?: number;
	basePrice?: number;
	discountAmount?: number;
	status?: OccupationStatus;
	notes?: string;
}

export interface CreateOccupationGuestRequest {
	guestId: string;
	isPrimary: boolean;
}

export interface UpdateOccupationGuestRequest {
	isPrimary?: boolean;
}
