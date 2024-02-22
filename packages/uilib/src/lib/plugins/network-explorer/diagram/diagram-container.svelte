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
import Diagram from "./diagram.svelte";
import { useNodes, useEdges, type Node as ElkNode } from '@xyflow/svelte';

import type { Connection, Edge } from "@xyflow/svelte";
import { getIedNameFromId, getNetworkingWithOpenPort } from "./ied-helper"
import type { IED } from "./networking";
import type { CreateCableEvent } from "../editor-events/network-events";
import { EditorEventHandler } from "../editor-events/editor-event-handler";

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
$: editEventHandler = new EditorEventHandler(root)

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
	const sourceIEDName = getIedNameFromId(event.detail.source)
	const targetIEDName = getIedNameFromId(event.detail.target)

	const sourceIED = store.findIEDByName(sourceIEDName)
	const targetIED = store.findIEDByName(targetIEDName)

	if( !sourceIED || !targetIED ) {
		throw new Error(`msg='ied not found' sourceIEDName='${sourceIEDName}' targetIEDName='${targetIEDName}''`)
	}


	const openSourcePort = findFirstOpenPort(sourceIED)
	const openTargetPort = findFirstOpenPort(targetIED)

	if( !openSourcePort || !openTargetPort ) {
		console.error({"level":"error", msg:"no free port found", sourceIED, targetIED})
		throw new Error("msg='no free port found")
	}

	const cableName = generateCableName()
	const createEvent: CreateCableEvent = {
		cable: cableName,
		source: {
			ied: sourceIED,
			port: openSourcePort
		},
		target: {
			ied: targetIED,
			port: openTargetPort,
		},
	}
	store.preSelectedCableName = cableName
	editEventHandler.dispatchCreateCable(createEvent)
}

function generateCableName(): string {
		return crypto.randomUUID().substring(0, 6)
	}


function findFirstOpenPort(ied: IED): string | undefined {
	return getNetworkingWithOpenPort(ied)[0]?.port
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
