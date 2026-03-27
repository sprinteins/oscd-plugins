import { dialogStore } from '@oscd-plugins/core-ui-svelte'
import { CreationPrerequisiteError } from '@/headless/domain/type-resolution'
import { INVALID_XML_IMPORT_MESSAGE, loadFromLocal } from '@/headless/import'
import {
	openSsdImportProblemDialog,
	openSsdImportProblemDialogFromError
} from './open-ssd-import-problem-dialog'

export async function handleImportSSD(): Promise<void> {
	try {
		await loadFromLocal()
	} catch (error) {
		if (error instanceof CreationPrerequisiteError) {
			await openSsdImportProblemDialogFromError(error, {
				title: 'Cannot import SSD',
				description:
					'Resolve the following SSD problems before importing the file.'
			})
			return
		}

		if (
			error instanceof Error &&
			error.message === INVALID_XML_IMPORT_MESSAGE
		) {
			await openSsdImportProblemDialog({
				title: 'Cannot import SSD',
				description: 'The selected SSD file could not be loaded.',
				messages: [error.message]
			})
			return
		}

		if (error instanceof Error && error.message !== 'No file selected') {
			await openSsdImportProblemDialog({
				title: 'Cannot import SSD',
				description: 'The selected SSD file could not be loaded.',
				messages: [error.message]
			})
			return
		}

		throw error
	} finally {
		dialogStore.resetReturnValue()
	}
}
