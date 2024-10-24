
<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />

<MaterialTheme pluginType={pluginType}>
	<type-designer>
		{#if xmlDocument}
				<ElementsTypeContainer />
		{:else}
			<div class="no-content">
				<p>No xml document loaded</p>
			</div>
		{/if}
	</type-designer>
</MaterialTheme>

<script lang="ts">
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import { ElementsTypeContainer } from './components'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { pluginStore, dataTypeTemplatesStore } from './stores'
// TYPES
import type { PluginType } from '@oscd-plugins/core'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument | undefined = undefined
export let pluginHostElement: Element
export let pluginType: PluginType = 'editor'
export let editCount: number

//==== REACTIVITY ====//

$: triggerUpdate({
	updateTrigger: editCount,
	newXmlDocument: xmlDocument,
	newPluginHostElement: pluginHostElement
})
//====== FUNCTIONS =====//

async function triggerUpdate({
	updateTrigger, // is not used but should be passed to the function to trigger reactivity
	newXmlDocument,
	newPluginHostElement
}: {
	updateTrigger: number
	newXmlDocument: XMLDocument | undefined
	newPluginHostElement: Element
}) {
	await pluginStore.init({
		newXmlDocument,
		newPluginHostElement
	})
	dataTypeTemplatesStore.init(xmlDocument)
}
</script>

<style>
.no-content {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>