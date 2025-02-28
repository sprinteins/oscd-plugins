import type { AvailableFileType } from './types.js'

class UseCompasStore {
	private basePath = '/compas-scl-data-service'
	private readinessPath = `${this.basePath}/q/health/ready`
	private sclPath = `${this.basePath}/scl/v1`
	private sdsNamespaceUri =
		'https://www.lfenergy.org/compas/SclDataService/v1'
	//====== STATES ======//
	isUsingCompas = $derived(this.getReadiness())

	//====== PRIVATE METHODS ======//
	private async getReadiness() {
		return (await fetch(this.readinessPath)).ok
	}

	private parseResponseToXml(listResponse: string) {
		return new DOMParser().parseFromString(listResponse, 'application/xml')
	}

	private formatListResponse(xmlDocument: XMLDocument) {
		const items = xmlDocument.getElementsByTagNameNS(
			this.sdsNamespaceUri,
			'Item'
		)
		const files = Array.from(items).map((item) => {
			return Array.from(item.children).reduce(
				(acc, child) => {
					const key = child.tagName.split(':')[1].toLowerCase()
					acc[key] = child.textContent
					return acc
				},
				{} as Record<string, string | null>
			)
		})
		return files
	}

	private formatSclDataResponse(xmlDocument: XMLDocument) {
		const sclTextData = xmlDocument.getElementsByTagNameNS(
			this.sdsNamespaceUri,
			'SclData'
		)[0].firstChild
		if (sclTextData?.textContent) {
			return this.parseResponseToXml(sclTextData.textContent)
		}
	}

	//====== PUBLIC METHODS ======//
	async getFilesByType(type: AvailableFileType) {
		const response = await fetch(`${this.sclPath}/${type}/list`).catch(
			(error) => console.error(error)
		)
		if (response?.ok) {
			const text = await response.text()
			const xmlDocument = this.parseResponseToXml(text)
			return this.formatListResponse(xmlDocument)
		}
	}

	async getFileByTypeAndId(type: AvailableFileType, id: string) {
		const response = await fetch(`${this.sclPath}/${type}/${id}`).catch(
			(error) => console.error(error)
		)
		if (response?.ok) {
			const text = await response.text()
			const xmlDocument = this.parseResponseToXml(text)
			return this.formatSclDataResponse(xmlDocument)
		}
	}
}

export const compasStore = new UseCompasStore()
