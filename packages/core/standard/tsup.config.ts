import { defineConfig } from 'tsup'
import { exec } from 'node:child_process'

function copySchemaToDist(version: 'ed2' | 'ed3') {
	exec(
		`cp -r src/${version}/schema dist/${version}/schema`,
		(err, stdout, stderr) => {
			if (err) {
				console.error(`Error copying schema ${version}: ${err}`)
				return
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`)
				return
			}
			console.log(`stdout: ${stdout}`)
		}
	)
}

export default defineConfig((options) => ({
	name: 'core-standard',
	entry: {
		index: 'src/index.ts',
		'ed2/index': 'src/ed2/index.ts',
		'ed3/index': 'src/ed3/index.ts'
	},
	clean: true,
	format: ['esm'],
	sourcemap: true,
	dts: true,
	treeshake: true,
	splitting: true,
	minify: !options.watch,
	async onSuccess() {
		copySchemaToDist('ed2')
		copySchemaToDist('ed3')
	}
}))
