import api from "@/lib/axios";
import type { CreateUserData } from "../types/user.types";

export const usersApi = {
	createUser: async (userData: CreateUserData) => {
		const response = await api.post("/create-user", userData);
		return response.data;
	},
};
