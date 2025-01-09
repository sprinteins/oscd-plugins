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
	<Sidebar.Provider 
		open={false}
		class={`overflow-hidden ${import.meta.env.DEV ? 'h-svh': 'h-[--global-height] min-h-full'}`}
		style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;"
	>
		<ColumnsContainer />
		<SidebarWrapper />
	</Sidebar.Provider>
</Theme>

<script lang="ts">
import { onMount } from 'svelte'
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import { Theme, Sidebar, xmlDocumentStore } from '@oscd-plugins/core-ui-svelte'
// COMPONENTS
import ColumnsContainer from '@/ui/views/columns-container.svelte'
import SidebarWrapper from '@/ui/components/sidebar-wrapper.svelte'
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