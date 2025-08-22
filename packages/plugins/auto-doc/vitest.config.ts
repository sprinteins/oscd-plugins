import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	test: {
		globals: true,
		environment: 'jsdom', // Or 'jsdom', depending on your needs
		setupFiles: './tests/setupTests.ts',
		include: ['**/*.spec.ts'], // Ensure this pattern matches your test files
		server: {
			deps: {
				inline: true,
			}
		}
	}
})
