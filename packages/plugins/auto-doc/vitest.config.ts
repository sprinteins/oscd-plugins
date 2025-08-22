import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
	plugins: [svelte()],
	test: {
		globals: true,
		environment: 'jsdom', // Or 'jsdom', depending on your needs
		setupFiles: './tests/setupTests.ts',
		include: ['**/*.spec.ts'], // Ensure this pattern matches your test files
		server: {
			deps: {
				inline: ['bits-ui'],
			}
		}
	}
})
