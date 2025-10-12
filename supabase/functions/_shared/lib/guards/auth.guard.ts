import { createClient, type User } from "@supabase/supabase-js";
import { ResponseBuilder } from "../response.ts";

export interface AuthResult {
	user: User | null;
	error: string | null;
	isAuthenticated: boolean;
}

export class AuthGuard {
	private supabaseAnon: ReturnType<typeof createClient>;

	constructor() {
		this.supabaseAnon = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_ANON_KEY") ?? "",
		);
	}

	async authenticate(req: Request): Promise<AuthResult | Response> {
		try {
			const authHeader = req.headers.get("Authorization");
			if (!authHeader?.startsWith("Bearer ")) {
				return ResponseBuilder.unauthorized("Authorization header required");
			}

			const token = authHeader.replace("Bearer ", "");

			const {
				data: { user },
				error: authError,
			} = await this.supabaseAnon.auth.getUser(token);

			if (authError || !user) {
				return ResponseBuilder.unauthorized("Invalid or expired token");
			}

			return {
				user,
				error: null,
				isAuthenticated: true,
			};
		} catch (error) {
			console.error("Auth guard error:", error);
			return ResponseBuilder.internalServerError("Authentication failed");
		}
	}
}
