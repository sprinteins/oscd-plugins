import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
// TYPES
import type { Config } from '@sveltejs/kit'

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		customElement: true
	}
} satisfies Config
