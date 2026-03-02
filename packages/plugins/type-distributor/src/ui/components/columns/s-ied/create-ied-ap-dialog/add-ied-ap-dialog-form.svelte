<script lang="ts">
import { queryAccessPointsFromIed } from '@/headless/scl'
import type { LD0Source } from '@/headless/scl'
import { dialogStore, pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	IedSelectorSection,
	IedFormSection,
	AccessPointFormSection,
	Ld0FormSection
} from './form-sections'
import { MultiApButton, FormActions } from './form-elements'
import {
	type AccessPointData,
	type IedData,
	validateSubmission,
	validateIedBeforeMultiAp,
	validateAccessPoint,
	submitForm,
	buildAccessPoint,
	createInitialIedData,
	createInitialAccessPointForm
} from './form-helpers'
import IedAndAccessPointOverview from './form-sections/ied-and-access-point-overview-section.svelte'
import { ssdImportStore } from '@/headless/stores'

let ied = $state<IedData>(createInitialIedData())
let currentAccessPoint = $state(createInitialAccessPointForm())
let accessPoints = $state<AccessPointData[]>([])
let isMultiApMode = $state(false)
let error = $state<string | null>(null)

const ld0FunctionTemplates = $derived(ssdImportStore.ld0FunctionTemplates)

function computeInitialLD0Source(): LD0Source {
	const templates = ssdImportStore.ld0FunctionTemplates
	if (templates.length === 1) {
		return { kind: 'function', functionTemplate: templates[0] }
	}
	return { kind: 'default', onlyMandatoryDOs: false }
}

let selectedLD0Source = $state<LD0Source>(computeInitialLD0Source())

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
		return !ied.isNew && accessPoints.length === 0
	}
	return ied.isNew ? !hasValidIed : !hasCurrentAp
})

function resetForm() {
	ied = createInitialIedData()
	currentAccessPoint = createInitialAccessPointForm()
	accessPoints = []
	isMultiApMode = false
	error = null
	selectedLD0Source = computeInitialLD0Source()
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

	ied = {
		...ied,
		name: ied.name.trim(),
		description: ied.description.trim()
	}

	isMultiApMode = true

	if (hasCurrentAp) {
		addAccessPoint()
	}
}

function addAccessPoint() {
	error = null

	const existingApNames = ied.isNew
		? []
		: queryAccessPointsFromIed(
				pluginGlobalStore.xmlDocument,
				ied.name.trim()
			)

	const validationError = validateAccessPoint({
		apName: currentAccessPoint.name,
		pendingApNames: accessPoints.map((ap) => ap.name),
		existingApNames,
		iedName: ied.name
	})

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
	const ap = buildAccessPoint(
		currentAccessPoint.name,
		currentAccessPoint.description
	)
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

	//TODO: Params
	submitForm(ied, accessPointsToSubmit, selectedLD0Source)
	resetForm()
	dialogStore.closeDialog('success')
}

async function handleCancel() {
	await dialogStore.closeDialog('cancel')
}
</script>

<div class="flex flex-col gap-4">
  {#if isMultiApMode}
    <IedAndAccessPointOverview {ied} {accessPoints} {removeAccessPoint} />
  {:else}
    <IedSelectorSection bind:ied />
    {#if ied.isNew}
      <IedFormSection bind:ied />
    {/if}
  {/if}

  <AccessPointFormSection bind:accessPoint={currentAccessPoint} isRequired={!ied.isNew} />

  <Ld0FormSection {ld0FunctionTemplates} bind:source={selectedLD0Source} />

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
    {isMultiApMode}
    onGoBackToIedSelection={() => {
      isMultiApMode = false;
      accessPoints = [];
    }}
    disabled={isSubmitDisabled}
  />
</div>
