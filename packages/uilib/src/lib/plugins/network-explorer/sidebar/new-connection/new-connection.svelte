<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getNetworkingWithOpenPort } from "../../diagram/ied-helper"
	import { Button } from "../../../../components/button"
	import { Textfield } from "../../../../components/textfield"
	import type { CreateCableEvent, UpdateCableEvent } from "../../editor-events/network-events"
	import type { IED } from "../../diagram/networking"
	import type { ConnectionBetweenNodes } from "../../store/index"
	import IedPortSelect from "./ied-port-select.svelte"
	import HelperText from '@smui/textfield/helper-text'
	
	// 
	// INPUT
	// 
	export let connectionBetweenNodes: ConnectionBetweenNodes | null
	export let cableNames: string[]
	
	//
	// Internal
	//
	const dispatch = createEventDispatcher();
	let sourceIed: IED
	let sourceSelectedPort: string
	let targetIed: IED
	let targetSelectedPort: string
	let cableName: string
	let isNew: boolean
	let existingCableName: string | null | undefined
	let cableNameSet: Set<string> = new Set()
	let errors: { required: boolean, cableNameInUse: boolean } = { required: false, cableNameInUse: false }
	
	$: onNewConnection(connectionBetweenNodes)
	$: onCableNames(cableNames)
	
	function onNewConnection(newConnectionBetweenNodes: ConnectionBetweenNodes | null) {
		if (!newConnectionBetweenNodes) {
			throw new Error('Input newConnectionBetweenNodes may not be null')
		}
		
		isNew = newConnectionBetweenNodes.isNew
		existingCableName = isNew ? null : newConnectionBetweenNodes.cableName
		sourceIed = newConnectionBetweenNodes.source
		targetIed = newConnectionBetweenNodes.target
		
		cableName = newConnectionBetweenNodes.cableName ?? generateCableName()

		errors = { required: false, cableNameInUse: false }
	}

	function onCableNames(cableNames: string[]): void {
		cableNameSet = new Set(cableNames)

		if (existingCableName) {
			cableNameSet.delete(existingCableName)
		}
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

	function confirm(): void {
		if (isNew) {
			createCable()
		} else {
			updateCable()
		}
	}

	function updateCable(): void {
		if (!existingCableName) {
			throw new Error(`Existing cable not found during update`)
		}

		const oldSourcePort = getOldPort(sourceIed, existingCableName)
		const oldTargetPort = getOldPort(targetIed, existingCableName)
		const newSourcePort = sourceSelectedPort || oldSourcePort
		const newTargetPort = targetSelectedPort || oldTargetPort

		const updateCableEvent: UpdateCableEvent = {
			cable: cableName,
			source: {
				ied: sourceIed,
				oldPort: oldSourcePort,
				newPort: newSourcePort
			},
			target: {
				ied: targetIed,
				oldPort: oldTargetPort,
				newPort: newTargetPort
			}
		}

		dispatch("updateCable", updateCableEvent)
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

	function getOldPort(ied: IED, cable: string): string {
		const port = ied.networking.find(net => net.cable === cable)?.port

		if (!port) {
			throw new Error(`Port for cable ${cable} in IED ${ied.name} not found`)
		}

		return port
	}

	function onCableInput(): void {
		const required = !cableName
		const cableNameInUse = !required && cableNameSet.has(cableName)

		errors = { required, cableNameInUse }
	}
</script>

<div class="container">
	<h3>Cable {cableName}</h3>
	<Textfield
		bind:value={cableName}
		invalid={errors.required || errors.cableNameInUse}
		on:input={onCableInput}
		label="Cable"
		variant="outlined">
		<HelperText persistent slot="helper">
			{ errors.required ? "Cablename required" : errors.cableNameInUse ? "Cablename allready in use" : "" }
		</HelperText>
	</Textfield>
	
	<IedPortSelect ied={sourceIed} { existingCableName } on:select={onSourceSelect}/>
	<IedPortSelect ied={targetIed} { existingCableName } on:select={onTargetSelect}/>
	
	<div class="actions">
		<Button on:click={confirm} testid="create-cable" disabled={errors.required || errors.cableNameInUse}>
			{ isNew ? "Create" : "Update" }
		</Button>
		<Button on:click={cancel} type="secondary" testid="cancel-create-cable">Cancel</Button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.actions {
		margin-top: 16px;
	}
</style>
