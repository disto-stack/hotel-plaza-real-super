import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import { roomToApi } from "_shared/mappers/room.mapper.ts";

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

		const { searchKey, searchValue } = getSearchParams(req);
		if (!searchKey || !searchValue) {
			return ResponseBuilder.badRequest("Search key and value are required");
		}

		const { data: room, error: roomError } = await supabaseAdmin
			.from("rooms")
			.select("*")
			.eq(searchKey, searchValue)
			.single();

		if (roomError) {
			if (roomError.code === "PGRST116") {
				return ResponseBuilder.notFound("Room");
			}

			return ResponseBuilder.internalServerError(
				`Error getting room: ${roomError.message}`,
			);
		}

		const responseData = roomToApi(room);
		return ResponseBuilder.success(responseData, "Room fetched successfully");
	} catch (error) {
		console.error("Error in get-room function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});

function getSearchParams(req: Request): {
	searchKey: "id" | "room_number" | undefined;
	searchValue: string | undefined;
} {
	const url = new URL(req.url);

	const id = url.searchParams.get("id");
	if (id) {
		return { searchKey: "id", searchValue: id };
	}

	const roomNumber = url.searchParams.get("roomNumber");
	if (roomNumber) {
		return { searchKey: "room_number", searchValue: roomNumber };
	}

	return { searchKey: undefined, searchValue: undefined };
}
