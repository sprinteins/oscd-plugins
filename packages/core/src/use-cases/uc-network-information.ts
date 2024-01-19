import { ConnectedAPElement, ConnectedAPPhyConnectionElement, MessageType, SCDElement, SCDQueries } from "../scd"


export type IEDNetworkInfoV3 = {
	iedName: string,
	networkInfo: NetworkInfo,
	node: ConnectedAPElement
}

export class UCNetworkInformation {
	constructor(
		private readonly scdQueries: SCDQueries,
	){}

	public IEDNetworkInfoV3(): IEDNetworkInfoV3[] { 
		const connectedAPs = this.scdQueries.searchConnectedAPs()
		const info = connectedAPs.map( (cap) => {
			return {
				iedName:     cap.iedName,
				node:        cap,
				networkInfo: this.extractNetworkInfo(cap.element),
			}
		})
		return info
	}

	private extractNetworkInfo(apElement: Element): NetworkInfo {
		const address = this.extractAddressFromAP(apElement)
		const connections = this.extractPhysConnectionsFromAP(apElement)
		const vLanConnections = this.extractVLanConnectionsFromAP(apElement)

		return {
			...address,
			connections,
			vLanConnections,
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

	private extractVLanConnectionFromAddress(addressElements: SCDElement[], messageType: MessageType): VLanConnection[] {
		return addressElements.map(addressElement => {
			const vLanIdElement = this.scdQueries.searchAddressVLanId({ root: addressElement.element })
			const vLanId = vLanIdElement?.element.innerHTML ?? ""

			const macAddressElement = this.scdQueries.searchAddressMacAddress({ root: addressElement.element })
			const macAddress = macAddressElement?.element.innerHTML ?? ""

			return {
				vLanId,
				macAddress,
				messageType,
			}
		})
	}

	private extractVLanConnectionsFromAP(apElement: Element): VLanConnection[] {
		const vLanConnections: VLanConnection[] = []

		// TODO: Add MMS Message Type? What is the selector?
		const gooseAddresses = this.scdQueries.searchConnectedAPGooseAddresses({root: apElement})
		const gooseVLanConnections = this.extractVLanConnectionFromAddress(gooseAddresses, MessageType.GOOSE)

		const sampledValuesAddresses = this.scdQueries.searchConnectedAPSampledValuesAddresses({root: apElement})
		const sampledValuesVLanConnections = this.extractVLanConnectionFromAddress(sampledValuesAddresses, MessageType.SampledValues)

		vLanConnections.push(...gooseVLanConnections, ...sampledValuesVLanConnections)

		return vLanConnections
	}

	private extractPhysConnectionsFromAP(apElement: Element): PhysConnection[] {
		const connectionElements = this.scdQueries.seachConnectedPhysConnections({root: apElement})
		const physConnections = connectionElements.map(physConnection => {
			const cable = this.scdQueries.seachPhysConnectionCable({root: physConnection.element})?.element.innerHTML ?? ""
			const port = this.scdQueries.seachPhysConnectionPort({root: physConnection.element})?.element.innerHTML ?? ""

			return {
				cable,
				port,
				node: physConnection,
			} satisfies PhysConnection
		})

		return physConnections
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
	ip:          string
	ipSubnet:    string
	ipGateway:   string
	connections: PhysConnection[]
	vLanConnections: VLanConnection[]
}

export type Cable = string

export type PhysConnection = {
	cable: string;
	port: string;
	node: ConnectedAPPhyConnectionElement;
}

export type VLanConnection = {
	vLanId: string;
	macAddress: string;
	messageType: MessageType;
}

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
