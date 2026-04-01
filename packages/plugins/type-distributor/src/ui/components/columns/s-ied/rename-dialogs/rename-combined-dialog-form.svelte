<script lang="ts">
import { untrack } from 'svelte'
import { dialogStore, pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	FieldError,
	FormActions
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-elements'
import {
	type AccessPointData,
	type IedRenameData,
	type RenameFormErrors,
	submitRenameCombined,
	validateRenameCombinedForm
} from './form-helpers'
import { AccessPointRenameSection, IedRenameSection } from './form-sections'

interface Props {
	currentIedName: string
	currentIedDescription: string
	currentApName: string
	currentApDescription: string
	iedElement: Element
	accessPointElement: Element
}

const {
	currentIedName,
	currentIedDescription,
	currentApName,
	currentApDescription,
	iedElement,
	accessPointElement
}: Props = $props()

let ied = $state<IedRenameData>(
	untrack(() => ({
		name: currentIedName,
		description: currentIedDescription
	}))
)
let accessPoint = $state<AccessPointData>(
	untrack(() => ({ name: currentApName, description: currentApDescription }))
)
let formErrors = $state<RenameFormErrors>({})

const isSubmitDisabled = $derived(
	ied.name.trim().length === 0 ||
		accessPoint.name.trim().length === 0 ||
		(ied.name.trim() === currentIedName &&
			ied.description.trim() === currentIedDescription &&
			accessPoint.name.trim() === currentApName &&
			accessPoint.description.trim() === currentApDescription)
)

async function handleSubmit() {
	formErrors = {}

	const errors = validateRenameCombinedForm({
		ied,
		ap: accessPoint,
		xmlDocument: pluginGlobalStore.xmlDocument,
		currentIedName,
		currentApName
	})
	if (errors) {
		formErrors = errors
		return
	}

	submitRenameCombined({
		ied,
		ap: accessPoint,
		iedElement,
		accessPointElement,
		currentIedName,
		currentIedDescription,
		currentApName,
		currentApDescription
	})
	await dialogStore.closeDialog('success')
}

async function handleCancel() {
	await dialogStore.closeDialog('cancel')
}
</script>

<form class="flex flex-col gap-4">
  <IedRenameSection bind:ied errors={formErrors.properties?.ied} />
  <AccessPointRenameSection
    bind:accessPoint
    errors={formErrors.properties?.ap}
  />
  <FieldError errors={formErrors.errors} />
  <FormActions
    onCancel={handleCancel}
    onSubmit={handleSubmit}
    submitLabel="Rename"
    isMultiApMode={false}
    onGoBackToIedSelection={() => {}}
    disabled={isSubmitDisabled}
  />
</form>
