import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
	name: 'core',
	entry: ['src/index.ts'],
	clean: true,
	format: ['esm'],
	sourcemap: true,
	dts: true,
	treeshake: true,
	splitting: true,
	minify: !options.watch
}))
