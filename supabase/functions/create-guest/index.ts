import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import {
	createGuestToDatabase,
	guestToApi,
} from "_shared/mappers/guest.mapper.ts";
import type { CreateGuestRequest } from "_shared/types/guest.type.ts";
import { validateAndExtract } from "_shared/utils/validation.helper.ts";
import { GuestValidator } from "_shared/validators/guest.validator.ts";

const authGuard = new AuthGuard();
const guestValidator = new GuestValidator();

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

		if (authResponse instanceof Response) {
			return authResponse;
		}

		const { user } = authResponse;

		if (!user) {
			return ResponseBuilder.unauthorized("Unauthorized");
		}

		const requestData: CreateGuestRequest = await req.json();

		const validation = validateAndExtract(requestData, guestValidator, [
			"firstName",
			"lastName",
			"documentType",
			"email",
			"phone",
			"documentNumber",
			"occupation",
			"nationality",
		]);

		if (!validation.isValid) {
			return ResponseBuilder.validationError(validation.errors);
		}

		const guestData = validation.extractedData as CreateGuestRequest;

		const dbData = createGuestToDatabase(guestData);

		const supabaseAdmin = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
		);

		const { data, error } = await supabaseAdmin
			.from("guests")
			.insert(dbData)
			.select()
			.single();

		if (error) {
			if (
				error.code === "23505" &&
				error.message.includes("guests_email_key")
			) {
				return ResponseBuilder.badRequest("Email already exists");
			}

			if (
				error.code === "23505" &&
				error.message.includes("uk_guests_document")
			) {
				return ResponseBuilder.badRequest("Document number already exists");
			}

			return ResponseBuilder.internalServerError(
				`Error creating guest: ${error.message}`,
			);
		}

		const responseData = guestToApi(data);

		return ResponseBuilder.created(responseData, "Guest created successfully");
	} catch (error) {
		console.error("Error in create-guest function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
