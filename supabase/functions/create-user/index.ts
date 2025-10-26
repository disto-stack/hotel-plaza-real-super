import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "_shared/lib/guards/auth.guard.ts";
import {
	createValidationError,
	HTTP_METHODS,
	HTTP_STATUS_CODES,
	ResponseBuilder,
} from "_shared/lib/response.ts";
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

		const { data: userData, error: userError } = await supabaseAdmin
			.from("users")
			.select("role")
			.eq("id", user.id)
			.single();

		if (userError) {
			return ResponseBuilder.internalServerError("Error verifying permissions");
		}

		if (userData?.role !== "admin") {
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

		const { email, password, firstName, lastName, role } =
			validation.extractedData as {
				email: string;
				password: string;
				firstName: string;
				lastName: string;
				role: string;
			};

		const { data: authData, error: createError } =
			await supabaseAdmin.auth.admin.createUser({
				email,
				password,
				email_confirm: true,
				user_metadata: {
					first_name: firstName,
					last_name: lastName,
					role: role,
				},
			});

		if (createError) {
			return ResponseBuilder.badRequest(
				`Error creating user: ${createError.message}`,
			);
		}

		return ResponseBuilder.created(authData, "User created successfully");
	} catch (error) {
		console.error("Error in create-user function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
