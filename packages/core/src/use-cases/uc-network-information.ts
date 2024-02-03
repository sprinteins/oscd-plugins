import { SCDQueries } from "../scd"


export type IEDNetworkInfoV3 = {iedName: string, networkInfo: Networking}

export class UCNetworkInformation {
	constructor(
		private readonly scdQueries: SCDQueries,
	){}


	public gatherNetworkings(): Networking[] {
		const connectedAPs = this.scdQueries.searchConnectedAPs()

		const networkings: Networking[] = []

		for( const ap of connectedAPs ) {
			const address = this.extractAddressFromAP(ap.element)
			const physConnections = this.extractPhysConnectionsFromAP(ap.element)

			for( const conn of physConnections )	{
				const networking: Networking = {
					iedName:     ap.iedName,
					ipAddress:   address.ip,
					ipSubnet:    address.ipSubnet,
					ipGateway:   address.ipGateway,
					connectedAP: ap.apName,
					plug:        conn.plug,
					type:        conn.type,
					cable:       conn.cable,
					port: 		     conn.port,
				}
				networkings.push(networking)
			}
		}

		return networkings
	}


	private extractAddressFromAP(apElement: Element): Address {
				
		const ip = this.scdQueries.searchConnectedAPIP({root: apElement})?.element?.innerHTML ?? ""
		const ipSubnet = this.scdQueries.searchConnectedAPIPSubnet({root: apElement})?.element?.innerHTML ?? ""
		const ipGateway = this.scdQueries.searchConnectedAPIPGateway({root: apElement})?.element?.innerHTML ?? ""

		return {
			ip,       
			ipSubnet, 
			ipGateway,
		} satisfies Address
	}

	private extractPhysConnectionsFromAP(apElement: Element): PhysConnection[] {
		const connectionElements = this.scdQueries.seachConnectedPhysConnections({root: apElement})
		const physConnections = connectionElements.map(physConnection => {
			const cable = this.scdQueries.seachPhysConnectionCable({root: physConnection.element})?.element.innerHTML ?? ""
			const port = this.scdQueries.seachPhysConnectionPort({root: physConnection.element})?.element.innerHTML ?? ""
			const type = this.scdQueries.seachPhysConnectionType({root: physConnection.element})?.element.innerHTML ?? ""
			const plug = this.scdQueries.seachPhysConnectionPlug({root: physConnection.element})?.element.innerHTML ?? ""

			return {
				cable,
				port,
				type,
				plug,
			} satisfies PhysConnection
		})

		return physConnections
	}

}


export interface Address {
	ip: string
	ipSubnet: string
	ipGateway: string
}

export type Networking = {
	iedName:      string
	ipAddress:    string
	ipSubnet:     string
	ipGateway:    string
	connectedAP:  string
	plug:         string
	type:         string
	cable:        string
	port: 		  string
}

export type PhysConnection = {
	type:  string
	plug:  string
	port:  string
	cable: string
}
