export interface Room {
	id: string;
	roomNumber: string;
	roomType: RoomType;
	floor: number;
	capacity: number;
	pricePerNight: number;
	pricePerHour: number;
	extraPersonChargePerNight: number;

	amenities: string[];
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export enum RoomType {
	SINGLE = "single",
	DOUBLE = "double",
	FAMILY = "family",
}
