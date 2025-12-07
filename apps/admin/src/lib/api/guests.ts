import api from "@/lib/axios";
import type { CreateGuestData, Guest } from "@/lib/types/guest.types";

export const guestsApi = {
	getGuests: async (): Promise<Guest[]> => {
		const response = await api.get("/get-guests");
		return response.data.data;
	},

	getGuest: async (id: string): Promise<Guest> => {
		const response = await api.get(`/get-guest/${id}`);
		return response.data;
	},

	createGuest: async (guestData: CreateGuestData): Promise<Guest> => {
		const response = await api.post("/create-guest", guestData);
		return response.data;
	},
};