import { IEDQueries } from './queries.ied'
// CONSTANTS
import { MESSAGE_TYPE } from '@/constants/message.contant'
// TYPES
import type {
	CommonOptions,
	PrivateElement,
	IEDElement,
	ReportControlElement
} from '../types.scd-queries'
import type { IED } from './types.ied'

export class IEDService {
	private iedQueries: IEDQueries

	constructor(private readonly root: Element) {
		this.iedQueries = new IEDQueries(this.root)
	}

	//====== PUBLIC METHODS

	public IEDCommunicationInfos(): IED.CommunicationInfo[] {
		const ieds = this.iedQueries.searchIEDs()
		const communicationInfos: IED.CommunicationInfo[] = ieds.map((ied) => {
			return {
				iedName: ied.name,
				iedDetails: this.parseDetails(ied.element),
				// published: this.findPublishedMessages(ied),
				published: this.findPublishedMessages(ied),
				received: this.findReceivedMessages(ied, ieds)
			}
		})
		return communicationInfos
	}

	public IEDCommunicationInfosByBay(): Map<string, IED.CommunicationInfo[]> {
		const selector = 'SCL > Substation > VoltageLevel > Bay > LNode'
		return this.IEDCommunicationInfosByAncestor({
			ancestor: 'Bay',
			selector
		})
	}

	public IEDCommunicationInfosBySubNetworkBus(): Map<
		string,
		IED.CommunicationInfo[]
	> {
		const selector = 'SCL > Communication > SubNetwork > ConnectedAP'
		return this.IEDCommunicationInfosByAncestor({
			ancestor: 'SubNetwork',
			selector
		})
	}

	//====== PRIVATE METHODS

	private parseDetails(element: Element): IED.Details {
		const parser = new DOMParser()
		const doc = parser.parseFromString(element.outerHTML, 'text/xml')

		//for now, we are only looking for these specific strings when looking for logical nodes,
		//data objects and data attributes. maybe this can be expanded in the future
		return {
			logicalNodes: this.parseNodes(doc, ['LN', 'LN0']),
			dataObjects: this.parseNodes(doc, ['DO', 'DOI']),
			dataAttributes: this.parseNodes(doc, ['DA', 'FCDA'])
		}
	}

	private parseNodes(doc: Document, nodeTypes: string[]): string[] {
		const details: string[] = []

		for (const nodeType of nodeTypes) {
			const elements = doc.getElementsByTagName(nodeType)
			this.parseElements(elements, details)
		}
		return details
	}

	private parseElements(
		elements: HTMLCollectionOf<Element>,
		details: string[]
	) {
		for (const element of Array.from(elements)) {
			details.push(this.parseAttributes(element))
		}
	}

	private parseAttributes(element: Element): string {
		let detail = `${element.localName} (`

		for (const attribute of Array.from(element.attributes)) {
			detail += attribute.name
			if (attribute.value) {
				detail += `=${attribute.value} `
			}
		}
		return `${detail})`
	}

	private findPublishedMessages(ied: IEDElement): IED.PublishedMessage[] {
		const messages: IED.PublishedMessage[] = []

		const reportControlInfos = this.findPublishedReportControls(ied)
		for (const info of reportControlInfos) {
			messages.push({
				id: info.rptID,
				name: info.name,
				targetIEDName: info.clientIEDName,
				serviceType: MESSAGE_TYPE.MMS,
				serviceCbName: 'MMS',
				serviceDatSet: 'not implemented yet'
			})
		}

		return messages
	}

	private findReceivedMessages(
		ied: IEDElement,
		allIeds: IEDElement[]
	): IED.ReceivedMessage[] {
		const inputs = this.iedQueries.searchInputs({ root: ied.element })
		const extRefs = inputs.flatMap((input) =>
			this.iedQueries.searchExtRef({ root: input.element })
		)

		const extRefsWithConnectionID = extRefs.map((el) => {
			const srcCBName = el.srcCBName
			const iedName = el.iedName
			const parentIed = allIeds.find((i) => i.name === iedName)

			if (!parentIed) {
				const newInput: IED.ExtRefElementWithDatSet = {
					...el,
					datSet: null
				}
				return newInput
			}

			const connection = this.iedQueries.searchGSEControlByName(
				srcCBName,
				{ root: parentIed?.element }
			)
			const datSet = connection?.datSet

			const newInput: IED.ExtRefElementWithDatSet = {
				...el,
				datSet: datSet
			}
			return newInput
		})

		const messages =
			this.groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(
				extRefsWithConnectionID
			)

		return messages
	}

	private findPublishedReportControls(
		ied: IEDElement
	): IED.ReportControlInfo[] {
		const controls: IED.ReportControlInfo[] = []
		const reportControls = this.iedQueries.searchReportControls({
			root: ied.element
		})
		for (const reportControl of reportControls) {
			const clientLNs = this.iedQueries.searchClientLNs({
				root: reportControl.element
			})

			for (const clientLN of clientLNs) {
				controls.push({
					clientIEDName: clientLN.iedName,
					rptID: reportControl.rptID,
					name: reportControl.name
				})
			}
		}

		return controls
	}

	private groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(
		elements: IED.ExtRefElementWithDatSet[]
	): IED.ReceivedMessage[] {
		const indexed: {
			[key: string]: {
				elements: IED.ExtRefElementWithDatSet[]
				key: {
					iedName: string
					serviceType: string
					srcCBName: string
					datSet: string | null
				}
			}
		} = {}
		for (const element of elements) {
			if (element.iedName === '') {
				continue
			}

			const key = `${element.iedName}_${element.serviceType}_${element.srcCBName}_${element.datSet}`
			const tempKey = {
				iedName: element.iedName,
				serviceType: element.serviceType,
				srcCBName: element.srcCBName,
				datSet: element.datSet
			}

			if (!indexed[key]) {
				indexed[key] = {
					elements: [],
					key: tempKey
				}
			}

			indexed[key].elements.push(element)
		}

		const grouped: IED.ReceivedMessage[] = []

		for (const obj of Object.values(indexed)) {
			const { iedName, serviceType, srcCBName, datSet } = obj.key

			grouped.push({
				iedName,
				serviceType,
				srcCBName,
				datSet,
				data: obj.elements
			})
		}

		return grouped
	}

	public IEDCommunicationInfosByAncestor({
		ancestor,
		selector
	}: { ancestor: string; selector: string }): Map<
		string,
		IED.CommunicationInfo[]
	> {
		const ieds = this.IEDCommunicationInfos()

		const iedsCommunicationInfoByElement = new Map<
			string,
			IED.CommunicationInfo[]
		>()

		for (const ied of ieds) {
			const names =
				this.iedQueries.retrieveAncestorsNameBySelectorWithAttribute({
					ancestor,
					selector,
					attribute: `iedName='${ied.iedName}'`
				})

			for (const name of names) {
				let setList: IED.CommunicationInfo[] | undefined = []

				if (!iedsCommunicationInfoByElement.has(name))
					iedsCommunicationInfoByElement.set(name, [])

				setList = iedsCommunicationInfoByElement.get(name)
				setList?.push(ied)
			}
		}

		return iedsCommunicationInfoByElement
	}
}
