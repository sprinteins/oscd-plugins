// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// The plugin typeing is not correct, so we have to use @ts-nochec
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte({
		configFile:      "svelte.config.build.js",
		compilerOptions: {
			customElement: true,
		},
	})],
	build: {
		lib: {
			entry:   "src/lib/index.js",
			formats: ["es"],
		},
	},
})
	