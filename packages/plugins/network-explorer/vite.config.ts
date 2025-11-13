import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'

const isDevelopment = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
	define: {
		'process.env.NODE_ENV': JSON.stringify(mode || 'production'),
		'process.env': '{}'
	},
	build: {
		target: 'esnext',
		lib: {
			entry: resolve(__dirname, 'src/plugin.ts'),
			formats: ['es'],
			fileName: 'index'
		},
		sourcemap: isDevelopment ? 'inline' : false,
		rollupOptions: {
			output: {
				inlineDynamicImports: true
			}
		},
		cssCodeSplit: false
	},
	server: {
		port: 4178,
		cors: true
	},
	preview: {
		port: 41768,
		cors: true
	}
}))
