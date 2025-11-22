export enum RoomType {
	SINGLE = "single",
	DOUBLE = "double",
	FAMILIAR = "familiar",
}

export interface Room {
	id: string;
	roomNumber: string;
	roomType: RoomType;
	floor: number;
	capacity: number;
	pricePerNight: number;
	pricePerHour: number;
	extraPersonChargePerNight: number;
	status: string;
	description: string;
	amenities: string[];
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}
