import type { IEDNetworkInfoV3, SCDElement } from "@oscd-plugins/core"
import { UCNetworkInformation, SCDQueries } from "@oscd-plugins/core"


export function extractIEDNetworkInfoV2(root?: Element): IEDNetworkInfoV3[] {
	if(!root){
		console.info({ level: "info", msg: "extractIEDNetworkInfoV2: no root" })
		return []
	}

	const scdQueries = new SCDQueries(root)
	const uc = new UCNetworkInformation(scdQueries)
	const info = uc.IEDNetworkInfoV3()

	addConnectedIedToPhysConn(info)

	return info
}

export function extractPhysConnectionCable(physConnElement: Element): SCDElement | null {
	const scdQueries = new SCDQueries(physConnElement)
	const cableElement = scdQueries.seachPhysConnectionCable()
	return cableElement
}

export type IEDBayMap = {[bayName: string]: string[]}
export function findAllIEDBays(root: Element): IEDBayMap {
	const scdQueries = new SCDQueries(root)
	const bayElements = scdQueries.searchBays()
	const iedMapByBay: {[bayName: string]: string[]} = {}
	
	// init
	for(const bayElement of bayElements){
		iedMapByBay[bayElement.name] = []
	}

	// gather
	for(const bayElement of bayElements){
		const lnodes = scdQueries.searchLNodes({root: bayElement.element})
		for(const lnode of lnodes){
			iedMapByBay[bayElement.name].push(lnode.iedName)
		}
	}

	// Dedupe
	for(const bay in iedMapByBay){
		iedMapByBay[bay] = [...new Set(iedMapByBay[bay])]
	}
	return iedMapByBay
}

function addConnectedIedToPhysConn(iedNetworkInfo: IEDNetworkInfoV3[]): void {
	for (const ied of iedNetworkInfo) {
		const connections = ied.networkInfo.connections

		for (const connection of connections) {
			const cable = connection.cable
			const connectedNodes = iedNetworkInfo.filter(
				ni => ni.iedName !== ied.iedName &&
				ni.networkInfo.connections.map(c => c.cable).includes(cable),
			)

			if (connectedNodes.length > 1) {
				console.warn(`Found ${connectedNodes.length} connected nodes for cable ${cable}. Connected nodes will be ignored.`)
				continue
			}

			if (connectedNodes.length === 1) {
				const iedName = connectedNodes[0].iedName

				connection.connectedIed = iedName
			}
		}
	}
}
