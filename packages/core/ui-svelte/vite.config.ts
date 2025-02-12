import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			// Make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['svelte'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					svelte: 'Svelte'
				}
			}
		}
	}
})
