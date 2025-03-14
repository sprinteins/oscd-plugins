import type { Compas } from './types.js'

class UseCompasStore {
	private basePath = '/compas-scl-data-service'
	private readinessPath = `${this.basePath}/q/health/ready`
	private sclPath = `${this.basePath}/scl/v1`
	private commonPath = `${this.basePath}/common/v1`
	private sdsNamespaceUri =
		'https://www.lfenergy.org/compas/SclDataService/v1'
	//====== STATES ======//
	isCompasEnabled = $derived(this.getReadiness())

	//====== PRIVATE METHODS ======//
	private async getReadiness() {
		return (await fetch(this.readinessPath)).ok
	}

	private parseResponseToXml(listResponse: string) {
		return new DOMParser().parseFromString(listResponse, 'application/xml')
	}

	private formatListResponse(
		xmlDocument: XMLDocument,
		tagname: 'Item' | 'Type'
	) {
		const items = xmlDocument.getElementsByTagNameNS(
			this.sdsNamespaceUri,
			tagname
		)
		const files = Array.from(items).map((item) => {
			return Array.from(item.children).reduce(
				(acc, child) => {
					const key = child.tagName.split(':')[1].toLowerCase()
					if (child.textContent) acc[key] = child.textContent
					return acc
				},
				{} as Record<string, string>
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

	async getFileTypes(): Promise<Compas.FileTypeResponse | undefined> {
		const response = await fetch(`${this.commonPath}/type/list`).catch(
			(error) => console.error(error)
		)
		if (response?.ok) {
			const text = await response.text()
			const xmlDocument = this.parseResponseToXml(text)
			return this.formatListResponse(
				xmlDocument,
				'Type'
			) as Compas.FileTypeResponse
		}
	}

	async getFilesByType(
		type: Compas.AvailableFileType
	): Promise<Compas.FileByTypeResponse | undefined> {
		const response = await fetch(`${this.sclPath}/${type}/list`).catch(
			(error) => console.error(error)
		)
		if (response?.ok) {
			const text = await response.text()
			const xmlDocument = this.parseResponseToXml(text)
			return this.formatListResponse(
				xmlDocument,
				'Item'
			) as Compas.FileByTypeResponse
		}
	}

	async getFileByTypeAndId(
		type: Compas.AvailableFileType,
		id: string
	): Promise<XMLDocument | undefined> {
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
