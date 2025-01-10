import type { Common } from '@oscd-plugins/core-standard/ed2'
import type { Utils } from '@/plugin/v1/utils'

export namespace Xml {
	export type SclElement<Family extends keyof Utils.CurrentDefinition> =
		Element & {
			tagName: Utils.CurrentDefinitionElementTag<Family>
		}

	export type CommonOptions = {
		root?: Element
	}
}
