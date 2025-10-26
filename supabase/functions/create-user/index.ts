import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import { HTTP_METHODS, ResponseBuilder } from "_shared/lib/response.ts";
import { authToApi, userToAuthMetadata } from "_shared/mappers/user.mapper.ts";
import type { CreateUserRequest } from "_shared/types/user.type.ts";
import { validateAndExtract } from "_shared/utils/validation.helper.ts";
import { UserValidator } from "_shared/validators/user.validator.ts";

const authGuard = new AuthGuard();
const userValidator = new UserValidator();

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

		const supabaseAdmin = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
		);

		const { data: userRoleData, error: userError } = await supabaseAdmin
			.from("users")
			.select("role")
			.eq("id", user.id)
			.single();

		if (userError) {
			return ResponseBuilder.internalServerError("Error verifying permissions");
		}

		if (userRoleData?.role !== "admin") {
			return ResponseBuilder.forbidden("Only admins can create users");
		}

		const requestData = await req.json();

		const validation = validateAndExtract(requestData, userValidator, [
			"email",
			"password",
			"firstName",
			"lastName",
			"role",
		]);

		if (!validation.isValid) {
			return ResponseBuilder.validationError(validation.errors);
		}

		const userData = validation.extractedData as CreateUserRequest;

		const authMetadata = userToAuthMetadata(userData);

		const { data: authData, error: createError } =
			await supabaseAdmin.auth.admin.createUser({
				email: userData.email,
				password: userData.password,
				email_confirm: true,
				user_metadata: authMetadata,
			});

		if (createError) {
			return ResponseBuilder.badRequest(
				`Error creating user: ${createError.message}`,
			);
		}

		const responseData = authToApi(authData);

		return ResponseBuilder.created(responseData, "User created successfully");
	} catch (error) {
		console.error("Error in create-user function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
