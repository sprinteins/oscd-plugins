import { queryServerHostApNamesFromIed } from '@/headless/scl'
import type { AccessPointData, IedData } from './types'

export function collectServerAtTargets(
	ied: IedData,
	accessPoints: AccessPointData[],
	xmlDocument: XMLDocument | null | undefined
): string[] {
	const targets = ied.isNew
		? []
		: queryServerHostApNamesFromIed(xmlDocument, ied.name.trim())

	for (const accessPoint of accessPoints) {
		const name = accessPoint.name.trim()
		if (!accessPoint.serverAtApName && name) targets.push(name)
	}

	return [...new Set(targets)]
}

export function validateServerAtTargets(
	ied: IedData,
	accessPoints: AccessPointData[],
	xmlDocument: XMLDocument | null | undefined
): string[] {
	const targets = collectServerAtTargets(ied, [], xmlDocument)
	const errors: string[] = []

	for (const accessPoint of accessPoints) {
		const target = accessPoint.serverAtApName?.trim()
		if (target) {
			if (!targets.includes(target)) {
				errors.push(
					`ServerAt target "${target}" for Access Point "${accessPoint.name}" is not a server-hosting Access Point in IED "${ied.name.trim()}".`
				)
			}
		} else {
			const name = accessPoint.name.trim()
			if (name) targets.push(name)
		}
	}

	return errors
}
