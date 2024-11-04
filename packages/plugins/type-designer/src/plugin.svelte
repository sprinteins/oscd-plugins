
<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />

<MaterialTheme pluginType={pluginType}>
	<type-designer>
		{#if xmlDocument}
			<CustomDrawer>
				{#if showBanner}
					<div class="banner" style="{showBanner ? 'display:flex;' : 'display:none;'}">
						This plugin is in test phase and not suitable for production use.
						<CustomIconButton icon="close" color="white" on:click={() => showBanner = !showBanner} />
					</div>
				{/if}
				<ElementsTypeContainer />
			</CustomDrawer>
		{:else}
			<div class="no-content">
				<p>No xml document loaded</p>
			</div>
		{/if}
	</type-designer>
</MaterialTheme>

<script lang="ts">
// COMPONENTS
import { MaterialTheme, CustomDrawer, CustomIconButton } from '@oscd-plugins/ui'
import ElementsTypeContainer from '@/views/elements-type-container.svelte'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { dataTypeTemplatesStore } from '@/stores/data-types-templates.store'
import { pluginStore } from '@/stores/plugin.store'
// TYPES
import type { PluginType } from '@oscd-plugins/core'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument | undefined = undefined
export let pluginHostElement: Element
export let pluginType: PluginType = 'editor'
export let editCount: number

//local
let showBanner = true

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

.banner {
	align-items: center;
	justify-content: space-between;
	padding: .25rem 2rem;
	width: 100%;
	background-color: var(--mdc-theme-error);
	color: white;
	position:fixed;
	top: var(--header-height);
	box-sizing: border-box;
}
</style>