import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import { guestsToApiArray } from "_shared/mappers/guest.mapper.ts";

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

		const url = new URL(req.url);
		const pageParsed = parseInt(url.searchParams.get("page") ?? "1", 10);
		const limitParsed = parseInt(url.searchParams.get("limit") ?? "10", 10);
		const page = Number.isNaN(pageParsed) || pageParsed < 1 ? 1 : pageParsed;
		const limit =
			Number.isNaN(limitParsed) || limitParsed < 1 ? 10 : limitParsed;
		const search = url.searchParams.get("search") ?? "";

		let query = supabaseAdmin.from("guests").select("*", { count: "exact" });

		if (search) {
			query = query.or(
				`first_name.ilike.%${search}%,last_name.ilike.%${search}%,document_number.ilike.%${search}%,email.ilike.%${search}%`,
			);
		}

		const from = (page - 1) * limit;
		const to = from + limit - 1;

		const {
			data: guests,
			count,
			error: guestsError,
		} = await query.range(from, to);

		if (guestsError) {
			return ResponseBuilder.internalServerError(
				`Error getting guests: ${guestsError.message}`,
			);
		}

		const camelCaseGuests = guestsToApiArray(guests ?? []);
		return ResponseBuilder.success(
			{
				guests: camelCaseGuests,
				totalCount: count ?? 0,
				page,
				limit,
			},
			"Guests fetched successfully",
		);
	} catch (error) {
		console.error("Error in get-guests function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
