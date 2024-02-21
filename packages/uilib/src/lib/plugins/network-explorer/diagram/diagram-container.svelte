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

import type { DiagramStore } from "../store";
import { get } from "svelte/store"
import Diagram from "./diagram.svelte";
import { useNodes, useEdges, type Node as ElkNode } from '@xyflow/svelte';

import type { Connection, Edge } from "@xyflow/svelte";
import { getIedNameFromId } from "./ied-helper"
import { extractCableNameFromId } from "./edge-helper"
import type { IED } from "./networking";

// 
// INPUT
// 
export let doc: Element
export let editCount: number
export let store: DiagramStore
$: updateOnEditCount(editCount)
$: updateOnDoc(doc)

// 
// CONFIG
// 

// 
// INTERNAL
// 
let root: HTMLElement
let _editCount: number
let _doc: Element

const nodes$ = useNodes();
$: store.updateSelectedNodes($nodes$)

const edges$ = useEdges();
$: store.updateSelectedEdges($edges$)

function updateOnDoc(doc: Element): void {
	if (doc === _doc) {
		return
	}

	_doc = doc
	store.updateNodesAndEdges(doc)
}

function updateOnEditCount(editCount: number): void {
	if (editCount < 0 || editCount === _editCount) {
		return
	}

	_editCount = editCount
	store.updateNodesAndEdges(doc)
}

function onconnect(event: CustomEvent<Connection>): void {
	const { source, target } = event.detail
	const { sourceIed, targetIed } = getSourceAndTargetIed(source, target)

	store.connectionBetweenNodes.set({
		isNew: true,
		source: sourceIed,
		target: targetIed
	})
}


function getSourceAndTargetIed(source: string, target: string): { sourceIed: IED, targetIed: IED } {
	const sourceIedName = getIedNameFromId(source)
	const targetIedName = getIedNameFromId(target)
	const ieds = get(store.ieds)
	const targetAndSource = ieds.filter(ied => ied.name === sourceIedName || ied.name === targetIedName)
	const sourceIed = targetAndSource.find(ied => ied.name === sourceIedName)
	const targetIed = targetAndSource.find(ied => ied.name === targetIedName)

	if (!sourceIed) {
		throw new Error(`Ied ${sourceIedName} not found`)
	}

	if (!targetIed) {
		throw new Error(`Ied ${targetIedName} not found`)
	}

	return { sourceIed: sourceIed, targetIed: targetIed }
}

</script>

<div class="root" bind:this={root}>
	{#if store}
		<Diagram 
			nodes={store.nodes}
			edges={store.edges}
			ieds={store.ieds}
			on:delete
			on:connect={onconnect}
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
