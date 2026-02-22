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
				"next-env.d.ts",
				"src/lib/axios.ts",
				"src/lib/axios.server.ts",
				"src/lib/query-client.ts",
				"src/lib/query-server.ts",
				"src/lib/supabase/**",
				"src/components/ui/button.tsx",
				"src/components/ui/dropdown-menu.tsx",
				"src/components/ui/table.tsx",
				"src/components/ui/badge.tsx",
				"src/components/ui/toggle.tsx",
				"src/components/ui/toggle-group.tsx",
				"src/components/ui/card.tsx",
				"src/components/ui/drawer.tsx",
				"src/components/ui/collapsible.tsx",
				"src/components/ui/skeleton.tsx",
				"src/middleware.ts",
				"src/proxy.ts",
				"tailwind.config.*",
				"postcss.config.*",
				"vite.config.*",
				"vitest.config.*",
				"next.config.*",
				"src/app/**/layout.tsx",
				"src/app/**/loading.tsx",
				"src/components/providers/**",
				"src/**/*.d.ts",
				"src/**/*.types.*",
			],
			thresholds: {
				statements: 90,
				branches: 90,
				functions: 89,
				lines: 90,
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
