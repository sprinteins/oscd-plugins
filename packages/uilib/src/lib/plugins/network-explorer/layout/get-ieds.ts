import type { IEDNetworkInfo, IEDNetworkInfoV3 } from "@oscd-plugins/core"
import { UCNetworkInformation, SCDQueries } from "@oscd-plugins/core"

export function extractIEDInfos(root: Element): IEDNetworkInfo[] {
	if (!root) {
		console.info({ level: "info", msg: "initInfos: no root" })
		return []
	}
	const scdQueries = new SCDQueries(root)
	const ucni = new UCNetworkInformation(scdQueries)
	const iedInfos = ucni.IEDNetworkInfo()
	
	return iedInfos
}

export function extractIEDInfosWithBay(root: Element): Map<string, IEDNetworkInfo[]> {
	if (!root) {
		console.info({ level: "info", msg: "initInfos: no root" })
		return new Map()
	}
	const scdQueries = new SCDQueries(root)
	const ucni = new UCNetworkInformation(scdQueries)
	const iedInfosByBay = ucni.IEDNetworkInfosByBay()

	return iedInfosByBay
}

export function extractIEDNetworkInfoV2(root?: Element): IEDNetworkInfoV3[] {
	if(!root){
		console.info({ level: "info", msg: "extractIEDNetworkInfoV2: no root" })
		return []
	}

	const scdQueries = new SCDQueries(root)
	const uc = new UCNetworkInformation(scdQueries)
	const info = uc.IEDNetworkInfoV3()

	return info
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


