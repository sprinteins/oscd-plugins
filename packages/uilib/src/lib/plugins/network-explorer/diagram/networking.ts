import type { Networking } from "@oscd-plugins/core"
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


export type CableIEDMap = {[cable: string]: IED[]}

export function createCableIEDMap(
	ieds: IED[],
): CableIEDMap {

	const calbeIEDMap: CableIEDMap = {}
	for(const ied of ieds){

		for(const networking of ied.networking){
			const cable = networking.cable
			if(!calbeIEDMap[cable]){ calbeIEDMap[cable] = [] }
			
			calbeIEDMap[cable].push(ied)
		}
	}
		

	return calbeIEDMap
}