import { MessageType } from '../scd-queries'
import type {
	InputExtRefElementWithDatSet,
	SCDQueries
} from '../scd-queries/scd-query'
// TYPES
import type { IEDElement } from '../scd-queries/types.scd-queries'

/**
 * The name is temporary, rename it if you have a better one
 * UC = Use Case
 */
export class UCCommunicationInformation {
	constructor(private readonly scdQueries: SCDQueries) {}

	public IEDCommInfos(): IEDCommInfo[] {
		const ieds = this.scdQueries.searchIEDs()
		const commInfos: IEDCommInfo[] = ieds.map((ied) => {
			return {
				iedName: ied.name,
				iedDetails: this.parseDetails(ied.element),
				// published: this.findPublishedMessages(ied),
				published: this.findPublishedMessages_V2(ied),
				received: this.findReceivedMessages(ied, ieds)
			}
		})
		return commInfos
	}

	private parseDetails(element: Element): string[] {

		let result = ["", "", ""]

		const parser = new DOMParser()
		const doc = parser.parseFromString(element.outerHTML, "text/xml")
		
		//for now, we are only looking for these specific strings when looking for logical nodes,
		//data objects and data attributes. maybe this can be expanded in the future
		result[0] = this.parseNodes(doc, ["LN", "LN0"])
		result[1] = this.parseNodes(doc, ["DO", "DOI"])
		result[2] = this.parseNodes(doc, ["DA", "FCDA"])
		
		return result
	}

	private parseNodes(doc: Document, nodeTypes: string[]): string {
		let result = ""

		for (var nodeType of nodeTypes) {
		
			const nodes = doc.getElementsByTagName(nodeType);
			for (var node of nodes) {
		
				result += node.localName + " ("
				for (var attribute of node.attributes) {
		
					result += attribute.name
					if (attribute.value) {
						result += "=" + attribute.value + " "
					}
				}
				result +=")<br>"
			}
		}
		return result
	}

	public IEDCommInfosByBay(): Map<string, IEDCommInfo[]> {
		const ieds = this.IEDCommInfos()

		const baysWithIEDs = new Map<string, IEDCommInfo[]>()
		ieds.forEach((ied) => {
			const bayNames = this.scdQueries.getBaysByIEDName(ied.iedName)

			bayNames.forEach((bayName) => {
				let setList: IEDCommInfo[] | undefined = []

				if (!baysWithIEDs.has(bayName)) baysWithIEDs.set(bayName, [])

				setList = baysWithIEDs.get(bayName)
				setList?.push(ied)
			})
		})

		return baysWithIEDs
	}

	public IEDCommInfosBySubnetworkBus(): Map<string, IEDCommInfo[]> {
		const ieds = this.IEDCommInfos()

		const busesWithIEDs = new Map<string, IEDCommInfo[]>()
		ieds.forEach((ied) => {
			const subnetworks = this.scdQueries.getSubnetworksByIEDName(
				ied.iedName
			)

			subnetworks.forEach((subnetwork) => {
				let setList: IEDCommInfo[] | undefined = []

				const subnetworkName = subnetwork.getAttribute('name')

				if (subnetworkName !== null) {
					if (!busesWithIEDs.has(subnetworkName))
						busesWithIEDs.set(subnetworkName, [])

					setList = busesWithIEDs.get(subnetworkName)
					setList?.push(ied)
				}
			})
		})

		return busesWithIEDs
	}

	private findPublishedMessages_V2(ied: IEDElement): PublishedMessage_V2[] {
		const messages: PublishedMessage_V2[] = []

		const reportControlInfos = this.findPublishedReportControls(ied)
		for (const info of reportControlInfos) {
			messages.push({
				id: info.rptID,
				name: info.name,
				targetIEDName: info.clientIEDName,
				serviceType: MessageType.MMS,
				serviceCbName: 'MMS',
				serviceDatSet: 'not implemented yet'
			})
		}

		return messages
	}

	/**
	 *
	 * Note: we currenlty not using the result of this function
	 * because GOOSE and Sampled Measure Values are always are inside an input
	 * at the receiving IED and we use that to create the connections
	 * This leads to that, that we ignore published messages that nobody receives
	 *
	 * The current version takes only GOOSE messages into consideration
	 * an therefore not compatible with Sampled Measured Values and MMS (ReportControls)
	 * So we deprecate this function and rewrite it in a more general way
	 *
	 * deprecated
	 * @param ied
	 * @returns
	 */
	// private findPublishedMessages(ied: IEDElement): PublishedMessage[] {
	// 	const published = []

	// 	const gseControls = this.scdQueries.searchGSEControls({ root: ied.element })

	// 	for (const gseControl of gseControls) {
	// 		const isGSEControlIrrelevant = gseControl.datSet === ""
	// 		if (isGSEControlIrrelevant) { continue}

	// 		const message: Partial<PublishedMessage> = {}
	// 		message.gseControlName = gseControl.name
	// 		message.dataSetName = gseControl.datSet
	// 		const ldevice = this.scdQueries.searchElementsLDParent(gseControl.element)
	// 		if (!ldevice) {
	// 			console.warn({ level: "warning", msg: "could not find GSE Control's parent LD, continuing", gseControl, ied: ied.name })
	// 			continue
	// 		}
	// 		message.LDeviceInst = ldevice.inst

	// 		// Note: need it later whe we display information about the message
	// 		// const dataSets = this.scdQueries.searchDataSetByName(gseControl.datSet, {root:ied.element})
	// 		const gse = this.scdQueries.searchGSE(ldevice.inst, gseControl.name)
	// 		if (!gse) {
	// 			console.warn({
	// 				level:          "warning",
	// 				msg:            "could not find GSE, continuing ",
	// 				ldInst:         ldevice.inst,
	// 				gseControlName: gseControl.name,
	// 				ied:            ied.name,
	// 			})
	// 			continue
	// 		}
	// 		const subNetwork = this.scdQueries.searchElementsParentSubnetwork(gse.element)
	// 		if (!subNetwork) {
	// 			console.warn({ level: "warnin", msg: "could not find GSE's parent SubNetwork, continuing", gse })
	// 			continue
	// 		}
	// 		message.subNetworkName = subNetwork.name

	// 		published.push(message as PublishedMessage)
	// 	}

	// 	return published
	// }

	private findReceivedMessages(
		ied: IEDElement,
		allIeds: IEDElement[]
	): ReceivedMessage[] {
		const inputs = this.scdQueries.searchInputs({ root: ied.element })
		const extRefs = inputs
			.map((input) =>
				this.scdQueries.searchExtRef({ root: input.element })
			)
			.flat()

		const extRefsWithConnectionID = extRefs.map((el) => {
			const srcCBName = el.srcCBName
			const iedName = el.iedName
			const parentIed = allIeds.find((i) => i.name === iedName)

			if (!parentIed) {
				const newInput: InputExtRefElementWithDatSet = {
					...el,
					datSet: null
				}
				return newInput
			}

			const connection = this.scdQueries.searchGSEControlByName(
				srcCBName,
				{ root: parentIed?.element }
			)
			const datSet = connection?.datSet

			const newInput: InputExtRefElementWithDatSet = {
				...el,
				datSet: datSet
			}
			return newInput
		})

		const messages =
			groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(
				extRefsWithConnectionID
			)

		return messages
	}

	private findPublishedReportControls(ied: IEDElement): ReportControlInfo[] {
		const controls: ReportControlInfo[] = []
		const reportControls = this.scdQueries.searchReportControls({
			root: ied.element
		})
		for (const reportControl of reportControls) {
			const clientLNs = this.scdQueries.searcClientLNs({
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
}

export type MessageSourceMap = { [iedName: string]: ReceivedMessage[] }

export type ReportControlInfo = {
	clientIEDName: string
	rptID: string
	name: string
}

export type IEDCommInfo = {
	iedName: string
	iedDetails: string[]
	published: PublishedMessage_V2[]
	received: ReceivedMessage[]
}

/**
 * @deprecated see `findPublishedMessages`
 */
export type PublishedMessage = {
	dataSetName: string
	gseControlName: string
	LDeviceInst: string
	subNetworkName: string
}

export type PublishedMessage_V2 = {
	id: string
	name: string
	targetIEDName: string
	serviceType: string
	serviceDatSet: string
	serviceCbName: string
}

export type ReceivedMessage = {
	iedName: string // to show
	serviceType: string // to filter
	srcCBName: string // to show
	datSet: string // to show
	data: InputExtRefElementWithDatSet[]
}

type TempKey = {
	iedName: string
	serviceType: string
	srcCBName: string
	datSet: string
}
export function groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(
	elements: InputExtRefElementWithDatSet[]
): ReceivedMessage[] {
	const indexed: {
		[key: string]: {
			elements: InputExtRefElementWithDatSet[]
			key: TempKey
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
			indexed[key] = { elements: [], key: tempKey }
		}

		indexed[key].elements.push(element)
	}

	const grouped: ReceivedMessage[] = []

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
