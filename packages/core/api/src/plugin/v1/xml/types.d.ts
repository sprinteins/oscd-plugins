import type { AvailableStandardVersion } from '@oscd-plugins/core-standard'
import type { Common } from '@oscd-plugins/core-standard/ed2'
import type { Utils } from '@/plugin/v1/utils'

export namespace Xml {
	export type SclElement<
		GenericVersion extends AvailableStandardVersion,
		Family extends keyof Utils.CurrentDefinition<GenericVersion>
	> = Element & {
		tagName: Utils.CurrentDefinitionElementTag<GenericVersion, Family>
	}

	export type SubElementsToSclElements<
		GenericVersion extends AvailableStandardVersion,
		Family extends keyof Utils.CurrentDefinition<GenericVersion>
	> = {
		[key in keyof Utils.CurrentDefinition<GenericVersion>[Family]['subElements']]: Utils.CurrentDefinition<GenericVersion>[Family]['subElements'][key]['array'] extends boolean
			? Array<SclElement<GenericVersion, key>>
			: SclElement<GenericVersion, key>
	}
	export type CommonOptions = {
		root?: Element
	}
}
