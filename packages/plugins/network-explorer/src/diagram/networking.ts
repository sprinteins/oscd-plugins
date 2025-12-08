import type { Networking, SCDElement } from "@oscd-plugins/core"
import { UCNetworkInformation, SCDQueries } from "@oscd-plugins/core"

export type IED = {
	name: string
	networking: Networking[]
}
export type IEDNetworkingMap = {[iedName: string]: Networking[]}

export function extractIEDs(root?: Element): IED[] {
	if(!root){
		console.info({ level: "info", msg: "extractIEDNetworkingMap: no root" })
		return []
	}

	const scdQueries = new SCDQueries(root)
	const uc = new UCNetworkInformation(scdQueries)
	const networkingList = uc.gatherNetworkings()

	const ieds: IED[] = []
	for(const networking of networkingList){
		let wantedIED = ieds.find(ied => ied.name === networking.iedName)
		if(!wantedIED){
			wantedIED = {name: networking.iedName, networking: []}
			ieds.push(wantedIED)
		}
		wantedIED.networking.push(networking)
	}

	return ieds
	
}

export function extractIEDNetworkingMap(root?: Element): IEDNetworkingMap {
	if(!root){
		throw new Error("extractIEDNetworkingMap: no root")
	}

	const scdQueries = new SCDQueries(root)
	const uc = new UCNetworkInformation(scdQueries)
	const networkings = uc.gatherNetworkings()

	const networkingMap: IEDNetworkingMap = {}
	for(const networking of networkings){
		if(!networkingMap[networking.iedName]){
			networkingMap[networking.iedName] = []
		}
		networkingMap[networking.iedName].push(networking)
	}
	
	return networkingMap
}

export function extractPhysConnectionCable(root: Element, net: Networking): SCDElement {
	const cableElement = new UCNetworkInformation(new SCDQueries(root))
		.extractPhysConnectionCable(net._physConnectionElement)

	if (!cableElement) {
		throw new Error(`Element for cable ${net.cable} not found`)
	}

	return cableElement
}


export type BayIEDNameMap = {[bayName: string]: string[]}
export function findAllIEDBays(root: Element): BayIEDNameMap {
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


export type CableNetworkingMap = {[cable: string]: Networking[]}

export function createCableNetworkingMap(
	ieds: IED[],
): CableNetworkingMap {

	const cableNetworkingMap: CableNetworkingMap = {}
	for(const ied of ieds){

		for(const networking of ied.networking){
			const cable = networking.cable
			if(!cableNetworkingMap[cable]){ cableNetworkingMap[cable] = [] }
			
			cableNetworkingMap[cable].push(networking)
		}
	}
		

	return cableNetworkingMap
}
