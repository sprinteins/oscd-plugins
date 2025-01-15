import type { DEFINITION_PER_VERSION } from '@/plugin/v1/constants'
import type { AvailableStandardVersion } from '@oscd-plugins/core-standard'

export namespace Utils {
	export type CurrentDefinition<
		GenericVersion extends AvailableStandardVersion
	> = (typeof DEFINITION_PER_VERSION)[GenericVersion]

<<<<<<< Updated upstream
	export type CurrentDefinitionElements = keyof CurrentDefinition

	export type CurrentDefinitionElementTags<
		Element extends CurrentDefinitionElements
	> = Utils.CurrentDefinition[Element]['tag']
=======
	export type CurrentDefinitionElement<
		GenericVersion extends AvailableStandardVersion
	> = keyof CurrentDefinition<GenericVersion>

	export type CurrentDefinitionElementTag<
		GenericVersion extends AvailableStandardVersion,
		Element extends CurrentDefinitionElements<GenericVersion>
	> = Utils.CurrentDefinition<GenericVersion>[Element]['tag']

>>>>>>> Stashed changes
	export type CurrentDefinitionElementAttributes<
		GenericVersion extends AvailableStandardVersion,
		Element extends CurrentDefinitionElements<GenericVersion>
	> = Utils.CurrentDefinition<GenericVersion>[Element]['attributes']

	export type PluginType = 'editor' | 'menu' | 'validator'

	export type PluginCustomComponentsProps = {
		doc: XMLDocument
		docName: string
		editCount: number
		locale: string
	}
}
