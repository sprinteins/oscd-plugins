import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte(), dts({ rollupTypes: true })],
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	},
	build: {
		lib: {
			entry: path.resolve('./src/index.ts'),
			formats: ['es'],
			fileName: 'index'
		},
		target: 'esnext',
		sourcemap: true
	}
})
