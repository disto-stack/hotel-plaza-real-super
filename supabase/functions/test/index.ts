// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
	try {
		const { method, url } = req;

		// CORS headers
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers":
				"authorization, x-client-info, apikey, content-type",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
		};

		// Handle CORS preflight
		if (method === "OPTIONS") {
			return new Response("ok", { headers: corsHeaders });
		}

		// Test endpoint
		if (method === "GET") {
			return new Response(
				JSON.stringify({
					message: "Edge Function is working!",
					method,
					url,
					timestamp: new Date().toISOString(),
					environment: Deno.env.get("ENVIRONMENT") || "local",
				}),
				{
					headers: { ...corsHeaders, "Content-Type": "application/json" },
					status: 200,
				},
			);
		}

		if (method === "POST") {
			const body = await req.json();

			return new Response(
				JSON.stringify({
					message: "POST received successfully, test endpoint!!!",
					data: body,
					timestamp: new Date().toISOString(),
				}),
				{
					headers: { ...corsHeaders, "Content-Type": "application/json" },
					status: 200,
				},
			);
		}

		return new Response(JSON.stringify({ error: "Method not allowed" }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
			status: 405,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			return new Response(JSON.stringify({ error: error.message }), {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
				},
				status: 500,
			});
		}
		return new Response(JSON.stringify({ error: "Unknown error" }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/test' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
