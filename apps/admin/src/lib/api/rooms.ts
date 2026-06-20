import api from "@/lib/axios";
import type { Room } from "../types/room.types";

export interface AvailableRoomsParams {
	checkIn: string;
	checkOut: string;
}

export const roomsApi = {
	getRooms: async (): Promise<Room[]> => {
		const response = await api.get("/get-rooms");
		return response.data.data;
	},

	getAvailableRooms: async (params: AvailableRoomsParams): Promise<Room[]> => {
		const response = await api.get("/get-rooms", { params });
		return response.data.data;
	},
};
