import type { Xml } from '@oscd-plugins/core-api/plugin/v1'

export namespace Ed2Rev1 {
	export type RootElement = Xml.SclElement<'scl', 'ed2Rev1', undefined>
	export type RootSubElements = {
		header:
			| Xml.SclElement<'header', 'ed2Rev1', undefined>
			| null
			| undefined
		substation: Xml.SclElement<'substation', 'ed2Rev1', undefined>[]
		communication:
			| Xml.SclElement<'communication', 'ed2Rev1', undefined>
			| null
			| undefined
		ied: Xml.SclElement<'ied', 'ed2Rev1', undefined>[]
		dataTypeTemplates:
			| Xml.SclElement<'dataTypeTemplates', 'ed2Rev1', undefined>
			| null
			| undefined
		line: Xml.SclElement<'line', 'ed2Rev1', undefined>[]
		process: Xml.SclElement<'process', 'ed2Rev1', undefined>[]
		text: Xml.SclElement<'text', 'ed2Rev1', undefined> | null | undefined
		private: Xml.SclElement<'private', 'ed2Rev1', undefined>[]
	}

	export type SubstationsSubElements = {
		voltageLevel: Xml.SclElement<'voltageLevel', 'ed2Rev1', undefined>[]
		function: Xml.SclElement<'function', 'ed2Rev1', undefined>[]
	}[]

	export type DataTypeTemplatesSubElements = {
		lNodeType: Xml.SclElement<'lNodeType', 'ed2Rev1', undefined>[]
		dOType: Xml.SclElement<'dOType', 'ed2Rev1', undefined>[]
		dAType: Xml.SclElement<'dAType', 'ed2Rev1', undefined>[]
		enumType: Xml.SclElement<'enumType', 'ed2Rev1', undefined>[]
	}
}
