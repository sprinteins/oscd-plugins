import type { Remove } from '@openscd/oscd-api'
import { getDocument } from '@/headless/utils'
import { queryAccessPointsFromIed, queryIedElement } from '../../queries'

export function buildEditsForDeleteEmptyIed(iedName: string): Remove[] {
	const doc = getDocument()
	const iedElement = queryIedElement(doc, iedName)

	if (!iedElement) {
		console.warn(`IED with name "${iedName}" not found.`)
		return []
	}

	const hasAccessPoints = queryAccessPointsFromIed(doc, iedName).length > 0
	if (hasAccessPoints) {
		console.warn(`IED with name "${iedName}" is not empty.`)
		return []
	}

	return [{ node: iedElement } as Remove]
}
