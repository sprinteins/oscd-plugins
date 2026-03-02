import type { IedData } from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import { buildEditForCreateIed } from '../scl'
import { getEditor } from '../utils'

export function createIed(ied: IedData): void {
	const editor = getEditor()
  
	const iedEdits = buildEditForCreateIed(ied.name, ied.description)
	editor.commit(iedEdits, {
		title: `Create IED "${ied.name}"`
	})
}
