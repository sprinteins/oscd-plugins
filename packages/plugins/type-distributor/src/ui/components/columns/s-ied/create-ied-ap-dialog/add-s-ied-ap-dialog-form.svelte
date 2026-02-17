<script lang="ts">
import { querySIEDs } from '@/headless/ied'
import { bayStore } from '@/headless/stores'
import { dialogStore, pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	IedSelectorSection,
	IedFormSection,
	AccessPointFormSection
} from './sections'
import { MultiApButton, FormActions } from './ui'
import {
	type AccessPointData,
	validateForm,
	validateIedForMultiApMode,
	validateAccessPoint,
	getAccessPointsFromIED,
	submitForm,
	buildAccessPoint
} from './lib'
import MultiApBackButton from './ui/multi-ap-back-button.svelte'
  import IedAndAccessPointOverview from './sections/ied-and-access-point-overview.svelte';

let iedName = $state('')
let iedDesc = $state('')
let existingSIedName = $state('')
let accessPointName = $state('')
let accessPointDesc = $state('')
let iedCreationError = $state<string | null>(null)

let isMultiApMode = $state(false)
let lockedIedName = $state('')
let lockedIedDesc = $state('')
let lockedIsNewIed = $state(false)
let pendingAccessPoints = $state<AccessPointData[]>([])

const existingSIeds = $derived.by(() => {
	const sieds = querySIEDs(bayStore.selectedBay ?? '')
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

const hasValidIed = $derived(
	isCreatingNewIed ? iedName.trim().length > 0 : existingSIedName.length > 0
)

const submitLabel = $derived(
	isMultiApMode
		? 'Confirm'
		: isCreatingNewIed
			? 'Create IED & Access Point'
			: 'Add Access Point'
)

const isSubmitDisabled = $derived.by(() => {
	if (isMultiApMode) {
		return pendingAccessPoints.length === 0
	}
	return (
		(isCreatingNewIed && !iedName.trim()) ||
		(!isCreatingNewIed && !hasAccessPoint)
	)
})

function resetForm() {
	iedName = ''
	iedDesc = ''
	existingSIedName = ''
	accessPointName = ''
	accessPointDesc = ''
	isMultiApMode = false
	lockedIedName = ''
	lockedIedDesc = ''
	lockedIsNewIed = false
	pendingAccessPoints = []
}

function enterMultiApMode() {
	iedCreationError = null

	const validationError = validateIedForMultiApMode(
		pluginGlobalStore.xmlDocument,
		isCreatingNewIed,
		iedName
	)

	if (validationError) {
		iedCreationError = validationError
		return
	}

	if (isCreatingNewIed) {
		lockedIedName = iedName.trim()
		lockedIedDesc = iedDesc.trim()
		lockedIsNewIed = true
	} else {
		lockedIedName = existingSIedName
		lockedIsNewIed = false
	}

	isMultiApMode = true
	if (hasAccessPoint) {
		addCurrentAccessPoint()
	}
}

function addCurrentAccessPoint() {
	iedCreationError = null

	const pendingApNames = pendingAccessPoints.map((ap) => ap.name)
	const existingApNames = lockedIsNewIed
		? []
		: getAccessPointsFromIED(pluginGlobalStore.xmlDocument, lockedIedName)

	const validationError = validateAccessPoint(
		accessPointName,
		pendingApNames,
		existingApNames,
		lockedIedName
	)

	if (validationError) {
		iedCreationError = validationError
		return
	}

	pendingAccessPoints = [
		...pendingAccessPoints,
		{
			name: accessPointName.trim(),
			description: accessPointDesc.trim() || undefined
		}
	]

	accessPointName = ''
	accessPointDesc = ''
}

function removeAccessPoint(apName: string) {
	pendingAccessPoints = pendingAccessPoints.filter((ap) => ap.name !== apName)
}

function handleSubmit() {
	iedCreationError = null

	const validationError = isMultiApMode
		? validateForm({
				isMultiApMode: true,
				pendingAccessPointsCount: pendingAccessPoints.length
			})
		: validateForm({
				isMultiApMode: false,
				isCreatingNewIed,
				iedName,
				existingSIedName,
				accessPointName,
				xmlDocument: pluginGlobalStore.xmlDocument
			})

	if (validationError) {
		iedCreationError = validationError
		return
	}

	try {
		if (isMultiApMode) {
			submitForm({
				isMultiApMode: true,
				lockedIedName,
				lockedIedDesc,
				lockedIsNewIed,
				pendingAccessPoints
			})
		} else {
			submitForm({
				isMultiApMode: false,
				isCreatingNewIed,
				iedName,
				iedDesc,
				existingSIedName,
				accessPoint: buildAccessPoint(accessPointName, accessPointDesc)
			})
		}

		resetForm()
		dialogStore.closeDialog('success')
	} catch (error) {
		iedCreationError =
			error instanceof Error ? error.message : 'Failed to create IED'
	}
}

async function handleCancel() {
	await dialogStore.closeDialog('cancel')
}
</script>

<div class="flex flex-col gap-4">
  {#if isMultiApMode}
    <MultiApBackButton
      onGoBackToIedSelection={() => (
        (isMultiApMode = false), (pendingAccessPoints = [])
      )}
    />
   <IedAndAccessPointOverview
			lockedIedName={lockedIedName}
			lockedIsNewIed={lockedIsNewIed}
			pendingAccessPoints={pendingAccessPoints}
			removeAccessPoint={removeAccessPoint}
		/>
  {:else}
    <IedSelectorSection
      bind:selectedIedName={existingSIedName}
      options={sIedOptions}
    />

    {#if isCreatingNewIed}
      <IedFormSection bind:name={iedName} bind:description={iedDesc} />
    {/if}
  {/if}

  <AccessPointFormSection
    isRequired={!isCreatingNewIed && !hasAccessPoint && !isMultiApMode}
    bind:name={accessPointName}
    bind:description={accessPointDesc}
  />

  <MultiApButton
    {isMultiApMode}
    hasValidInput={isMultiApMode ? hasAccessPoint : hasValidIed}
    onEnterMultiApMode={enterMultiApMode}
    onAddAccessPoint={addCurrentAccessPoint}
  />

  {#if iedCreationError}
    <p class="text-sm text-red-600">{iedCreationError}</p>
  {/if}

  <FormActions
    onCancel={handleCancel}
    onSubmit={handleSubmit}
    {submitLabel}
    disabled={isSubmitDisabled}
  />
</div>
