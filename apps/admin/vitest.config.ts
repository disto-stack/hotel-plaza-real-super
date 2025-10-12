import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/__tests__/**/*.test.{ts,tsx}"],
		exclude: ["node_modules", "dist", ".next"],
		coverage: {
			exclude: [
				"node_modules", 
				"dist", 
				".next",
				"src/lib/axios.ts",
				"src/lib/query-client.ts",
				"src/lib/supabase/**",
				"src/middleware.ts",
				"tailwind.config.*",
				"postcss.config.*",
				"vite.config.*",
        		"vitest.config.*",
				"next.config.*",
				"src/app/**/layout.tsx",
        		"src/app/**/page.tsx",
				"src/components/providers/**",
				"src/**/*.d.ts",
        		"src/**/*.types.*",
			],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
