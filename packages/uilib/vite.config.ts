import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vitest/config"


export default defineConfig({
	plugins: [sveltekit()],
	server:  {
		port: 53515,
	},
	test: {
		include:     ["src/**/*.{test,spec}.{js,ts}"],
		environment: "jsdom",
		setupFiles:  "test.setup.ts",
	},
})

