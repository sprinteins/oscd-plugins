<script lang="ts">
/**
 * The responsibility of `diagram-container` is to:
 * 1. gather bays, and the network information if IEDs
 * 2. calculate the layout of the diagram
 * 3. render the diagram by converting ELKjs nodes to svelte-flow nodes
 *
 * > See [network-explorer.tldr](../network-explorer.tldr) for
 * > a graphical representation
 */

import type { DiagramStore } from '../store'
import { get } from 'svelte/store'
import Diagram from './diagram.svelte'
import { useNodes, useEdges } from '@xyflow/svelte'

import type { Connection } from '@xyflow/svelte'
import { getIedNameFromId } from './ied-helper'
import type { IED } from './networking'
import type { Networking } from '@oscd-plugins/core'

interface Props {
	doc: Element
	editCount?: number
	store: DiagramStore
	isOutsidePluginContext?: boolean
	onDelete: (networkings: Networking[]) => void
	selectedBays?: string[]
}

let { doc, editCount, store, isOutsidePluginContext = false, onDelete, selectedBays = undefined }: Props = $props()
let root: HTMLElement | null = $state(null)
let _editCount: number
let _doc: Element
const nodes = useNodes()
const edges = useEdges()

function updateOnDoc(doc: Element): void {
	if (doc === _doc) {
		return
	}
	_doc = doc
	store.updateNodesAndEdges(doc)
}

function updateOnEditCount(editCount?: number): void {
	if (editCount === undefined || editCount < 0 || editCount === _editCount) {
		return
	}
	_editCount = editCount
	store.updateNodesAndEdges(doc)
}

function onconnect(connection: Connection): void {
	if (isOutsidePluginContext) return

	const { source, target } = connection
	const { sourceIed, targetIed } = getSourceAndTargetIed(source, target)

	store.setNewConnection(sourceIed, targetIed)
}

function getSourceAndTargetIed(
	source: string,
	target: string
): { sourceIed: IED; targetIed: IED } {
	const sourceIedName = getIedNameFromId(source)
	const targetIedName = getIedNameFromId(target)
	const ieds = get(store.ieds)
	const targetAndSource = ieds.filter(
		(ied) => ied.name === sourceIedName || ied.name === targetIedName
	)
	const sourceIed = targetAndSource.find((ied) => ied.name === sourceIedName)
	const targetIed = targetAndSource.find((ied) => ied.name === targetIedName)

	if (!sourceIed) {
		throw new Error(`Ied ${sourceIedName} not found`)
	}

	if (!targetIed) {
		throw new Error(`Ied ${targetIedName} not found`)
	}

	return { sourceIed: sourceIed, targetIed: targetIed }
}

$effect(() => {
	updateOnEditCount(editCount)
})
$effect(() => {
	updateOnDoc(doc)
})
$effect(() => {
	store.updateSelectedNodes(nodes.current)
})
$effect(() => {
	store.updateSelectedEdges(edges.current)
})
$effect(() => {	
	if (JSON.stringify(store.selectedBays) !== JSON.stringify(selectedBays)) {
		store.setSelectedBays(selectedBays)
		store.updateNodesAndEdges(doc)
	}
})
</script>

<div class="root" bind:this={root}>
	{#if store}
		<Diagram
			nodes={store.nodes}
			edges={store.allEdges}
			ieds={store.ieds}
			{isOutsidePluginContext}
			{onDelete}
			connect={onconnect}
		/>
	{/if}
</div>

<style>
	.root {
		/* --header-height: 128px; */
		display: grid;
		grid-template-columns: auto 0;
		height: calc(100vh - var(--header-height));
		width: 100%;
		overflow-x: hidden;
		flex-grow: 1;
	}
</style>
