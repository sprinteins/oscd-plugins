<svelte:options customElement={{
	props: {
		doc: { reflect: true, type: 'Object'},
		docName: { reflect: true, type: 'String'},
		editCount: { reflect: true, type: 'Number'},
		locale: { reflect: true, type: 'String'},
		pluginType: { reflect: true, type: 'String'}
	}
}} />

<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />


<documentation>
	{#if $xmlDocument}
		<h1>Plugin</h1>
	{:else}
		<div class="no-content">
			<p>No xml document loaded</p>
		</div>
	{/if}
</documentation>

<script lang="ts">
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import pluginStore from './stores/plugin.svelte'
// TYPES
import type { PluginCustomComponentsProps } from '@oscd-plugins/core'

//==== INITIALIZATION ====//

// props
const { doc, docName, editCount, locale }: PluginCustomComponentsProps =
	$props()

// stores
const { xmlDocument } = pluginStore

//==== REACTIVITY ====//

$effect(() => {
	triggerUpdate({
		updateTrigger: editCount,
		newXmlDocument: doc
	})
})

//====== FUNCTIONS =====//

function triggerUpdate({
	updateTrigger, // is not used but should be passed to the function to trigger reactivity
	newXmlDocument
}: {
	updateTrigger: number
	newXmlDocument: XMLDocument | undefined
}) {
	if (newXmlDocument) pluginStore.init(newXmlDocument)
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