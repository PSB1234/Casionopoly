import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		include: ["src/test/**/*.{test,spec}.{ts,tsx}"],
		setupFiles: ["./src/test/setup.ts"],
		coverage: {
			reporter: ["text", "json", "html"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
