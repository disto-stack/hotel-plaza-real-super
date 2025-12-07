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
	checkInDate: string; // ISO date string (YYYY-MM-DD)
	checkInTime: string; // Time string (HH:mm:ss)
	checkOutDate: string; // ISO date string (YYYY-MM-DD)
	checkOutTime: string; // Time string (HH:mm:ss)
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
	roomId?: string;
	checkInDate?: string;
	checkInTime?: string;
	checkOutDate?: string;
	checkOutTime?: string;
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
