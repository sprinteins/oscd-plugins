import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
	// biome-ignore lint/suspicious/noExplicitAny: There seem to be inconsistencies with instances of vite
	plugins: [svelte() as any],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			enabled: true,
			reportsDirectory: 'coverage',
			include: ['src/headless/**/*.{ts,svelte}'],
			exclude: ['src/**/*.spec.ts', 'src/headless/tests/**'],
		}
	}
})
