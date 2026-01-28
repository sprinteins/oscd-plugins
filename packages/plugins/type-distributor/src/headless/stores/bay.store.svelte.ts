import { getDocumentAndEditor } from '@/headless/utils'

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

function getBayElement(doc: Document, bayName: string): Element {
	const bayElement = doc.querySelector(`Bay[name="${bayName}"]`)
	if (!bayElement) {
		throw new Error(`Bay with name ${bayName} not found`)
	}
	return bayElement
}