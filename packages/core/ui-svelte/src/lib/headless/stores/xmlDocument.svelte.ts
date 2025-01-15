import { DEFINITION } from '@oscd-plugins/core-standard/ed2'
import {
	findOneElementBySelector,
	findAllElementsBySelector
} from '@oscd-plugins/core-api/plugin/v1'
// TYPES
import type {
	RootElement,
	RootSubElements,
	SubstationSubElements,
	DataTypeTemplatesSubElements
} from './types.xmlDocument.js'
import type { Utils, Xml } from '@oscd-plugins/core-api/plugin/v1'
import type { AvailableStandardVersion } from '@oscd-plugins/core-standard'

class UseXmlDocumentsStore {
	//====== STATES ======//

	xmlDocument: XMLDocument | undefined = $state.raw()
	xmlDocumentName: string | undefined = $state()
	editCount: number | undefined = $state()
	//====== DERIVED STATES ======//

	xmlDocumentExtension = $derived(this.xmlDocumentName?.split('.').pop())

	rootElement: RootElement | undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (`${xmlDocumentStore.editCount}`) {
			return this.xmlDocument?.firstElementChild as RootElement
		}
	})

	rootSubElements: RootSubElements | undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (`${xmlDocumentStore.editCount}`) {
			return {
				header: this.findOneElement<'ed2', 'header'>({
					selectorTag: DEFINITION.header.tag
				}),
				substation: this.findAllElements<'ed2', 'substation'>({
					selectorTag: DEFINITION.substation.tag
				}),
				communication: this.findOneElement<'ed2', 'communication'>({
					selectorTag: DEFINITION.communication.tag
				}),
				ied: this.findAllElements<'ed2', 'ied'>({
					selectorTag: DEFINITION.ied.tag
				}),
				dataTypeTemplates: this.findOneElement<
					'ed2',
					'dataTypeTemplates'
				>({
					selectorTag: DEFINITION.dataTypeTemplates.tag
				}),
				line: this.findAllElements<'ed2', 'line'>({
					selectorTag: DEFINITION.line.tag
				}),
				process: this.findAllElements<'ed2', 'process'>({
					selectorTag: DEFINITION.process.tag
				}),
				text: this.findOneElement<'ed2', 'text'>({
					selectorTag: DEFINITION.text.tag
				}),
				private: this.findAllElements<'ed2', 'private'>({
					selectorTag: DEFINITION.private.tag
				})
			}
		}
	})

	substationSubElements: SubstationSubElements | undefined = $derived.by(
		() => {
			// needed to trigger reactivity
			if (`${xmlDocumentStore.editCount}`) {
				return this.rootSubElements?.substation.map((substation) => {
					return {
						voltageLevel: this.findAllElements<
							'ed2',
							'voltageLevel'
						>({
							selectorTag: DEFINITION.voltageLevel.tag,
							root: substation
						}),
						function: this.findAllElements<'ed2', 'function'>({
							selectorTag: DEFINITION.function.tag,
							root: substation
						})
					}
				})
			}
		}
	)

	dataTypeTemplatesSubElements: DataTypeTemplatesSubElements | undefined =
		$derived.by(() => {
			// needed to trigger reactivity
			if (`${xmlDocumentStore.editCount}` && this.rootSubElements) {
				return {
					lNodeType: this.findAllElements<'ed2', 'lNodeType'>({
						selectorTag: DEFINITION.lNodeType.tag,
						root: this.rootSubElements.dataTypeTemplates
					}),
					dOType: this.findAllElements<'ed2', 'dOType'>({
						selectorTag: DEFINITION.dOType.tag,
						root: this.rootSubElements.dataTypeTemplates
					}),
					dAType: this.findAllElements<'ed2', 'dAType'>({
						selectorTag: DEFINITION.dAType.tag,
						root: this.rootSubElements.dataTypeTemplates
					}),
					enumType: this.findAllElements<'ed2', 'enumType'>({
						selectorTag: DEFINITION.enumType.tag,
						root: this.rootSubElements.dataTypeTemplates
					})
				}
			}
		})

	//====== PUBLIC ACTIONS ======//

	findOneElement<
		GenericVersion extends AvailableStandardVersion,
		GenericSclElement extends Utils.CurrentDefinitionElement<GenericVersion>
	>({
		selectorTag,
		root
	}: {
		selectorTag: string
		root?: Element
	}) {
		if (!this.xmlDocument) return null
		return findOneElementBySelector<GenericVersion, GenericSclElement>({
			selector: selectorTag,
			root: root || this.xmlDocument.documentElement
		})
	}

	findAllElements<
		GenericVersion extends AvailableStandardVersion,
		GenericSclElement extends Utils.CurrentDefinitionElement<GenericVersion>
	>({
		selectorTag,
		root
	}: {
		selectorTag: string
		root?: Element
	}) {
		if (!this.xmlDocument)
			return [] as Array<
				Xml.SclElement<GenericVersion, GenericSclElement>
			>
		return findAllElementsBySelector<GenericVersion, GenericSclElement>({
			selector: selectorTag,
			root: root || this.xmlDocument.documentElement
		})
	}
}

export const xmlDocumentStore = new UseXmlDocumentsStore()
