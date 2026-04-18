import axios, { type AxiosError } from "axios";
import { authStore } from "@/store/authStore";

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = authStore.getState().token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

export default api;
