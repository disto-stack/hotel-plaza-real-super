import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import {
	createOccupationToDatabase,
	occupationGuestToApi,
	occupationToApi,
} from "_shared/mappers/occupation.mapper.ts";
import type { CreateOccupationRequest } from "_shared/types/occupation.type.ts";
import { validateAndExtract } from "_shared/utils/validation.helper.ts";
import { OccupationValidator } from "_shared/validators/occupation.validator.ts";

const authGuard = new AuthGuard();

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return ResponseBuilder.options();
	}

	if (req.method !== "POST") {
		return ResponseBuilder.methodNotAllowed([
			HTTP_METHODS.POST,
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

		const requestData: CreateOccupationRequest = await req.json();

		const validation = validateAndExtract(requestData, occupationValidator, [
			"roomId",
			"checkInDatetime",
			"checkOutDatetime",
			"stayType",
			"numberOfGuests",
			"totalPrice",
			"guests",
		]);

		if (!validation.isValid) {
			return ResponseBuilder.validationError(validation.errors);
		}

		const occupationData = validation.extractedData as CreateOccupationRequest;

		const supabaseAdmin = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
		);

		const dbData = createOccupationToDatabase(occupationData);
		dbData.created_by = user.id;

		const { data: occupation, error: occupationError } = await supabaseAdmin
			.from("occupations")
			.insert(dbData)
			.select()
			.single();

		if (occupationError) {
			if (
				occupationError.message.includes("already occupied") ||
				occupationError.message.includes("Overlap detected")
			) {
				return ResponseBuilder.badRequest(
					"Room is already occupied or reserved for this time period",
				);
			}

			return ResponseBuilder.internalServerError(
				`Error creating occupation: ${occupationError.message}`,
			);
		}

		const guestsData = occupationData.guests.map((guest) => ({
			occupation_id: occupation.id,
			guest_id: guest.guestId,
			is_primary: guest.isPrimary,
		}));

		const { data: occupationGuests, error: guestsError } = await supabaseAdmin
			.from("occupation_guests")
			.insert(guestsData)
			.select();

		if (guestsError) {
			await supabaseAdmin.from("occupations").delete().eq("id", occupation.id);

			return ResponseBuilder.internalServerError(
				`Error adding guests to occupation: ${guestsError.message}`,
			);
		}

		const responseData = occupationToApi(occupation);
		responseData.guests = occupationGuests.map((g) => occupationGuestToApi(g));

		return ResponseBuilder.created(
			responseData,
			"Occupation created successfully",
		);
	} catch (error) {
		console.error("Error in create-occupation function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
