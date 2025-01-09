import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
	name: 'core-api',
	entry: {
		index: 'src/index.ts',
		'instance/v1/index': 'src/instance/v1/index.ts',
		'plugin/v1/index': 'src/plugin/v1/index.ts',
		'mocks/v1/index': 'src/mocks/v1/index.ts'
	},
	clean: true,
	format: ['esm'],
	sourcemap: true,
	dts: true,
	treeshake: true,
	splitting: true,
	minify: !options.watch
}))
