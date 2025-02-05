import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'

const isDevelopment = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				customElement: true
			}
		})
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/plugin.ts'),
			formats: ['es'],
			fileName: 'plugin'
		},
		sourcemap: isDevelopment ? 'inline' : false
	},
	server: {
		port: 4174
	},
	preview: {
		port: 4174,
		cors: true
	}
})
