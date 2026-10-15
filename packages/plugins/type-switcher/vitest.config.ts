import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [svelte({ exclude: [] })],
	resolve: {
		conditions: ['browser']
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		setupFiles: ['./src/test/setup.ts'],
		server: {
			deps: {
				inline: true
			}
		}
	}
})
