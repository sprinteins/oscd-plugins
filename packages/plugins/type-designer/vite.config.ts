import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
// import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const isDevelopment = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte()
		// cssInjectedByJsPlugin({
		// 	styleId: process.env.npm_package_name,
		// 	injectCodeFunction: function injectCodeCustomRunTimeFunction(
		// 		cssCode: string,
		// 		options: any
		// 	) {
		// 		if (!globalThis.pluginStyle) {
		// 			globalThis.pluginStyle = {}
		// 		}
		// 		globalThis.pluginStyle[options.styleId] = cssCode
		// 	}
		// })
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
			fileName: 'index'
		},
		sourcemap: isDevelopment ? 'inline' : false
	}
})
