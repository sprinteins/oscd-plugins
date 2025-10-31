<script lang="ts">
	import { getNetworkingWithOpenPort } from "../../diagram/ied-helper"
	import { Button } from "@oscd-plugins/ui"
	import Textfield from "@smui/textfield"
	import type { CreateCableEvent, UpdateCableEvent } from "../../editor-events/network-events"
	import type { IED } from "../../diagram/networking"
	import type { ConnectionBetweenNodes } from "../../store/index"
	import IedPortSelect from "./ied-port-select.svelte"
	import HelperText from '@smui/textfield/helper-text'
	
	// 
	// INPUT
	
	interface Props {
		// 
		connectionBetweenNodes: ConnectionBetweenNodes;
		cableNames: string[];
		cancel: () => void;
		updateCable: (event: UpdateCableEvent) => void;
		createCable: (event: CreateCableEvent) => void;
	}

	let { connectionBetweenNodes, cableNames, updateCable, cancel, createCable }: Props = $props();
	
	//
	// Internal
	//
	let sourceSelectedPort: string
	let targetSelectedPort: string

	const errors: { required: boolean, cableNameInUse: boolean } = $derived.by(() => {
		const required = !cableName
		const cableNameInUse = !required && cableNameSet.has(cableName)

		return { required, cableNameInUse }
	})

	let cableName: string = $state('')

	$effect(() => {
		cableName = connectionBetweenNodes.cableName ?? generateCableName()
	})

	const {
		isNew,
		existingCableName,
		sourceIed,
		targetIed
	} = $derived.by(() => {
		const isNew = connectionBetweenNodes.isNew
		const existingCableName = isNew ? null : connectionBetweenNodes.cableName
		const sourceIed = connectionBetweenNodes.source
		const targetIed = connectionBetweenNodes.target

		return {
			isNew,
			existingCableName,
			sourceIed,
			targetIed
		}
	})

	const cableNameSet: Set<string> = $derived.by(() => {
		const set = new Set(cableNames)

		if (existingCableName) {
			set.delete(existingCableName)
		}

		return set
	})
	
	function generateCableName(): string {
		return crypto.randomUUID().substring(0, 6)
	}
	
	function onSourceSelect(port: string) {
		sourceSelectedPort = port
	}
	
	function onTargetSelect(port: string) {
		targetSelectedPort = port
	}

	function confirm(): void {
		if (isNew) {
			doCreateCable()
		} else {
			doUpdateCable()
		}
	}

	function doUpdateCable(): void {
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

		updateCable(updateCableEvent)
	}
	
	function doCreateCable(): void {
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
		
		createCable(createCableEvent)
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
</script>

<div class="container">
	<h3>Cable {cableName}</h3>
	<div class="new-connection-textfield-container">
		<Textfield
			bind:value={cableName}
			invalid={errors.required || errors.cableNameInUse}
			label="Cable"
			variant="outlined">
			{#snippet helper()}
				<HelperText persistent >
					{ errors.required ? "Cablename required" : errors.cableNameInUse ? "Cablename allready in use" : "" }
				</HelperText>
			{/snippet}
		</Textfield>
	</div>
	
	<IedPortSelect ied={sourceIed} { existingCableName } select={onSourceSelect}/>
	<IedPortSelect ied={targetIed} { existingCableName } select={onTargetSelect}/>
	
	<div class="actions">
		<Button onclick={confirm} testid="create-cable" disabled={errors.required || errors.cableNameInUse}>
			{ isNew ? "Create" : "Update" }
		</Button>
		<Button onclick={cancel} type="secondary" testid="cancel-create-cable">Cancel</Button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.new-connection-textfield-container {
		display: flex;
		flex-direction: column;
	}

	.new-connection-textfield-container :global(.mdc-text-field-helper-text) {
		color: var(--color-red) !important
	}

	.actions {
		margin-top: 16px;
	}
</style>
