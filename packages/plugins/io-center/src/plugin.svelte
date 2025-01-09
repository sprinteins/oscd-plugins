<svelte:options customElement={{
	props: {
		doc: { reflect: true, type: 'Object'},
		docName: { reflect: true, type: 'String'},
		editCount: { reflect: true, type: 'Number'},
		locale: { reflect: true, type: 'String'},
		pluginType: { reflect: true, type: 'String'}
	}
}} />

<Theme pluginName={jsonPackage.name} pluginVersion={jsonPackage.version}>
	<h1>IO Center</h1>
</Theme>

<script lang="ts">
import { onMount } from 'svelte'
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import { Theme, xmlDocumentStore } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'

// props
const { doc, editCount }: Utils.PluginCustomComponentsProps = $props()

// composables
//====== HOOKS ======//

onMount(() => {
	// set the document
	xmlDocumentStore.update({
		newXmlDocument: doc,
		editCount
	})
})
</script>