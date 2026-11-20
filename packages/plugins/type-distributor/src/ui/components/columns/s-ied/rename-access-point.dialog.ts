import { dialogStore } from '@oscd-plugins/core-ui-svelte'
import { RenameCombinedDialogForm } from './rename-dialogs'

type OpenRenameAccessPointDialogParams = {
	iedName: string
	iedElement: Element
	accessPoint: Element
}

export async function openRenameAccessPointDialog({
	iedName,
	iedElement,
	accessPoint
}: OpenRenameAccessPointDialogParams): Promise<void> {
	dialogStore.mountInnerComponent({
		innerComponent: RenameCombinedDialogForm,
		innerComponentProps: {
			currentIedName: iedName,
			currentIedDescription: iedElement.getAttribute('desc') ?? '',
			currentApName: accessPoint.getAttribute('name') ?? '',
			currentApDescription: accessPoint.getAttribute('desc') ?? '',
			iedElement,
			accessPointElement: accessPoint
		}
	})
	await dialogStore.openDialog()
}
