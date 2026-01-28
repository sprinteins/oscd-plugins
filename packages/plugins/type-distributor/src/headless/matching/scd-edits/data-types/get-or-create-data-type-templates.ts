import type { XMLEditor } from '@openscd/oscd-editor'

export function getOrCreateDataTypeTemplates(
	doc: XMLDocument,
	editor: XMLEditor
): Element {
	let dataTypeTemplates = doc.querySelector('DataTypeTemplates')
	if (!dataTypeTemplates) {
		dataTypeTemplates = doc.createElement('DataTypeTemplates')
		const root = doc.documentElement
		editor.commit(
			{
				node: dataTypeTemplates,
				parent: root,
				reference: null
			},
			{ title: 'Create DataTypeTemplates' }
		)
	}
	return dataTypeTemplates
}
