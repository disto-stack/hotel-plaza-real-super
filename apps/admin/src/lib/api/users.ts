import api from "@/lib/axios";

export interface CreateUserData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
}

export interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	created_at: string;
	updated_at: string;
}

export const usersApi = {
	createUser: async (userData: CreateUserData) => {
		console.log("Creating user:", userData);
		const response = await api.post("/create-user", userData);
		return response.data;
	},

	getUsers: async (): Promise<User[]> => {
		const response = await api.get("/get-users");
		return response.data;
	},

	deleteUser: async (userId: string) => {
		const response = await api.delete(`/delete-user/${userId}`);
		return response.data;
	},

	updateUser: async (userId: string, userData: Partial<CreateUserData>) => {
		const response = await api.put(`/update-user/${userId}`, userData);
		return response.data;
	},
};
