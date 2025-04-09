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
import { initPlugin, WrongFileLoaded } from '@oscd-plugins/core-ui-svelte'
// LOGIC
import { useQuery } from './query.svelte'
import { newCommand, type Command } from './command.svelte'
// STORE
import { store } from './store.svelte'
import { iedTreeStore } from './headless/stores'
// COMPONENTS
import Layout from '@/ui/layout.svelte'
import SideBarLeft from '@/sidebar-left.svelte'
import CanvasArea from '@/ui/components/canvas/canvas-area.svelte'
import SidebarRight from '@/sidebar-right.svelte'
import { SvelteToast } from '@zerodevx/svelte-toast'
// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'
import type { Nullable } from './types'
import type {
	Connection,
	LcTypes,
	LogicalConditioner
} from './ui/components/canvas/types.canvas'
import type {
	LpElement,
	LpTypes
} from './ui/components/right-bar/lp-list/types.lp-list'

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Plugin.CustomComponentsProps = $props()

//
// Setup
//
let root = $state<Nullable<HTMLElement>>(null)
let cmd = $state<Command>(newCommand(() => root))
useQuery()

// we need to trigger a rerendering when the editCount changes
// this is how OpenSCD lets us know that there was a change in the document
$effect(() => {
	store.editCount = editCount
	store.doc = doc
})

function addLC(type: LcTypes, number?: number, numberOfLCIVPorts?: number) {
	cmd.addLC(type, number, numberOfLCIVPorts)
}

function editLC(
	lc: LogicalConditioner,
	newType: LcTypes,
	numberOfLCIVPorts?: number
) {
	cmd.editLC(lc, newType, numberOfLCIVPorts)
}

function removeLC(lc: LogicalConditioner) {
	cmd.removeLC(lc)
}

function addLP(
	type: LpTypes,
	name: string,
	desc: string,
	number?: number,
	numberOfLPDOPorts?: number
) {
	cmd.addLP(type, name, desc, number, numberOfLPDOPorts)
}

function removeLP(lpElement: LpElement) {
	cmd.removeLP(lpElement)
}

function editLP(lpElement: LpElement, name: string, desc: string) {
	cmd.editLP(lpElement, name, desc)
}

function hasLNodeType(type: LcTypes | LpTypes): boolean {
	return cmd.hasLNodeType(type)
}

function addConnection(connection: Connection) {
	cmd.addConnection(connection)
}

function removeConnection(connection: Connection) {
	cmd.removeConnection(connection)
}
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
	bind:this={root}
>

{#if iedTreeStore.iEDList.length}
	<Layout>
		<SideBarLeft slot="sidebar-left" />
		<CanvasArea
			slot="content"
			{hasLNodeType}
			{addConnection}
			{removeConnection}
		/>
		<SidebarRight
			slot="sidebar-right"
			{addLP}
			{addLC}
			{removeLP}
			{removeLC}
			{editLP}
			{editLC}
			{hasLNodeType}
		/>
		</Layout>
	{:else}
		<WrongFileLoaded pluginName='I/O Center' errorMessage="There are no IEDs in this file to work with. Open a new file."/>
	{/if}
</main>

<div class="toast-wrap">
	<SvelteToast />
</div>

<style>
	.toast-wrap {
		display: contents;
		font-family: Roboto, sans-serif;
		@apply text-sm;
	}
	.toast-wrap :global(strong) {
		font-weight: 600;
	}
</style>
