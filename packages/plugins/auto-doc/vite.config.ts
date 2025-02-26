import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'

const isDevelopment = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
export default defineConfig({
	base: isDevelopment ? '' : '/oscd-plugins/auto-doc/',
	plugins: [
		svelte({
			compilerOptions: {
				customElement: true
			}
		})
	],
	server: {
		port: 5173
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/plugin.ts'),
			formats: ['es'],
			fileName: 'index'
		},
		sourcemap: isDevelopment ? 'inline' : false,

		rollupOptions:{
			output: {inlineDynamicImports: true}
		}
	},

})
