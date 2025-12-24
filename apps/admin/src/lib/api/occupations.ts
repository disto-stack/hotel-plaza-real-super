import api from "@/lib/axios";
import type { Occupation } from "../types/occupation.type";

export const occupationsApi = {
	getOccupations: async (): Promise<Occupation[]> => {
		const response = await api.get("/get-occupations");
		return response.data.data;
	},
};
