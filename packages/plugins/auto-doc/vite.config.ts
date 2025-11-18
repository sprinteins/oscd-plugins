import { resolve } from 'node:path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const isDevelopment = process.env.NODE_ENV === 'development'

export default defineConfig(({ mode }) => ({
	plugins: [svelte(), dts({ rollupTypes: true })],
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
		port: 4176,
		cors: true
	},
	preview: {
		port: 41761,
		cors: true
	}
}))
