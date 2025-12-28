import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import { occupationsToApiArray } from "_shared/mappers/occupation.mapper.ts";

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

		const { data: occupations, error: occupationsError } = await buildQuery(
			req,
			supabaseAdmin,
		);
		if (occupationsError) {
			return ResponseBuilder.internalServerError(
				`Error getting occupations: ${occupationsError.message}`,
			);
		}

		const responseData = occupationsToApiArray(occupations);

		return ResponseBuilder.success(
			responseData,
			"Occupations fetched successfully",
		);
	} catch (error) {
		console.error("Error in get-all-occupations function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});

function buildQuery(req: Request, client: SupabaseClient) {
	const query = client
		.from("occupations")
		.select(
			"*, rooms(id, room_number, room_type), occupation_guests(id, is_primary, guests(id, first_name, last_name))",
		)
		.is("deleted_at", null);

	const url = new URL(req.url);

	const status = url.searchParams.getAll("status");
	const roomId = url.searchParams.get("roomId");
	const stayType = url.searchParams.get("stayType");

	const checkInFrom = url.searchParams.get("checkInFrom");
	const checkInTo = url.searchParams.get("checkInTo");
	const checkOutFrom = url.searchParams.get("checkOutFrom");
	const checkOutTo = url.searchParams.get("checkOutTo");

	const minPrice = url.searchParams.get("minPrice");
	const maxPrice = url.searchParams.get("maxPrice");

	const orderBy = url.searchParams.get("orderBy");
	const orderDirection = url.searchParams.get("orderDirection");

	if (orderBy) {
		query.order(
			orderBy,
			orderDirection && orderDirection === "asc"
				? { ascending: true }
				: { ascending: false },
		);
	}

	if (minPrice) {
		query.gte("total_price", minPrice);
	}

	if (maxPrice) {
		query.lte("total_price", maxPrice);
	}

	if (status.length > 0) {
		query.in("status", status);
	}

	if (roomId) {
		query.eq("room_id", roomId);
	}

	if (stayType) {
		query.eq("stay_type", stayType);
	}

	if (checkInFrom) {
		query.gte("check_in_datetime", checkInFrom);
	}

	if (checkInTo) {
		query.lte("check_in_datetime", checkInTo);
	}

	if (checkOutFrom) {
		query.gte("check_out_datetime", checkOutFrom);
	}

	if (checkOutTo) {
		query.lte("check_out_datetime", checkOutTo);
	}

	return query;
}
