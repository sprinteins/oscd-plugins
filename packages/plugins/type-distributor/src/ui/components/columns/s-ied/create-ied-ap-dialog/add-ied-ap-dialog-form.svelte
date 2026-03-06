<script lang="ts">
import { queryAccessPointsFromIed } from '@/headless/scl'
import { dialogStore, pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	IedSelectorSection,
	IedFormSection,
	AccessPointFormSection
} from './form-sections'
import { MultiApButton, FormActions } from './form-elements'
import {
	type AccessPointData,
	type IedData,
	type FormErrors,
	validateSubmission,
	validateIedFields,
	validateAccessPointFields,
	submitForm,
	createInitialIedData,
	createInitialAccessPoint,
	createInitialAccessPoints
} from './form-helpers'
import IedAndAccessPointOverview from './form-sections/ied-and-access-point-overview-section.svelte'

let ied = $state<IedData>(createInitialIedData())
let accessPoints = $state<AccessPointData[]>(createInitialAccessPoints())
let isMultiApMode = $state(false)
let formErrors = $state<FormErrors>({})

const activeAp = $derived(accessPoints[accessPoints.length - 1])
const confirmedAps = $derived(accessPoints.slice(0, -1))
const hasActiveAp = $derived(activeAp?.name.trim().length > 0)
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
		return !ied.isNew && confirmedAps.length === 0
	}
	return ied.isNew ? !hasValidIed : !hasActiveAp
})

function resetForm() {
	ied = createInitialIedData()
	accessPoints = createInitialAccessPoints()
	isMultiApMode = false
	formErrors = {}
}

function enterMultiApMode() {
	formErrors = {}

	if (ied.isNew) {
		const iedErrors = validateIedFields(ied, pluginGlobalStore.xmlDocument)
		if (iedErrors) {
			formErrors = { properties: { ied: iedErrors } }
			return
		}
		ied = {
			...ied,
			name: ied.name.trim(),
			description: ied.description.trim()
		}
	}

	if (hasActiveAp) {
		const committed = confirmActiveAp()
		if (!committed) return
	}

	isMultiApMode = true
}

function confirmActiveAp(): boolean {
	const existingApNames = ied.isNew
		? []
		: queryAccessPointsFromIed(
				pluginGlobalStore.xmlDocument,
				ied.name.trim()
			)

	const apErrors = validateAccessPointFields(activeAp, {
		pendingNames: confirmedAps.map((ap) => ap.name),
		existingNames: existingApNames,
		iedName: ied.name
	})

	if (apErrors) {
		formErrors = { properties: { ap: apErrors } }
		return false
	}

	accessPoints = [
		...confirmedAps,
		{
			name: activeAp.name.trim(),
			description: activeAp.description.trim()
		},
		createInitialAccessPoint()
	]
	return true
}

function addAccessPoint() {
	formErrors = {}
	confirmActiveAp()
}

function removeAccessPoint(apName: string) {
	accessPoints = [
		...confirmedAps.filter((ap) => ap.name !== apName),
		activeAp
	]
}

function handleSubmit() {
	formErrors = {}

	const submittableAps = isMultiApMode
		? confirmedAps
		: accessPoints.filter((ap) => ap.name.trim())

	const errors = validateSubmission({
		ied,
		accessPoints: submittableAps,
		xmlDocument: pluginGlobalStore.xmlDocument
	})

	if (errors) {
		formErrors = errors
		return
	}

	submitForm(ied, submittableAps)
	resetForm()
	dialogStore.closeDialog('success')
}

async function handleCancel() {
	await dialogStore.closeDialog('cancel')
}
</script>

<form class="flex flex-col gap-4">
  {#if isMultiApMode}
    <IedAndAccessPointOverview {ied} accessPoints={confirmedAps} {removeAccessPoint} />
  {:else}
    <IedSelectorSection bind:ied />
    {#if ied.isNew}
      <IedFormSection bind:ied errors={formErrors.properties?.ied} />
    {/if}
  {/if}

  <AccessPointFormSection
    bind:accessPoint={accessPoints[accessPoints.length - 1]}
    isRequired={!ied.isNew}
    errors={formErrors.properties?.ap?.items?.[0] ?? formErrors.properties?.ap}
  />

  <MultiApButton
    {isMultiApMode}
    hasValidInput={isMultiApMode ? hasActiveAp : hasValidIed}
    onEnterMultiApMode={enterMultiApMode}
    onAddAccessPoint={addAccessPoint}
  />

  <FormActions
    onCancel={handleCancel}
    onSubmit={handleSubmit}
    {submitLabel}
    {isMultiApMode}
    onGoBackToIedSelection={() => {
      isMultiApMode = false;
      accessPoints = [createInitialAccessPoint()];
      formErrors = {};
    }}
    disabled={isSubmitDisabled}
  />
</form>
