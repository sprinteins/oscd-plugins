import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// This config is used by svelte-package for library builds
// customElement is NOT enabled here so library components are regular Svelte components
// The vite.config.ts enables customElement for the plugin build separately
export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess()
}
