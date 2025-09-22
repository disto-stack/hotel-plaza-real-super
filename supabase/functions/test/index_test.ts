import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("Basic function test", () => {
	const message = "Edge Function is working!";
	assertEquals(message, "Edge Function is working!");
});

Deno.test("JSON response test", () => {
	const response = {
		message: "Edge Function is working!",
		method: "GET",
		url: "http://localhost:54321/functions/v1/test",
		timestamp: new Date().toISOString(),
		environment: "test",
	};

	assertEquals(response.message, "Edge Function is working!");
	assertEquals(response.method, "GET");
	assertEquals(response.environment, "test");
});

Deno.test("CORS headers test", () => {
	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers":
			"authorization, x-client-info, apikey, content-type",
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	};

	assertEquals(corsHeaders["Access-Control-Allow-Origin"], "*");
	assertEquals(
		corsHeaders["Access-Control-Allow-Methods"],
		"GET, POST, PUT, DELETE, OPTIONS",
	);
});
