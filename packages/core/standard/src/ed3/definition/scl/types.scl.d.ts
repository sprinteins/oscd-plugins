import type { Common } from '../shared'
import type {
	Header,
	Substation,
	Communication,
	Ied,
	DataTypeTemplates,
	Line,
	Process
} from '../'

export namespace Scl {
	type Root = Common.BaseElement & {
		tag: 'SCL'
		attributes: {
			version: SclVersion
			revision: SclRevision
			release: SclRelease
		}
		subElements: {
			header?: Header.Root
			substation?: Substation.Root[]
			communication?: Communication.Root
			ied?: Ied.Root[]
			dataTypeTemplates?: DataTypeTemplates.Root
			line?: Line.Root[]
			process?: Process.Root[]
		}
	}

	export type SclVersion = '2007' | '2003'
	export type SclRevision = 'B' | undefined
	export type SclRelease = '4' | undefined
}
