import type { FunctionTemplate } from '..'

export namespace Scl {
	type Root = {
		tag: 'SCL'
		subElements: {
			functionTemplate?: FunctionTemplate.Root[]
		}
	}
}
