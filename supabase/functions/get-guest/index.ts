import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";

const authGuard = new AuthGuard();

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return ResponseBuilder.options();
	}

	if (req.method !== "GET") {
		return ResponseBuilder.methodNotAllowed([
			HTTP_METHODS.GET,
			HTTP_METHODS.OPTIONS,
		]);
	}

	try {
		const authResponse = await authGuard.authenticate(req);

		if (authResponse instanceof Response) {
			return authResponse;
		}

		const { user } = authResponse;

		if (!user) {
			return ResponseBuilder.unauthorized("Unauthorized");
		}

		const supabaseAdmin = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
		);

		const { data: userData, error: userError } = await supabaseAdmin
			.from("users")
			.select("role")
			.eq("id", user.id)
			.single();

		if (userError) {
			return ResponseBuilder.internalServerError("Error verifying permissions");
		}

		if (userData?.role !== "admin") {
			return ResponseBuilder.forbidden("Only admins can get guests");
		}

		const id = req.url.split("/").pop();

		if (!id) {
			return ResponseBuilder.badRequest("Guest ID is required");
		}

		const { data: guest, error: guestError } = await supabaseAdmin
			.from("guests")
			.select("*")
			.eq("id", id)
			.single();

		if (guestError) {
			if (guestError.code === "PGRST116") {
				return ResponseBuilder.notFound("Guest");
			}

			return ResponseBuilder.internalServerError(
				`Error getting guest: ${guestError.message}`,
			);
		}

		return ResponseBuilder.success(guest, "Guest fetched successfully");
	} catch (error) {
		console.error("Error in get-guest function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
