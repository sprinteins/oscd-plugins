import type { Xml } from '@oscd-plugins/core-api/plugin/v1'

export namespace IEC61850_90_30 {
	export type RootElement = Xml.SclElement<'scl', 'ed2Rev1', 'IEC61850-90-30'>
	export type RootSubElements = {
		functionTemplate: Xml.SclElement<
			'functionTemplate',
			'ed2Rev1',
			'IEC61850-90-30'
		>[]
	}
	export type PrivateWrapperElement = Xml.SclElement<
		'private',
		'ed2Rev1',
		'IEC61850-90-30'
	>
}
