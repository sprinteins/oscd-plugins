<script lang="ts">
import { dialogStore, pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { untrack } from 'svelte'
import {
	FieldError,
	FormActions
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-elements'
import {
	type IedRenameData,
	type RenameFormErrors,
	submitRenameIed,
	validateRenameIedFields
} from './form-helpers'
import { IedRenameSection } from './form-sections'

interface Props {
	currentIedName: string
	currentDescription: string
	iedElement: Element
}

const { currentIedName, currentDescription, iedElement }: Props = $props()

let ied = $state<IedRenameData>(
	untrack(() => ({ name: currentIedName, description: currentDescription }))
)
let formErrors = $state<RenameFormErrors>({})

const isSubmitDisabled = $derived(
	ied.name.trim().length === 0 ||
		(ied.name.trim() === currentIedName &&
			ied.description.trim() === currentDescription)
)

async function handleSubmit() {
	formErrors = {}

	const errors = validateRenameIedFields({
		ied,
		xmlDocument: pluginGlobalStore.xmlDocument,
		currentIedName
	})
	if (errors) {
		formErrors = { properties: { ied: errors } }
		return
	}

	submitRenameIed({ ied, iedElement, currentIedName, currentDescription })
	await dialogStore.closeDialog('success')
}

async function handleCancel() {
	await dialogStore.closeDialog('cancel')
}
</script>

<form class="flex flex-col gap-4">
  <IedRenameSection bind:ied errors={formErrors.properties?.ied} />
  <FieldError errors={formErrors.errors} />
  <FormActions
    onCancel={handleCancel}
    onSubmit={handleSubmit}
    submitLabel="Rename S-IED"
    isMultiApMode={false}
    onGoBackToIedSelection={() => {}}
    disabled={isSubmitDisabled}
  />
</form>
