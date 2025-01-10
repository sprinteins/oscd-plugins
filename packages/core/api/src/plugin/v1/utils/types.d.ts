import type { DEFINITION_PER_VERSION } from '@/plugin/v1/constants'
import type { StandardVersion } from '@oscd-plugins/core-standard/ed2'

export namespace Utils {
	export type CurrentDefinition =
		(typeof DEFINITION_PER_VERSION)[StandardVersion]

	export type CurrentDefinitionElements = keyof CurrentDefinition

	export type CurrentDefinitionElementTags<
		Element extends CurrentDefinitionElements
	> = Utils.CurrentDefinition[Element]['tag']
	export type CurrentDefinitionElementAttributes<
		Element extends CurrentDefinitionElements
	> = Utils.CurrentDefinition[Element]['attributes']

	export type PluginType = 'editor' | 'menu' | 'validator'

	export type PluginCustomComponentsProps = {
		doc: XMLDocument
		docName: string
		editCount: number
		locale: string
	}
}
