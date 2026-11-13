import { resolve } from 'node:path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [svelte(), svelteTesting()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		server: {
			deps: {
				inline: true
			}
		},
		coverage: {
			provider: 'v8',
			reporter: ['text'],
			include: ['src/**/*.{ts,svelte}'],
			exclude: ['src/**/*.spec.ts', 'src/**/*.d.ts', 'src/testing/**']
		}
	}
})
