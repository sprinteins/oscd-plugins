import type { Insert } from '@openscd/oscd-api'

export function getOrCreateDataTypeTemplates(
	doc: XMLDocument
): { element: Element; edit: Insert | null } {
	let dataTypeTemplates = doc.querySelector('DataTypeTemplates')
	if (!dataTypeTemplates) {
		dataTypeTemplates = doc.createElement('DataTypeTemplates')
		const root = doc.documentElement

		const edit: Insert = {
			node: dataTypeTemplates,
			parent: root,
			reference: null
		}
		return { element: dataTypeTemplates, edit }
	}
	return { element: dataTypeTemplates, edit: null }
}
