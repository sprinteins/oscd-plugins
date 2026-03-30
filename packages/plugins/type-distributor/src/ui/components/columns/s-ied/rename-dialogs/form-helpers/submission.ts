import {
	renameAccessPoint,
	renameIed,
	renameIedAndAccessPoint
} from '@/headless/actions'
import type { AccessPointRenameData, IedRenameData } from './types'

type SubmitRenameIedParams = {
	ied: IedRenameData
	iedElement: Element
	currentIedName: string
	currentDescription: string
}

export function submitRenameIed({
	ied,
	iedElement,
	currentIedName,
	currentDescription
}: SubmitRenameIedParams): void {
	const newName = ied.name.trim()
	const newDesc = ied.description.trim()

	if (newName === currentIedName && newDesc === currentDescription) return

	renameIed({
		iedElement,
		oldName: currentIedName,
		newName,
		newDescription: newDesc
	})
}

type SubmitRenameCombinedParams = {
	ied: IedRenameData
	ap: AccessPointRenameData
	iedElement: Element
	accessPointElement: Element
	currentIedName: string
	currentIedDescription: string
	currentApName: string
	currentApDescription: string
}

export function submitRenameCombined({
	ied,
	ap,
	iedElement,
	accessPointElement,
	currentIedName,
	currentIedDescription,
	currentApName,
	currentApDescription
}: SubmitRenameCombinedParams): void {
	const newIedName = ied.name.trim()
	const newIedDesc = ied.description.trim()
	const newApName = ap.name.trim()
	const newApDesc = ap.description.trim()

	const iedChanged =
		newIedName !== currentIedName || newIedDesc !== currentIedDescription
	const apChanged =
		newApName !== currentApName || newApDesc !== currentApDescription

	if (!iedChanged && !apChanged) return

	if (iedChanged && apChanged) {
		renameIedAndAccessPoint({
			iedElement,
			accessPoint: accessPointElement,
			oldIedName: currentIedName,
			newIedName,
			newIedDescription: newIedDesc,
			oldApName: currentApName,
			newApName,
			newApDescription: newApDesc
		})
	} else if (iedChanged) {
		renameIed({
			iedElement,
			oldName: currentIedName,
			newName: newIedName,
			newDescription: newIedDesc
		})
	} else {
		renameAccessPoint({
			accessPoint: accessPointElement,
			iedName: currentIedName,
			oldName: currentApName,
			newName: newApName,
			newDescription: newApDesc
		})
	}
}
