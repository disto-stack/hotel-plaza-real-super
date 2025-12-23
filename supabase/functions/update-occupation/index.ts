import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import {
	occupationToApi,
  updateOccupationToDatabase,
} from "_shared/mappers/occupation.mapper.ts";
import type { UpdateOccupationRequest } from "_shared/types/occupation.type.ts";
import { validatePartial } from "_shared/utils/validation.helper.ts";
import { OccupationValidator } from "_shared/validators/occupation.validator.ts";

const authGuard = new AuthGuard();

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return ResponseBuilder.options();
	}

	if (req.method !== "PATCH") {
		return ResponseBuilder.methodNotAllowed([
			HTTP_METHODS.PATCH,
			HTTP_METHODS.OPTIONS,
		]);
	}

	try {
		const authResponse = await authGuard.authenticate(req);
		const occupationValidator = new OccupationValidator();

		if (authResponse instanceof Response) {
			return authResponse;
		}

		const { user } = authResponse;

		if (!user) {
			return ResponseBuilder.unauthorized("Unauthorized");
		}

		const requestData: UpdateOccupationRequest = await req.json();

		const id = req.url.split("/").pop();
		if (!id) {
			return ResponseBuilder.badRequest("Occupation ID is required");
		}

		const validation = validatePartial(requestData, occupationValidator);

		if (!validation.isValid) {
			return ResponseBuilder.validationError(validation.errors);
		}

		const occupationData = validation.extractedData as UpdateOccupationRequest;

		if (!occupationData || Object.keys(occupationData).length === 0) {
			return ResponseBuilder.badRequest(
				"At least one field must be provided for update",
			);
		}

		const supabaseAdmin = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
		);

		const dbData = updateOccupationToDatabase(occupationData);
		dbData.updated_by = user.id;

		const { data: updatedOccupation, error: updatedOccupationError } = await supabaseAdmin
			.from("occupations")
			.update(dbData)
			.eq("id", id)
			.select()
			.single();

		if (updatedOccupationError) {
			if (updatedOccupationError.code === "PGRST116") {
				return ResponseBuilder.notFound("Occupation not found");
			}

			if (
				updatedOccupationError.message.includes("already occupied") ||
				updatedOccupationError.message.includes("Overlap detected")
			) {
				return ResponseBuilder.badRequest(
					"Room is already occupied or reserved for this time period",
				);
			}

			return ResponseBuilder.internalServerError(
				`Error updating occupation: ${updatedOccupationError.message}`,
			);
		} 

		const responseData = occupationToApi(updatedOccupation);

		return ResponseBuilder.success(
			responseData,
			"Occupation updated successfully",
		);
	} catch (error) {
		console.error("Error in update-occupation function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
