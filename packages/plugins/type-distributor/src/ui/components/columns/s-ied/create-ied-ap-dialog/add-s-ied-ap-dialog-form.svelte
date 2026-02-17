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
	type LockedIedState,
	validateForm,
	validateIedForMultiApMode,
	validateAccessPoint,
	getAccessPointsFromIED,
	submitForm,
	buildAccessPoint,

  resetPendingAccessPoints

} from './lib'
import MultiApBackButton from './ui/multi-ap-back-button.svelte'
import IedAndAccessPointOverview from './sections/ied-and-access-point-overview.svelte'

let iedForm = $state({ name: '', description: '' })
let accessPointForm = $state({ name: '', description: '' })
let existingSIedName = $state('')
let iedCreationError = $state<string | null>(null)

let isMultiApMode = $state(false)
let lockedIed = $state<LockedIedState>({
	name: '',
	description: '',
	isNew: false,
	pendingAccessPoints: []
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

const isCreatingNewIed = $derived(!existingSIedName)
const hasAccessPoint = $derived(accessPointForm.name.trim().length > 0)

const hasValidIed = $derived(
	isCreatingNewIed ? iedForm.name.trim().length > 0 : existingSIedName.length > 0
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
		return lockedIed.pendingAccessPoints.length === 0
	}
	return (
		(isCreatingNewIed && !iedForm.name.trim()) ||
		(!isCreatingNewIed && !hasAccessPoint)
	)
})

function resetForm() {
	iedForm = { name: '', description: '' }
	accessPointForm = { name: '', description: '' }
	existingSIedName = ''
	iedCreationError = null
	isMultiApMode = false
	lockedIed = {
		name: '',
		description: '',
		isNew: false,
		pendingAccessPoints: []
	}
}

function resetPendingAccessPoint() {
	accessPointForm = { name: '', description: '' }
}

function enterMultiApMode() {
	iedCreationError = null

	const validationError = validateIedForMultiApMode(
		pluginGlobalStore.xmlDocument,
		isCreatingNewIed,
		iedForm.name
	)

	if (validationError) {
		iedCreationError = validationError
		return
	}

	if (isCreatingNewIed) {
		lockedIed = {
			name: iedForm.name.trim(),
			description: iedForm.description.trim(),
			isNew: true,
			pendingAccessPoints: []
		}
	} else {
		lockedIed = {
			...lockedIed,
			name: existingSIedName,
			isNew: false
		}
	}

	isMultiApMode = true
	if (hasAccessPoint) {
		addCurrentAccessPoint()
	}
}

function addCurrentAccessPoint() {
	iedCreationError = null

	const pendingApNames = lockedIed.pendingAccessPoints.map((ap) => ap.name)
	const existingApNames = lockedIed.isNew
		? []
		: getAccessPointsFromIED(pluginGlobalStore.xmlDocument, lockedIed.name)

	const validationError = validateAccessPoint(
		accessPointForm.name,
		pendingApNames,
		existingApNames,
		lockedIed.name
	)

	if (validationError) {
		iedCreationError = validationError
		return
	}

	lockedIed.pendingAccessPoints = [
		...lockedIed.pendingAccessPoints,
		{
			name: accessPointForm.name.trim(),
			description: accessPointForm.description.trim() || undefined
		}
	]

	resetPendingAccessPoint()
}

function removeAccessPoint(apName: string) {
	lockedIed.pendingAccessPoints = lockedIed.pendingAccessPoints.filter(
		(ap) => ap.name !== apName
	)
}

function buildAccessPoints(): AccessPointData[] {
	if (isMultiApMode) {
		return lockedIed.pendingAccessPoints
	}

	const ap = buildAccessPoint(accessPointForm.name, accessPointForm.description)
	return ap ? [ap] : []
}

function handleSubmit() {
	iedCreationError = null

	const validationError = isMultiApMode
		? validateForm({
				isMultiApMode: true,
				pendingAccessPointsCount: lockedIed.pendingAccessPoints.length
			})
		: validateForm({
				isMultiApMode: false,
				isCreatingNewIed,
				iedName: iedForm.name,
				existingSIedName,
				accessPointName: accessPointForm.name,
				xmlDocument: pluginGlobalStore.xmlDocument
			})

	if (validationError) {
		iedCreationError = validationError
		return
	}

	try {
		const accessPoints = buildAccessPoints()
		const iedName = isMultiApMode ? lockedIed.name : (isCreatingNewIed ? iedForm.name.trim() : existingSIedName)
		const iedDescription = isMultiApMode ? lockedIed.description : iedForm.description.trim()
		const isNewIed = isMultiApMode ? lockedIed.isNew : isCreatingNewIed

		submitForm({
			iedName,
			iedDescription: iedDescription || undefined,
			isNewIed,
			accessPoints
		})

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
        (isMultiApMode = false), (lockedIed = resetPendingAccessPoints(lockedIed))
      )}
    />
    <IedAndAccessPointOverview
      lockedIedName={lockedIed.name}
      lockedIsNewIed={lockedIed.isNew}
      pendingAccessPoints={lockedIed.pendingAccessPoints}
      {removeAccessPoint}
    />
  {:else}
    <IedSelectorSection
      bind:selectedIedName={existingSIedName}
      options={sIedOptions}
    />

    {#if isCreatingNewIed}
      <IedFormSection bind:name={iedForm.name} bind:description={iedForm.description} />
    {/if}
  {/if}

  <AccessPointFormSection
    isRequired={!isCreatingNewIed && !hasAccessPoint && !isMultiApMode}
    bind:name={accessPointForm.name}
    bind:description={accessPointForm.description}
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
