import { createClient } from "@supabase/supabase-js";
import { AuthGuard } from "../_shared/lib/guards/auth.guard.ts";
import {
	createValidationError,
	HTTP_METHODS,
	HTTP_STATUS_CODES,
	ResponseBuilder,
} from "../_shared/lib/response.ts";

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

		if (authResponse instanceof Response) {
			return authResponse;
		}

		const { user } = authResponse;

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

		const { email, password, firstName, lastName, role } = await req.json();

		const validationErrors = [];

		if (!email)
			validationErrors.push(
				createValidationError("email", "Email is required"),
			);
		if (!password)
			validationErrors.push(
				createValidationError("password", "Password is required"),
			);
		if (!firstName)
			validationErrors.push(
				createValidationError("firstName", "First name is required"),
			);
		if (!lastName)
			validationErrors.push(
				createValidationError("lastName", "Last name is required"),
			);
		if (!role)
			validationErrors.push(createValidationError("role", "Role is required"));

		if (password.length < 6)
			validationErrors.push(
				createValidationError(
					"password",
					"Password must be at least 6 characters",
				),
			);

		if (validationErrors.length > 0) {
			return ResponseBuilder.validationError(validationErrors);
		}

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

		return ResponseBuilder.success(
			{
				user: {
					id: authData.user?.id,
					email: authData.user?.email,
					first_name: firstName,
					last_name: lastName,
					role: role,
				},
			},
			"User created successfully",
			HTTP_STATUS_CODES.CREATED,
		);
	} catch (error) {
		console.error("Error in create-user function:", error);
		return ResponseBuilder.error("Internal server error");
	}
});
