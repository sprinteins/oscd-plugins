// CORE
import {
	findOneStandardElementBySelector,
	findAllStandardElementsBySelector
} from '@oscd-plugins/core-api/plugin/v1'
import { IEC61850_DEFINITIONS } from '@oscd-plugins/core-standard'
// STORES
import { pluginGlobalStore } from '../plugin-global.svelte.js'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'
import type { Ed2Rev1 } from './types.ed2Rev1.js'

class UseEd2Rev1Store {
	//====== STATES ======//

	currentEditionName = 'ed2Rev1' as const
	currentDefinition: IEC61850.CurrentStableDefinition<
		typeof this.currentEditionName
	> = IEC61850_DEFINITIONS[this.currentEditionName].stable

	rootElement: Ed2Rev1.RootElement | undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (`${pluginGlobalStore.editCount}`)
			return pluginGlobalStore.xmlDocument
				?.documentElement as Ed2Rev1.RootElement
	})

	rootSubElements: Ed2Rev1.RootSubElements | undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (this.rootElement && `${pluginGlobalStore.editCount}`)
			return {
				header: findOneStandardElementBySelector<
					'header',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.header.tag,
					root: this.rootElement
				}),
				substation: findAllStandardElementsBySelector<
					'substation',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.substation.tag,
					root: this.rootElement
				}),
				communication: findOneStandardElementBySelector<
					'communication',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.communication.tag,
					root: this.rootElement
				}),
				ied: findAllStandardElementsBySelector<
					'ied',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.ied.tag,
					root: this.rootElement
				}),
				dataTypeTemplates: findOneStandardElementBySelector<
					'dataTypeTemplates',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.dataTypeTemplates.tag,
					root: this.rootElement
				}),
				line: findAllStandardElementsBySelector<
					'line',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.line.tag,
					root: this.rootElement
				}),
				process: findAllStandardElementsBySelector<
					'process',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.process.tag,
					root: this.rootElement
				}),
				text: findOneStandardElementBySelector<
					'text',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.text.tag,
					root: this.rootElement
				}),
				private: findAllStandardElementsBySelector<
					'private',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.private.tag,
					root: this.rootElement
				})
			}
	})

	substationsSubElements: Ed2Rev1.SubstationsSubElements | undefined =
		$derived.by(() => {
			return this.rootSubElements?.substation.map((substation) => {
				return {
					voltageLevel: findAllStandardElementsBySelector<
						'voltageLevel',
						typeof this.currentEditionName
					>({
						selector: this.currentDefinition.voltageLevel.tag,
						root: substation
					}),
					function: findAllStandardElementsBySelector<
						'function',
						typeof this.currentEditionName
					>({
						selector: this.currentDefinition.function.tag,
						root: substation
					})
				}
			})
		})

	dataTypeTemplatesSubElements:
		| Ed2Rev1.DataTypeTemplatesSubElements
		| undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (this.rootElement && `${pluginGlobalStore.editCount}`)
			return {
				lNodeType: findAllStandardElementsBySelector<
					'lNodeType',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.lNodeType.tag,
					root:
						this.rootSubElements?.dataTypeTemplates ||
						this.rootElement
				}),
				dOType: findAllStandardElementsBySelector<
					'dOType',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.dOType.tag,
					root:
						this.rootSubElements?.dataTypeTemplates ||
						this.rootElement
				}),
				dAType: findAllStandardElementsBySelector<
					'dAType',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.dAType.tag,
					root:
						this.rootSubElements?.dataTypeTemplates ||
						this.rootElement
				}),
				enumType: findAllStandardElementsBySelector<
					'enumType',
					typeof this.currentEditionName
				>({
					selector: this.currentDefinition.enumType.tag,
					root:
						this.rootSubElements?.dataTypeTemplates ||
						this.rootElement
				})
			}
	})
}

export const ed2Rev1Store = new UseEd2Rev1Store()
