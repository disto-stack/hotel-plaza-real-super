import api from "@/lib/axios";
import type {
	CreateGuestData,
	GetGuestsResponse,
	GuestResponse,
} from "@/lib/types/guest.types";

export const guestsApi = {
	getGuests: async (
		params?: { page?: number; limit?: number; search?: string },
		options?: { signal?: AbortSignal },
	): Promise<GetGuestsResponse> => {
		const response = await api.get("/get-guests", {
			params,
			signal: options?.signal,
		});
		return response.data.data;
	},

	getGuest: async (id: string): Promise<GuestResponse> => {
		const response = await api.get(`/get-guest/${id}`);
		return response.data;
	},

	createGuest: async (guestData: CreateGuestData): Promise<GuestResponse> => {
		const response = await api.post("/create-guest", guestData);
		return response.data;
	},
};
