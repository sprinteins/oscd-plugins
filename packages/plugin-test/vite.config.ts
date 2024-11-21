import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'
import jsonPackage from './package.json'

const isDevelopment = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig({
	base: isDevelopment
		? ''
		: `/oscd-plugins/${jsonPackage.name.replace('@oscd-plugins/', '')}/`,
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
			entry: [
				resolve(__dirname, 'src/plugin.ts'),
				resolve(__dirname, 'src/custom-elements/custom-elements.ts')
			],
			formats: ['es']
		},
		// rollupOptions: {
		// 	input: {
		// 		plugin: 'src/plugin.ts',
		// 		customElements: 'src/custom-elements/custom-elements.ts'
		// 	}
		// },
		sourcemap: isDevelopment ? 'inline' : false
	}
})
