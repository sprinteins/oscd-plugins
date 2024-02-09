<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getNetworkingWithOpenPort } from "../../diagram/ied-helper"
	import { Button } from "../../../../components/button"
	import type { CreateCableEvent } from "../../editor-events/network-events"
	import type { IED } from "../../diagram/networking"
	import type { NewConnectionBetweenNodes } from "../../store/index"
	import IedPortSelect from "./ied-port-select.svelte"

	// 
	// INPUT
	// 
	export let newConnectionBetweenNodes: NewConnectionBetweenNodes | null

	//
	// Internal
	//
	const dispatch = createEventDispatcher();
	let sourceIed: IED
	let sourceSelectedPort: string
    let targetIed: IED
	let targetSelectedPort: string
    let cableName: string

	$: onNewConnection(newConnectionBetweenNodes)

	function onNewConnection(newConnectionBetweenNodes: NewConnectionBetweenNodes | null) {
        if (!newConnectionBetweenNodes) {
            throw new Error('Input newConnectionBetweenNodes may not be null')
        }

        sourceIed = newConnectionBetweenNodes.source
        targetIed = newConnectionBetweenNodes.target

        cableName = generateCableName()
    }

	function generateCableName(): string {
        return crypto.randomUUID().substring(0, 6)
    }

	function onSourceSelect(e: CustomEvent<string>) {
		sourceSelectedPort = e.detail
	}

	function onTargetSelect(e: CustomEvent<string>) {
		targetSelectedPort = e.detail
	}

	function createCable(): void {
		const sourcePort = sourceSelectedPort || getDefaultPort(sourceIed)
		const targetPort = targetSelectedPort || getDefaultPort(targetIed)

		const createCableEvent: CreateCableEvent = {
			cable: cableName,
			source: {
				ied: sourceIed,
				port: sourcePort,
			},
			target: {
				ied: targetIed,
				port: targetPort,
			},
		}

		dispatch("createCable", createCableEvent)
	}

	function cancel(): void {
		dispatch("cancel")
	}

	function getDefaultPort(ied: IED): string {
		return getNetworkingWithOpenPort(ied)[0].port
	}
</script>

<div class="container">
	<h3>Cable {cableName}</h3>

	<IedPortSelect ied={sourceIed} on:select={onSourceSelect}/>
	<IedPortSelect ied={targetIed} on:select={onTargetSelect}/>

	<div class="actions">
		<Button on:click={createCable} testid="create-cable">Create</Button>
		<Button on:click={cancel} type="secondary" testid="cancel-create-cable">Cancel</Button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
</style>
