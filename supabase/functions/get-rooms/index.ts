import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import { roomsToApiArray } from "_shared/mappers/room.mapper.ts";

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

		const { data: _, error: userError } = await supabaseAdmin
			.from("users")
			.select("role")
			.eq("id", user.id)
			.single();

		if (userError) {
			return ResponseBuilder.internalServerError("Error verifying permissions");
		}

		const { data: rooms, error: roomsError } = await supabaseAdmin
			.from("rooms")
			.select("*");

		if (roomsError) {
			return ResponseBuilder.internalServerError(
				`Error getting rooms: ${roomsError.message}`,
			);
		}

		const camelCaseRooms = roomsToApiArray(rooms);
		return ResponseBuilder.success(
			camelCaseRooms,
			"Rooms fetched successfully",
		);
	} catch (error) {
		console.error("Error in get-guests function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
