<svelte:options
	customElement={{
		props: {
			doc: { reflect: true, type: "Object" },
			docName: { reflect: true, type: "String" },
			editCount: { reflect: true, type: "Number" },
			locale: { reflect: true, type: "String" },
			pluginType: { reflect: true, type: "String" },
			isCustomInstance: { reflect: true, type: "Boolean" },
		},
	}}
/>

<script lang="ts">
import jsonPackage from '../package.json'
// CORE
import {
	initPlugin,
	WrongFileLoaded,
	DialogWorkaround
} from '@oscd-plugins/core-ui-svelte'
import {
	canvasStore,
	iedStore,
	pluginLocalStore,
	logicalStore
} from './headless/stores'
// COMPONENTS
import Layout from '@/ui/layout.svelte'
import SidebarLeft from '@/ui/sidebar-left/sidebar-left.svelte'
import CanvasArea from '@/ui/canvas/canvas-area.svelte'
import SidebarRight from '@/ui/sidebar-right/sidebar-right.svelte'
// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Plugin.CustomComponentsProps = $props()

// this plugins relies on Uuids on certain elements
$effect(() => {
	if (
		!pluginLocalStore.isPluginInitialized &&
		pluginLocalStore.rootSubElements.ied
	)
		pluginLocalStore.addRequiredUuids()
})

// update connections
$effect(() => {
	if (iedStore.selectedDataObject && canvasStore.connectionUuids.length)
		canvasStore.getCurrentConnectedUuidsAndAddLogicalToSelection()
})

// reset states on new doc
$effect(() => {
	if (editCount === -1) {
		canvasStore.resetStates()
		iedStore.resetStates()
		logicalStore.resetStates()
	}
})
</script>


<main
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
		theme: "legacy-oscd-instance",
		definition: {
			edition: 'ed2Rev1',
		}
	}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
>
	{#if pluginLocalStore.isPluginInitialized}
		{#if iedStore.iEDList.length}
			<Layout>
				<SidebarLeft slot="sidebar-left" />
				<CanvasArea slot="content" />
				<SidebarRight
					slot="sidebar-right"
				/>
			</Layout>
		{:else}
				<WrongFileLoaded pluginName='I/O Center' errorMessage="There are no IEDs in this file to work with. Open a new file."/>
		{/if}
		
		<DialogWorkaround />
	{/if}
</main>