import apiServer from "@/lib/axios.server";
import type { Occupation } from "../types/occupation.type";

export const occupationsApiServer = {
	getOccupations: async (): Promise<Occupation[]> => {
		const response = await apiServer.get("/get-occupations");
		return response.data.data;
	},
};
