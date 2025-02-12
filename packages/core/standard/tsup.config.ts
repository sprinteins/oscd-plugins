import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
	name: 'core-standard',
	entry: {
		index: 'src/index.ts',
		'ed2/index': 'src/ed2/index.ts'
	},
	clean: true,
	format: ['esm'],
	sourcemap: true,
	dts: true,
	treeshake: true,
	splitting: true,
	minify: !options.watch
}))
