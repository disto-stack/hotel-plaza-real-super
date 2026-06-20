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

		const url = new URL(req.url);
		const checkIn = url.searchParams.get("checkIn");
		const checkOut = url.searchParams.get("checkOut");

		let roomsQuery = supabaseAdmin
			.from("rooms")
			.select("*")
			.is("deleted_at", null);

		if (checkIn && checkOut) {
			const { data: busyRooms, error: busyRoomsError } = await supabaseAdmin
				.from("occupations")
				.select("room_id")
				.in("status", ["reserved", "checked_in"])
				.is("deleted_at", null)
				.lt("check_in_datetime", checkOut)
				.gt("check_out_datetime", checkIn);

			if (busyRoomsError) {
				return ResponseBuilder.internalServerError(
					`Error checking room availability: ${busyRoomsError.message}`,
				);
			}

			if (busyRooms && busyRooms.length > 0) {
				const busyIds = busyRooms.map((o: { room_id: string }) => o.room_id);
				roomsQuery = roomsQuery.not("id", "in", `(${busyIds.join(",")})`);
			}
		}

		const { data: rooms, error: roomsError } = await roomsQuery;

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
		console.error("Error in get-rooms function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
