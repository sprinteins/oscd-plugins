import type { SCDQueries } from "../scd"


export type IEDNetworkInfoV3 = {iedName: string, networkInfo: NetworkInfo}

export class UCNetworkInformation {
	constructor(
		private readonly scdQueries: SCDQueries,
	){}

	public IEDNetworkInfoV3(): IEDNetworkInfoV3[] { 
		const connectedAPs = this.scdQueries.searchConnectedAPs()
		const info = connectedAPs.map( (cap) => {
			return {
				iedName:     cap.iedName,
				networkInfo: this.extractNetworkInfo(cap.element),
			}
		})
		return info
	}

	private extractNetworkInfo(apElement: Element): NetworkInfo {
		
		const address = this.extractAddressFromAP(apElement)
		const cables = this.extractCablesFromAP(apElement)

		return {
			...address,
			cables,
		}
	}

	private extractAddressFromAP(apElement: Element): Address {
				
		const ip = this.scdQueries.searchConnectedAPIP({root: apElement})?.element?.innerHTML
		const ipSubnet = this.scdQueries.searchConnectedAPIPSubnet({root: apElement})?.element?.innerHTML
		const ipGateway = this.scdQueries.searchConnectedAPIPGateway({root: apElement})?.element?.innerHTML

		return {
			ip:        ip        ?? "",
			ipSubnet:  ipSubnet  ?? "",
			ipGateway: ipGateway ?? "",
		} satisfies Address
	}

	private extractCablesFromAP(apElement: Element): Cable[] {
		const cableElements = this.scdQueries.searchConnectedAPCables({root: apElement})
		const cables = cableElements.map(cable => cable.element.innerHTML)
		return cables
	}

}


export interface IPInfo {
	ip: string
	ipSubnet: string
	ipGateway: string
	cables: Cable[]
}

export interface NetworkInfo {
	ip:         string
	ipSubnet:   string
	ipGateway:  string
	cables:     Cable[]
}

export type Cable = string

export interface SubnetworkConnection extends IPInfo {
	subnetwork: string
}

export type IEDNetworkInfo = {
	iedName: string
	subneworkConnections: SubnetworkConnection[]
}

type Address = {
	ip: string
	ipSubnet: string
	ipGateway: string
}
