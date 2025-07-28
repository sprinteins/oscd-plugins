<svelte:options 
	customElement={{
		props: {
			doc: { reflect: true, type: 'Object'},
			docName: { reflect: true, type: 'String'},
			editCount: { reflect: true, type: 'Number'},
			locale: { reflect: true, type: 'String'},
			pluginType: { reflect: true, type: 'String'},
			isCustomInstance: { reflect: true, type: 'Boolean'},
		}
	}}
/>

<main 
	id="plugin-container"
	class="overflow-hidden"
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
		theme: 'legacy-oscd-instance',
		useSvelteFlowTheme: true,
		definition: {
			edition: 'ed2Rev1',
		}
	}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
>
	<Sidebar.Provider
		open={false}
		class=" h-[--plugin-container-height] min-h-full"
		style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;"
	>
		<div class="flex flex-col w-full h-[--plugin-container-height] min-h-full">
			<Diagram />
		</div>
		<SidebarWrapper />
	</Sidebar.Provider>
</main>


<script lang="ts">
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import { initPlugin, Sidebar } from '@oscd-plugins/core-ui-svelte'
// COMPONENTS
import SidebarWrapper from '@/ui/components/sidebar/sidebar-wrapper.svelte'
import Diagram from '@/ui/components/diagram/diagram.svelte'
// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'
// SERVICES

// import { initXmlService } from './headless/services/diagram.service'

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Plugin.CustomComponentsProps = $props()
// let trigger = $state(0)

// onMount(() => {
// 	pluginLocalStore.isUsingIndexedDB = isUsingIndexedDB

// 	// Initialize XML service
// 	const xmlServiceInstance = initXmlService(
// 		() => doc.documentElement,
// 		() => editCount
// 	)

// 	// Subscribe to document updates
// 	// xmlServiceInstance.subscribeToUpdate((editCountValue) => {
// 	// 	trigger = editCountValue
// 	// })
// })
</script>