<script lang="ts">
import { Button, Input, Label } from '@oscd-plugins/core-ui-svelte'
import type {
	CreateCableEvent,
	UpdateCableEvent
} from '../../editor-events/network-events'
import type { ConnectionBetweenNodes } from '../../store'
import {
	buildCreateCableEvent,
	buildUpdateCableEvent,
	getCableNameErrors,
	getInitialPort
} from './cable-form.new-connection'
import IedPortSelect from './ied-port-select.svelte'

interface Props {
	connectionBetweenNodes: ConnectionBetweenNodes
	cableNames: string[]
	cancel: () => void
	updateCable: (event: UpdateCableEvent) => void
	createCable: (event: CreateCableEvent) => void
}

let {
	connectionBetweenNodes,
	cableNames,
	updateCable,
	cancel,
	createCable
}: Props = $props()

let sourceSelectedPort = $state('')
let targetSelectedPort = $state('')

let cableName = $state('')

$effect(() => {
	cableName =
		connectionBetweenNodes.cableName ?? crypto.randomUUID().substring(0, 6)
	sourceSelectedPort = getInitialPort(
		connectionBetweenNodes.source,
		connectionBetweenNodes.cableName ?? null
	)
	targetSelectedPort = getInitialPort(
		connectionBetweenNodes.target,
		connectionBetweenNodes.cableName ?? null
	)
})

const { isNew, existingCableName, sourceIed, targetIed } = $derived.by(() => ({
	isNew: connectionBetweenNodes.isNew,
	existingCableName: connectionBetweenNodes.isNew
		? null
		: (connectionBetweenNodes.cableName ?? null),
	sourceIed: connectionBetweenNodes.source,
	targetIed: connectionBetweenNodes.target
}))

const errors = $derived(
	getCableNameErrors(cableName, cableNames, existingCableName)
)

function confirm(): void {
	if (isNew) {
		createCable(
			buildCreateCableEvent(
				connectionBetweenNodes,
				cableName,
				sourceSelectedPort,
				targetSelectedPort
			)
		)
	} else {
		updateCable(
			buildUpdateCableEvent(
				connectionBetweenNodes,
				cableName,
				sourceSelectedPort,
				targetSelectedPort
			)
		)
	}
}
</script>

<div class="cable-form">
			<h3>Cable {cableName}</h3>
			<div class="cable-name">
				<Label.Root for="cable-name">Cable</Label.Root>
				<Input.Root
					id="cable-name"
					bind:value={cableName}
					aria-invalid={errors.required || errors.cableNameInUse}
					aria-describedby="cable-name-error"
				/>
				<p id="cable-name-error" aria-live="polite">
					{errors.required
						? 'Cablename required'
						: errors.cableNameInUse
							? 'Cablename allready in use'
							: ''}
				</p>
			</div>

			<IedPortSelect
				ied={sourceIed}
				existingCableName={existingCableName}
				bind:selectedPort={sourceSelectedPort}
			/>
			<IedPortSelect
				ied={targetIed}
				existingCableName={existingCableName}
				bind:selectedPort={targetSelectedPort}
			/>

			<div class="actions">
				<Button.Root
					onclick={confirm}
					data-testid="create-cable"
					disabled={errors.required || errors.cableNameInUse}
				>
					{isNew ? 'Create' : 'Update'}
				</Button.Root>
				<Button.Root
					onclick={cancel}
					variant="secondary"
					data-testid="cancel-create-cable"
				>
					Cancel
				</Button.Root>
			</div>
</div>

<style>
	.cable-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.cable-name {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.cable-name p {
		min-height: 1.25rem;
		margin: 0;
		color: var(--color-red, #b00020);
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 16px;
	}
</style>
