import type { SCDQueries } from "../scd"

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

export type IEDNetworkInfoV2 = {[iedName: string]: IPInfo}
export type IEDNetworkInfoV3 = {iedName: string, networkInfo: NetworkInfo}

export class UCNetworkInformation {
	constructor(
		private readonly scdQueries: SCDQueries,
	){}

	private ipAttributes = {
		ip:        "IP",
		ipSubnet:  "IP-SUBNET",
		ipGateway: "IP-GATEWAY",
	}

	public IEDNetworkInfo(): IEDNetworkInfo[] {

		const ieds = this.scdQueries.searchIEDs()
		const networkInfo: IEDNetworkInfo[] = ieds.map(ied => {
			const connectedAPs = this.scdQueries.getConnectedAPByIEDName(ied.name)

			const subneworkConnections: SubnetworkConnection[] = []
			for (const connectedAP of connectedAPs) {
				if(connectedAP === null){ continue }

				const subnetwork = connectedAP.closest("SubNetwork")
				const subnetworkName = subnetwork?.getAttribute("name")

				const ipInfo = this.IPInfoFromAP(connectedAP)
	
				if (subnetwork != null && subnetworkName != null) {
					subneworkConnections.push({
						subnetwork: subnetworkName,
						ip:         ipInfo?.ip ?? "",
						ipSubnet:   ipInfo?.ipSubnet ?? "",
						ipGateway:  ipInfo?.ipGateway ?? "",
						cables: 	   [],
					})
				}

			}

			return {
				iedName: ied.name,
				subneworkConnections,
			}
		})
		return networkInfo
	}

	public IEDNetworkInfosByBay(): Map<string, IEDNetworkInfo[]> {
		const ieds = this.IEDNetworkInfo()

		const baysWithIEDs = new Map<string, IEDNetworkInfo[]>()
		ieds.forEach((ied) => {
			const bayNames = this.scdQueries.getBaysByIEDName(ied.iedName)
			
			bayNames.forEach((bayName) => {
				let setList: IEDNetworkInfo[] | undefined = []

				if (!baysWithIEDs.has(bayName)) 
					baysWithIEDs.set(bayName, [])

				setList = baysWithIEDs.get(bayName)
				setList?.push(ied)
			})
		})

		return baysWithIEDs
	}

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

	private IPInfoFromAP(apElement: Element): IPInfo | null {
		const ipInfo: IPInfo = {
			ip:        "",
			ipSubnet:  "",
			ipGateway: "",
			cables:    [],
		}

		
		// 
		// ADDRESS
		// 
		// TODO: why not find the P with the type attribute?
		// like: const ip = address.querySelector("P[type=IP]")?.innerHTML
		const addressQuery = "Address"
		const address = apElement.querySelector(addressQuery)

		if (!address) {
			return null
		}
		const addressEntries = address.querySelectorAll("P")
		for (const addressEntry of addressEntries) {
			const type = addressEntry.getAttribute("type")

			if (!type) {
				continue
			}

			if (type === this.ipAttributes.ip) {
				const ip = addressEntry.innerHTML
				ipInfo.ip = ip
			} else if (type === this.ipAttributes.ipGateway) {
				const ip = addressEntry.innerHTML
				ipInfo.ipGateway = ip
			} else if (type === this.ipAttributes.ipSubnet) {
				const ip = addressEntry.innerHTML
				ipInfo.ipSubnet = ip
			}
		}

		// 
		// PhysConn
		// 
		const cableSelector = "PhysConn[type='Connection'] P[type='Cable']"
		const cableElements = Array.from(apElement.querySelectorAll(cableSelector))
		const cables = cableElements.map(cable => cable.innerHTML)
		ipInfo.cables = cables

		
		return ipInfo
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


type Address = {
	ip: string
	ipSubnet: string
	ipGateway: string
}
