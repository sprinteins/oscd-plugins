import { SCDElement, SCDQueries } from "../scd-queries"


export type IEDNetworkInfoV3 = {iedName: string, networkInfo: Networking}

// export type IEDNetworkInfoV3 = {
// 	iedName: string,
// 	networkInfo: NetworkInfo,
// 	node: ConnectedAPElement
// }

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
					iedName:                ap.iedName,
					ipAddress:              address.ip,
					ipSubnet:               address.ipSubnet,
					ipGateway:              address.ipGateway,
					connectedAP:            ap.apName,
					plug:                   conn.plug,
					type:                   conn.type,
					cable:                  conn.cable,
					port:                   conn.port,
					connectedNetworking:    undefined,
					_physConnectionElement: conn.element,
				}
				networkings.push(networking)
			}
			// const info = connectedAPs.map( (cap) => {
			// 	return {
			// 		iedName:     cap.iedName,
			// 		node:        cap,
			// 		networkInfo: this.extractNetworkInfo(cap.element),
			// 	}
		}
			
			
		// networkings.forEach( (networking) => addConnectedIedToPhysConn(networking, networkings) ) 
		this.enrichNetworkingWithConnectedIEDs(networkings)
			
			
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
				element: physConnection.element,
				// node:         physConnection,
				// connectedIed: undefined,
			} satisfies PhysConnection
		})
			
		return physConnections
	}
		
	public extractPhysConnectionCable(physConnElement: Element): SCDElement | null {
		const cableElement = this.scdQueries.seachPhysConnectionCable({root: physConnElement})
		return cableElement
	}
		
	// private addConnectedIedToPhysConn(iedNetworkInfo: IEDNetworkInfoV3[]): void {
	private enrichNetworkingWithConnectedIEDs(networkings:Networking[]): void {
		for (const networking of networkings) {
				
			const connectedNetworking = this.findConnectedNetworkingByCableName(networking, networkings)
				
			if (connectedNetworking.length !== 1) {
				console.log({"level": "debug", msg: "could not match networking exaclty, so no cable will be shown", ied: networking.iedName })
				networking.connectedNetworking = null
				continue
			}
				
			networking.connectedNetworking = connectedNetworking[0]
		}
	}
		
	private findConnectedNetworkingByCableName(srcNetworking: Networking, networkings: Networking[]): Networking[] {
		const connectedNetworking = networkings.filter( otherNetworking => {
			const isSameNetworking = srcNetworking === otherNetworking
			const hasSameCableName = srcNetworking.cable === otherNetworking.cable
				
			return !isSameNetworking && hasSameCableName
		})
			
		return connectedNetworking
	}
		
	// private findConnectedIEDs(ied: IED): IED[] {
		
	// 	const connectedIEDs = this.ieds.filter( otherIED => {
	// 		if(ied === otherIED){ return false }
		
	// 		const connected = ied.networking.some(iedNetworking => {
	// 			return otherIED.networking.some(otherIEDNetworking => {
	// 				return iedNetworking.cable === otherIEDNetworking.cable
	// 			})
	// 		})
		
	// 		return connected
	// 	})
		
	// 	return connectedIEDs
	// }
		
		
		
}
	
	
export interface Address {
		ip: string
		ipSubnet: string
		ipGateway: string
	}
	
export type Networking = {
		iedName:      	        string
		ipAddress:    	        string
		ipSubnet:     	        string
		ipGateway:    	        string
		connectedAP:  	        string
		plug:         	        string
		type:         	        string
		cable:        	        string
		port: 		  	        string
		connectedNetworking?:   Networking | null
		_physConnectionElement: Element // only use this if you know what you are doing
	}
	
export type PhysConnection = SCDElement & {
		
		type:  string
		plug:  string
		port:  string
		cable: string
		// connectedIed?: string;
		// node: ConnectedAPPhyConnectionElement;
	}
	
// export type VLanConnection = {
// 	vLanId: string;
// 	macAddress: string;
// 	messageType: MessageType;
// }
	
// export interface SubnetworkConnection extends IPInfo {
// 	subnetwork: string
// }
	
// export type IEDNetworkInfo = {
// 	iedName: string
// 	subneworkConnections: SubnetworkConnection[]
// }
	
// type Address = {
// 	ip: string
// 	ipSubnet: string
// 	ipGateway: string
// }
	