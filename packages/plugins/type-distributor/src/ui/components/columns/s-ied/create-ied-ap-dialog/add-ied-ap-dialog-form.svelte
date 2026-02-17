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
	type IedState,
	validateSubmission,
	validateIedBeforeMultiAp,
	validateAccessPoint,
	getAccessPointsFromIED,
	submitForm,
	buildAccessPoint,
	createInitialIedState,
	createInitialAccessPointForm
} from './lib'
import MultiApBackButton from './ui/multi-ap-back-button.svelte'
import IedAndAccessPointOverview from './sections/ied-and-access-point-overview-section.svelte'

let ied = $state<IedState>(createInitialIedState())
let currentAccessPoint = $state(createInitialAccessPointForm())
let accessPoints = $state<AccessPointData[]>([])
let isMultiApMode = $state(false)
let error = $state<string | null>(null)
let selectedExistingIedName = $state('')

$effect(() => {
	if (selectedExistingIedName) {
		ied.name = selectedExistingIedName
		ied.isNew = false
		ied.description = ''
	} else if (!ied.isNew) {
		ied = createInitialIedState()
	}
})

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

const hasCurrentAp = $derived(currentAccessPoint.name.trim().length > 0)
const hasValidIed = $derived(ied.name.trim().length > 0)

const submitLabel = $derived(
	isMultiApMode
		? 'Confirm'
		: ied.isNew
			? 'Create IED & Access Point'
			: 'Add Access Point'
)

const isSubmitDisabled = $derived.by(() => {
	if (isMultiApMode) {
		return accessPoints.length === 0
	}
	return !hasValidIed || !hasCurrentAp
})

function resetForm() {
	ied = createInitialIedState()
	currentAccessPoint = createInitialAccessPointForm()
	accessPoints = []
	selectedExistingIedName = ''
	isMultiApMode = false
	error = null
}

function enterMultiApMode() {
	error = null

	const validationError = validateIedBeforeMultiAp(
		pluginGlobalStore.xmlDocument,
		ied
	)

	if (validationError) {
		error = validationError
		return
	}

	ied = { ...ied, name: ied.name.trim(), description: ied.description.trim() }
	isMultiApMode = true

	if (hasCurrentAp) {
		addAccessPoint()
	}
}

function addAccessPoint() {
	error = null

	const existingApNames = ied.isNew
		? []
		: getAccessPointsFromIED(pluginGlobalStore.xmlDocument, ied.name)

	const validationError = validateAccessPoint(
		currentAccessPoint.name,
		accessPoints.map((ap) => ap.name),
		existingApNames,
		ied.name
	)

	if (validationError) {
		error = validationError
		return
	}

	accessPoints = [
		...accessPoints,
		{
			name: currentAccessPoint.name.trim(),
			description: currentAccessPoint.description.trim()
		}
	]

	currentAccessPoint = createInitialAccessPointForm()
}

function removeAccessPoint(apName: string) {
	accessPoints = accessPoints.filter((ap) => ap.name !== apName)
}

function getAccessPointsForSubmission(): AccessPointData[] {
	if (isMultiApMode) {
		return accessPoints
	}

	const ap = buildAccessPoint(currentAccessPoint.name, currentAccessPoint.description)
	return ap ? [ap] : []
}

function handleSubmit() {
	error = null

	const accessPointsToSubmit = getAccessPointsForSubmission()
	const validationError = validateSubmission({
		ied,
		accessPoints: accessPointsToSubmit,
		xmlDocument: pluginGlobalStore.xmlDocument
	})

	if (validationError) {
		error = validationError
		return
	}

	try {
		submitForm({
			iedName: ied.name.trim(),
			iedDescription: ied.description.trim() || undefined,
			isNewIed: ied.isNew,
			accessPoints: accessPointsToSubmit
		})

		resetForm()
		dialogStore.closeDialog('success')
	} catch (err) {
		error = err instanceof Error ? err.message : 'Failed to create IED'
	}
}

async function handleCancel() {
	await dialogStore.closeDialog('cancel')
}
</script>

<div class="flex flex-col gap-4">
  {#if isMultiApMode}
    <MultiApBackButton
      onGoBackToIedSelection={() => {
        isMultiApMode = false
        accessPoints = []
      }}
    />
    <IedAndAccessPointOverview
      lockedIedName={ied.name}
      lockedIsNewIed={ied.isNew}
      pendingAccessPoints={accessPoints}
      {removeAccessPoint}
    />
  {:else}
    <IedSelectorSection
      bind:selectedIedName={selectedExistingIedName}
      options={sIedOptions}
    />

    {#if ied.isNew}
      <IedFormSection bind:name={ied.name} bind:description={ied.description} />
    {/if}
  {/if}

  <AccessPointFormSection
    bind:name={currentAccessPoint.name}
    bind:description={currentAccessPoint.description}
  />

  <MultiApButton
    {isMultiApMode}
    hasValidInput={isMultiApMode ? hasCurrentAp : hasValidIed}
    onEnterMultiApMode={enterMultiApMode}
    onAddAccessPoint={addAccessPoint}
  />

  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {/if}

  <FormActions
    onCancel={handleCancel}
    onSubmit={handleSubmit}
    {submitLabel}
    disabled={isSubmitDisabled}
  />
</div>
