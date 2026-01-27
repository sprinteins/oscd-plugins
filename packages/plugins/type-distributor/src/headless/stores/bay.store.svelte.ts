import { getDocumentAndEditor, getBayElement } from '../distribution'

class UseBayStore {
	selectedBay: string | null = $state<string | null>(null)
	selectedBayUuid = $state<string | null>(null)
	assigendBayType: string | null = null // As soon as any lnode is assigned

	scdBay = $derived.by(() => {
		if (!this.selectedBay) {
			return null
		}
		try {
			const { doc } = getDocumentAndEditor()
			const bay = getBayElement(doc, this.selectedBay)
			return bay
		} catch (error) {
			return null
		}
	})
}

export const bayStore = new UseBayStore()
