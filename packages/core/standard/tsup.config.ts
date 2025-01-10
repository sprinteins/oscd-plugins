import { defineConfig } from 'tsup'
import { exec } from 'node:child_process'

export default defineConfig((options) => ({
	name: 'core-standard',
	entry: {
		'ed2/index': 'src/ed2/index.ts'
	},
	clean: true,
	format: ['esm'],
	sourcemap: true,
	dts: true,
	treeshake: true,
	splitting: true,
	minify: !options.watch,
	async onSuccess() {
		exec('cp -r src/ed2/schema dist/ed2/schema', (err, stdout, stderr) => {
			if (err) {
				console.error(`Error copying schema: ${err}`)
				return
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`)
				return
			}
			console.log(`stdout: ${stdout}`)
		})
	}
}))
