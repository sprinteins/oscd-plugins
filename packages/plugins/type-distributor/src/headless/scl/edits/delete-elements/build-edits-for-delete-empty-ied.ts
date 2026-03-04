import type { Remove } from '@openscd/oscd-api'
import { getDocument } from '@/headless/utils'
import { queryIedElement } from '../../queries'

export function buildEditsForDeleteEmptyIed(iedName: string): Remove[] {
	const doc = getDocument()
	const iedElement = queryIedElement(doc, iedName)

	if (!iedElement) {
		return []
	}

	if (iedElement.children.length > 0) {
		return []
	}

	return [{ node: iedElement } as Remove]
}
