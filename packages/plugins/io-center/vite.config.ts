import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'
import jsonPackage from './package.json'
import dts from 'vite-plugin-dts'

const isDevelopment = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig({
	// base: isDevelopment
	// 	? ''
	// 	: `/oscd-plugins/${jsonPackage.name.replace('@oscd-plugins/', '')}/`,
	plugins: [svelte(), dts({ rollupTypes: true })],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	build: {
		target: 'esnext',
		lib: {
			entry: resolve(__dirname, 'src/plugin.ts'),
			formats: ['es'],
			fileName: 'plugin'
		},
		sourcemap: isDevelopment ? 'inline' : false
	}
})
