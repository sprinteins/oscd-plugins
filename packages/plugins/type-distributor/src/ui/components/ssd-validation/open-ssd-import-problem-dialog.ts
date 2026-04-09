import { dialogStore } from '@oscd-plugins/core-ui-svelte'
import type { CreationPrerequisiteError } from '@/headless/domain/type-resolution'
import SsdImportProblemDialog from './ssd-import-problem-dialog.svelte'

type OpenSsdImportProblemDialogOptions = {
	title?: string
	description?: string
}

export async function openSsdImportProblemDialog(
	params: {
		messages: string[]
	} & OpenSsdImportProblemDialogOptions
): Promise<void> {
	if (dialogStore.isOpen) {
		await dialogStore.closeDialog('replaced')
	}

	dialogStore.mountInnerComponent({
		innerComponent: SsdImportProblemDialog,
		innerComponentProps: params
	})

	await dialogStore.openDialog()
}

export async function openSsdImportProblemDialogFromError(
	error: CreationPrerequisiteError,
	options?: OpenSsdImportProblemDialogOptions
): Promise<void> {
	await openSsdImportProblemDialog({
		messages: error.problems.map((problem) => problem.message),
		...options
	})
}
