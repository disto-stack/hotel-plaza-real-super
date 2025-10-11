// supabase/functions/create-user/index.ts
import { createClient } from "@supabase/supabase-js";

// Función para manejar CORS
function corsHeaders() {
	return {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers":
			"authorization, x-client-info, apikey, content-type",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
	};
}

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response(null, {
			status: 200,
			headers: corsHeaders(),
		});
	}

	if (req.method !== "POST") {
		return new Response("Method not allowed", {
			status: 405,
			headers: corsHeaders(),
		});
	}

	try {
		const authHeader = req.headers.get("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return new Response(
				JSON.stringify({
					error: "Authorization header required",
				}),
				{
					status: 401,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders(),
					},
				},
			);
		}

		const token = authHeader.replace("Bearer ", "");

		const supabaseAnon = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_ANON_KEY") ?? "",
		);

		const {
			data: { user },
			error: authError,
		} = await supabaseAnon.auth.getUser(token);

		if (authError || !user) {
			return new Response(
				JSON.stringify({
					error: "Invalid or expired token",
				}),
				{
					status: 401,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders(),
					},
				},
			);
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
			return new Response(
				JSON.stringify({
					error: "Error verifying permissions",
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders(),
					},
				},
			);
		}

		if (userData?.role !== "admin") {
			return new Response(
				JSON.stringify({
					error: "Only admins can create users",
				}),
				{
					status: 403,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders(),
					},
				},
			);
		}

		const { email, password, firstName, lastName, role } = await req.json();

		if (!email || !password || !firstName || !lastName || !role) {
			return new Response(
				JSON.stringify({
					error: "All fields are required",
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders(),
					},
				},
			);
		}

		if (password.length < 6) {
			return new Response(
				JSON.stringify({
					error: "The password must be at least 6 characters",
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders(),
					},
				},
			);
		}

		const { data: authData, error: createError } =
			await supabaseAdmin.auth.admin.createUser({
				email,
				password,
				email_confirm: true, // Auto-confirm email
				user_metadata: {
					first_name: firstName,
					last_name: lastName,
					role: role,
				},
			});

		if (createError) {
			return new Response(
				JSON.stringify({
					error: `Error creating user: ${createError.message}`,
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders(),
					},
				},
			);
		}

		// Success response
		return new Response(
			JSON.stringify({
				success: true,
				message: "User created successfully",
				user: {
					id: authData.user?.id,
					email: authData.user?.email,
					first_name: firstName,
					last_name: lastName,
					role: role,
				},
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					...corsHeaders(),
				},
			},
		);
	} catch (error) {
		console.error("Error in create-user function:", error);
		return new Response(
			JSON.stringify({
				error: "Internal server error",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
					...corsHeaders(),
				},
			},
		);
	}
});
