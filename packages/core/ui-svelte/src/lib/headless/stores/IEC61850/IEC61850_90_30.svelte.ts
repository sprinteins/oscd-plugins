// CORE
import {
	findAllStandardElementsByTagNameNS,
	findOneStandardElementBySelector
} from '@oscd-plugins/core-api/plugin/v1'
import { IEC61850_DEFINITIONS } from '@oscd-plugins/core-standard'
import * as ed2 from '@oscd-plugins/core-standard/ed2'
// STORES
import { pluginGlobalStore } from '../plugin-global.svelte.js'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'
import type { IEC61850_90_30 } from './types.IEC61850_90_20.js'

class UseIEC61850_90_30Store {
	//====== STATES ======//

	currentEditionName = 'ed2Rev1' as const
	currentRevisionName = 'IEC61850-90-30' as const
	currentNamespacePrefix =
		ed2.rev1.unstable.IEC61850_90_30.CURRENT_NAMESPACE_PREFIX
	currentNamespaceUri = ed2.rev1.unstable.IEC61850_90_30.CURRENT_NAMESPACE_URI

	currentDefinition: IEC61850.CurrentUnstableDefinition<
		typeof this.currentEditionName,
		typeof this.currentRevisionName
	> = IEC61850_DEFINITIONS.ed2Rev1.unstable[this.currentRevisionName]

	rootElement: IEC61850_90_30.RootElement | undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (`${pluginGlobalStore.editCount}`)
			return pluginGlobalStore.xmlDocument
				?.documentElement as IEC61850_90_30.RootElement
	})

	hasUnstableNamespace = $derived(
		this.rootElement?.lookupNamespaceURI(this.currentNamespacePrefix) ===
			this.currentNamespaceUri
	)

	rootSubElements: IEC61850_90_30.RootSubElements | undefined = $derived.by(
		() => {
			// needed to trigger reactivity
			if (this.rootElement && `${pluginGlobalStore.editCount}`)
				return {
					functionTemplate: findAllStandardElementsByTagNameNS<
						'functionTemplate',
						typeof this.currentEditionName,
						typeof this.currentRevisionName
					>({
						namespace: this.currentNamespaceUri,
						tagName: this.currentDefinition.functionTemplate.tag,
						root: this.rootElement
					})
				}
		}
	)

	rootPrivateWrapper:
		| IEC61850_90_30.PrivateWrapperElement
		| undefined
		| null = $derived.by(() => {
		// needed to trigger reactivity
		if (this.rootElement && `${pluginGlobalStore.editCount}`) {
			return findOneStandardElementBySelector<
				'private',
				typeof this.currentEditionName,
				typeof this.currentRevisionName
			>({
				selector: `Private[type=${this.currentNamespacePrefix}]`,
				root: this.rootElement
			})
		}
	})
}

export const IEC61850_90_30Store = new UseIEC61850_90_30Store()
