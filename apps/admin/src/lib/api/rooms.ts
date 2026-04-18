import api from "@/lib/axios";
import type { Room } from "../types/room.types";

export const roomsApi = {
	getRooms: async (): Promise<Room[]> => {
		const response = await api.get("/get-rooms");
		return response.data.data;
	},
};
