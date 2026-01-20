<script lang="ts">
import { createSIED, getSIEDs, createAccessPoints } from '@/headless/ied'
import { bayStore } from '@/headless/stores'
import { dialogStore } from '@oscd-plugins/core-ui-svelte'
import IedSelectorSection from './ied-selector-section.svelte'
import IedFormSection from './ied-form-section.svelte'
import AccessPointFormSection from './access-point-form-section.svelte'
import FormActions from './form-actions.svelte'

let iedName = $state('')
let iedDesc = $state('')
let existingSIedName = $state('')
let accessPointName = $state('')
let accessPointDesc = $state('')
let isCreatingIED = $state(false)
let iedCreationError = $state<string | null>(null)

const existingSIeds = $derived.by(() => {
	const sieds = getSIEDs(bayStore.selectedBay ?? '')
	return sieds.map((ied) => ({
		value: ied.getAttribute('name') || '',
		label: ied.getAttribute('name') || 'Unnamed IED'
	}))
})

const sIedOptions = $derived([
	{ value: '', label: 'None (Create New)' },
	...existingSIeds
])

const isCreatingNewIed = $derived(!existingSIedName)
const hasAccessPoint = $derived(accessPointName.trim().length > 0)

const submitLabel = $derived(
	isCreatingNewIed ? 'Create IED & Access Point' : 'Add Access Point'
)

const isSubmitDisabled = $derived(!isCreatingNewIed && !hasAccessPoint)

function validateForm(): string | null {
	if (isCreatingNewIed && !iedName.trim()) {
		return 'IED name is required when creating a new IED'
	}

	if (!isCreatingNewIed && !existingSIedName) {
		return 'Please select an existing IED or create a new one'
	}

	if (!isCreatingNewIed && !hasAccessPoint) {
		return 'Access Point name is required when adding to existing IED'
	}

	return null
}

function buildAccessPoint() {
	if (!hasAccessPoint) return undefined

	return [
		{
			name: accessPointName.trim(),
			description: accessPointDesc.trim() || undefined
		}
	]
}

function resetForm() {
	iedName = ''
	iedDesc = ''
	existingSIedName = ''
	accessPointName = ''
	accessPointDesc = ''
}

async function handleSubmit() {
	iedCreationError = null

	const validationError = validateForm()
	if (validationError) {
		iedCreationError = validationError
		return
	}

	try {
		isCreatingIED = true
		const accessPoint = buildAccessPoint()

		if (isCreatingNewIed) {
			createSIED(iedName.trim(), iedDesc.trim() || undefined, accessPoint)
		} else if (hasAccessPoint && existingSIedName && accessPoint) {
			createAccessPoints(existingSIedName, accessPoint)
		}

		resetForm()
		await dialogStore.closeDialog('success')
	} catch (error) {
		iedCreationError =
			error instanceof Error ? error.message : 'Failed to create IED'
	} finally {
		isCreatingIED = false
	}
}

async function handleCancel() {
	await dialogStore.closeDialog('cancel')
}
</script>

<div class="flex flex-col gap-4">
	<IedSelectorSection
		bind:selectedIedName={existingSIedName}
		options={sIedOptions}
		disabled={isCreatingIED}
	/>

	{#if isCreatingNewIed}
		<IedFormSection
			bind:name={iedName}
			bind:description={iedDesc}
			disabled={isCreatingIED}
		/>
	{/if}

	<AccessPointFormSection
		bind:name={accessPointName}
		bind:description={accessPointDesc}
		disabled={isCreatingIED}
	/>

	{#if iedCreationError}
		<p class="text-sm text-red-600">{iedCreationError}</p>
	{/if}

	<FormActions
		onCancel={handleCancel}
		onSubmit={handleSubmit}
		{submitLabel}
		disabled={isSubmitDisabled}
		isLoading={isCreatingIED}
	/>
</div>
