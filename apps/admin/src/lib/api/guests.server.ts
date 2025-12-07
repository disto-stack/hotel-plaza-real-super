import apiServer from "@/lib/axios.server";
import type { Guest } from "@/lib/types/guest.types";

export const guestsApiServer = {
	getGuests: async (): Promise<Guest[]> => {
		const response = await apiServer.get("/get-guests");
		return response.data.data;
	},
};
