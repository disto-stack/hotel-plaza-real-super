import type { Room, RoomType } from "../types/room.type.ts";

export function guestToDatabase(roomData: Room): Record<string, unknown> {
	const dbData: Record<string, unknown> = {};

	if ("roomNumber" in roomData) dbData.room_number = roomData.roomNumber;
	if ("roomType" in roomData) dbData.room_type = roomData.roomType;
	if ("floor" in roomData) dbData.floor = roomData.floor;
	if ("capacity" in roomData) dbData.capacity = roomData.capacity;
	if ("pricePerNight" in roomData)
		dbData.price_per_night = roomData.pricePerNight;
	if ("pricePerHour" in roomData) dbData.price_per_hour = roomData.pricePerHour;
	if ("extraPersonChargePerNight" in roomData)
		dbData.extra_person_charge_per_night = roomData.extraPersonChargePerNight;
	if ("status" in roomData) dbData.status = roomData.status;
	if ("description" in roomData) dbData.description = roomData.description;
	if ("amenities" in roomData) dbData.amenities = roomData.amenities;

	return dbData;
}

export function roomToApi(roomData: Record<string, unknown>): Room {
	return {
		id: roomData.id as string,
		roomNumber: roomData.room_number as string,
		roomType: roomData.room_type as RoomType,
		floor: roomData.floor as number,
		capacity: roomData.capacity as number,
		pricePerNight: roomData.price_per_night as number,
		pricePerHour: roomData.price_per_hour as number,
		extraPersonChargePerNight: roomData.extra_person_charge_per_night as number,
		status: roomData.status as string,
		description: roomData.description as string,
		amenities: roomData.amenities as string[],
		createdAt: roomData.created_at as string,
		updatedAt: roomData.updated_at as string,
		deletedAt: roomData.deleted_at as string,
	};
}

export function roomsToApiArray(roomsData: Record<string, unknown>[]): Room[] {
	return roomsData.map((room) => roomToApi(room));
}
