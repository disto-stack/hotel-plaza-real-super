import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import { occupationToApi } from "_shared/mappers/occupation.mapper.ts";

const authGuard = new AuthGuard();

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return ResponseBuilder.options();
	}

	if (req.method !== "DELETE") {
		return ResponseBuilder.methodNotAllowed([
			HTTP_METHODS.DELETE,
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

		const id = req.url.split("/").pop();
		if (!id) {
			return ResponseBuilder.badRequest("Occupation ID is required");
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
			return ResponseBuilder.forbidden("Only admins can delete occupations");
		}

		const { data: existingOccupation, error: fetchError } = await supabaseAdmin
			.from("occupations")
			.select("id, deleted_at")
			.eq("id", id)
			.single();

		if (fetchError) {
			if (fetchError.code === "PGRST116") {
				return ResponseBuilder.notFound("Occupation not found");
			}
			return ResponseBuilder.internalServerError(
				`Error fetching occupation: ${fetchError.message}`,
			);
		}

		if (existingOccupation.deleted_at) {
			return ResponseBuilder.badRequest("Occupation is already deleted");
		}

		const { data: deletedOccupation, error: deletedOccupationError } = await supabaseAdmin
			.from("occupations")
			.update({
				deleted_at: new Date().toISOString(),
				updated_by: user.id,
			})
			.eq("id", id)
			.is("deleted_at", null)
			.select()
			.single();

		if (deletedOccupationError) {
			if (deletedOccupationError.code === "PGRST116") {
				return ResponseBuilder.notFound("Occupation not found or already deleted");
			}

			return ResponseBuilder.internalServerError(
				`Error deleting occupation: ${deletedOccupationError.message}`,
			);
		}

		const responseData = occupationToApi(deletedOccupation);

		return ResponseBuilder.success(
			responseData,
			"Occupation deleted successfully",
		);
	} catch (error) {	
		console.error("Error in delete-occupation function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
