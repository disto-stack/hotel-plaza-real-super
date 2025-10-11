import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`,
	timeout: 1000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(async (config) => {
	const supabase = createClient();

	if (!supabase) {
		throw new Error("Supabase client not found");
	}
	console.log("Supabase client found");

	const {
		data: { session },
	} = await supabase.auth.getSession();

	console.log("Session:", session);

	if (session?.access_token) {
		config.headers.Authorization = `Bearer ${session.access_token}`;
	}

	return config;
});

export default api;
