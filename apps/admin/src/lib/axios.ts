import axios, { type AxiosError } from "axios";
import { createClient } from "@/lib/supabase/client";

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(async (config) => {
	const supabase = createClient();

	if (!supabase) {
		throw new Error("Supabase client not found");
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session?.access_token) {
		config.headers.Authorization = `Bearer ${session.access_token}`;
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
