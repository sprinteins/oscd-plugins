import type {
	Header,
	Substation,
	Communication,
	Ied,
	DataTypeTemplates,
	Line,
	Process
} from '@oscd-plugins/core-standard/ed2'
import type { Xml } from '@oscd-plugins/core-api/plugin/v1'

export type RootElement = Xml.SclElement<'ed2', Scl.Root> | null
export type RootSubElements = Xml.SubElementsToSclElements<'ed2', 'scl'>

export type SubstationSubElements = Array<
	Xml.SubElementsToSclElements<'ed2', 'substation'>
>
export type DataTypeTemplatesSubElements = Xml.SubElementsToSclElements<
	'ed2',
	'dataTypeTemplates'
>
