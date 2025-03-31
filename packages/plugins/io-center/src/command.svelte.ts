import { createAndDispatchEditEvent } from "@oscd-plugins/core-api/plugin/v1"
import { store } from "./store.svelte"
import type { Nullable } from "./types"
import type { LpElement, LpTypes } from "./ui/components/right-bar/lp-list/types.lp-list"
import { createElement } from "./headless/stores/document-helpers.svelte"
import type { Connection, LcTypes, LogicalConditioner, NodeElement } from "./ui/components/canvas/types.canvas"
import { L_NODE_TYPE_CONTENT, NODE_ELEMENT_TYPE } from "./headless/constants"
import { isDoToLcConnectionAllowed } from "./headless/utils"

export class Command {
	constructor(
		private getHost: HostGetter,
	) { }

	public addLP(type: LpTypes, name: string, desc: string, number?: number, numberOfLPDOPorts?: number) {
		if (!store.doc) { return }

		const sclRoot = store.doc.querySelector("SCL");

		if (!sclRoot) { return }

		const host = this.requireHost()

		const ied = store.doc.querySelector(`IED[name="${store.selectedIED?.name}"]`)

		if (!ied) {
			throw new Error(`IED with name ${store.selectedIED} not found`)
		}

		const ld0 = this.ensureLD0(ied)

		this.ensureLNodeType(type)

		const currentLPNumber = ld0.querySelectorAll(`LN[lnClass="${type}"]`).length

		if (!number) {
			const attributes = {
				"xmlns": "",
				"desc": desc || null,
				"lnClass": type,
				"inst": `${currentLPNumber + 1}`,
				"lnType": name || type,
				"numberOfLPDOPorts": `${numberOfLPDOPorts}` || "",
			}

			createElement({ host, doc: store.doc, tagName: "LN", attributes, parent: ld0, reference: null })

			return
		}

		for (let i = 1; i <= number; i++) {
			const attributes = {
				"xmlns": "",
				"desc": desc || null,
				"lnClass": type,
				"inst": `${currentLPNumber + i}`,
				"lnType": name || type,
				"numberOfLPDOPorts": `${numberOfLPDOPorts}` || "",
			}

			createElement({ host, doc: store.doc, tagName: "LN", attributes, parent: ld0, reference: null })
		}
	}

	public editLP(lpElement: LpElement, name: string, desc: string) {
		const host = this.requireHost()

		const ied = this.requireSelectedIED()

		const lpToEdit = ied.querySelector(`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnType="${lpElement.name}"][inst="${lpElement.instance}"][lnClass="${lpElement.type}"]`)

		if (!lpToEdit) {
			throw new Error(`LP element with name ${lpElement.name}-${lpElement.instance} not found!`)
		}

		createAndDispatchEditEvent({
			host,
			edit: {
				element: lpToEdit,
				attributes: { "lnType": `${name || lpToEdit.getAttribute("lnType")}`, "desc": `${desc || lpToEdit.getAttribute("desc")}` },
				attributesNS: {}
			}
		})
	}

	public removeLP(lpElement: LpElement) {
		const host = this.requireHost()

		const ied = this.requireSelectedIED()

		//Delete target LP
		const lpToDelete = ied.querySelector(`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnType="${lpElement.name}"][inst="${lpElement.instance}"][lnClass="${lpElement.type}"]`)

		if (!lpToDelete) {
			throw new Error(`LP element with name ${lpElement.name}-${lpElement.instance} not found!`)
		}

		createAndDispatchEditEvent({
			host,
			edit: {
				node: lpToDelete
			}
		})

		//Correct instance attribute for any LP that's after the target
		const remainingLPs = Array.from(ied.querySelectorAll(`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lpElement.type}"]`))

		const deletedLpInstance = Number.parseInt(lpElement.instance)

		for (const lp of remainingLPs.slice(deletedLpInstance - 1)) {
			createAndDispatchEditEvent({
				host,
				edit: {
					element: lp,
					attributes: { "inst": `${Number.parseInt(lp.getAttribute("inst") || "") - 1}` },
					attributesNS: {}
				}
			})
		}
	}

	public addLC(type: LcTypes, number?: number, numberOfLCIVPorts?: number) {
		if (!store.doc) { console.warn("no doc"); return; }

		const host = this.requireHost()

		const ied = this.requireSelectedIED()

		const ld0 = this.ensureLD0(ied)

		this.ensureLNodeType(type)

		const currentLCNumber = ld0.querySelectorAll(`LN[lnClass="${type}"]`).length

		if (!number) {
			const attributes = {
				"xmlns": "",
				"lnClass": type,
				"inst": `${currentLCNumber + 1}`,
				"lnType": type,
				"numberOfLCIVPorts": `${numberOfLCIVPorts}` || "",
			}

			createElement({ host, doc: store.doc, tagName: "LN", attributes, parent: ld0, reference: null })

			return
		}

		for (let i = 1; i <= number; i++) {
			const attributes = {
				"xmlns": "",
				"lnClass": type,
				"inst": `${currentLCNumber + i}`,
				"lnType": type,
				"numberOfLCIVPorts": `${numberOfLCIVPorts}` || "",
			}

			createElement({ host, doc: store.doc, tagName: "LN", attributes, parent: ld0, reference: null })
		}
	}

	public editLC(lc: LogicalConditioner, newType: LcTypes, numberOfLCIVPorts?: number) {
		this.removeLC(lc)
		if (numberOfLCIVPorts) {
			this.addLC(newType, 1, numberOfLCIVPorts)
			return
		}
		this.addLC(newType)
	}

	public removeLC(lc: LogicalConditioner) {
		const host = this.requireHost()

		const ied = this.requireSelectedIED()

		const lcToDelete = ied.querySelector(`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnType="${lc.type}"][inst="${lc.instance}"][lnClass="${lc.type}"]`)

		if (!lcToDelete) {
			throw new Error(`LP element with name ${lc.type}-${lc.instance} not found!`)
		}

		createAndDispatchEditEvent({
			host,
			edit: {
				node: lcToDelete
			}
		})

		//Decrease instance attribute by 1 for any LP that's after the target
		const remainingLCs = Array.from(ied.querySelectorAll(`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lc.type}"]`))

		const deletedLcInstance = Number.parseInt(lc.instance)

		for (const lc of remainingLCs.slice(deletedLcInstance - 1)) {
			createAndDispatchEditEvent({
				host,
				edit: {
					element: lc,
					attributes: { "inst": `${Number.parseInt(lc.getAttribute("inst") || "") - 1}` },
					attributesNS: {}
				}
			})
		}
	}

	private ensureLNodeType(type: LcTypes | LpTypes) {
		if (!store.doc) { throw new Error('Doc not found!') }

		const host = this.requireHost()

		if (this.hasLNodeType(type)) {
			return
		}

		const dataTypeTemplates = this.ensureDataTypeTemplates()

		const attributes = {
			"id": `IOCenter.${type}`,
			"lnClass": type,
		}

		createElement({ host, doc: store.doc, tagName: "LNodeType", attributes, parent: dataTypeTemplates, reference: null, innerHTML: L_NODE_TYPE_CONTENT[type] })
	}

	public hasLNodeType(type: LcTypes | LpTypes): boolean {
		if (!store.doc) { throw new Error('Doc not found!') }

		const lnType = store.doc.querySelector(`DataTypeTemplates > LNodeType[lnClass="${type}"]`)

		return Boolean(lnType)
	}

	public addConnection(connection: Connection) {
		if (!store.doc) { throw new Error('Doc not found!') }

		const host = this.requireHost()

		const ied = this.requireSelectedIED()

		const ld0 = this.ensureLD0(ied)

		let connectionType: Nullable<"input" | "output"> = null;

		if (connection.from.type === NODE_ELEMENT_TYPE.DO || connection.to.type === NODE_ELEMENT_TYPE.DO) {
			connectionType = "output"
		}

		if (connection.from.type === NODE_ELEMENT_TYPE.LP || connection.to.type === NODE_ELEMENT_TYPE.LP) {
			connectionType = "input"
		}

		if (!connectionType) {
			throw new Error('Could not figure out connection type!')
		}

		let doName: string | null = null

		if (connection.from.type === NODE_ELEMENT_TYPE.DO) {
			doName = connection.from.name.replace(/-left|-right/g, '')
		}

		if (connection.to.type === NODE_ELEMENT_TYPE.DO) {
			doName = connection.to.name.replace(/-left|-right/g, '')
		}

		let lcLnClass: string | null = null
		let lcInst: string | null = null

		if (connection.from.type === NODE_ELEMENT_TYPE.LC) {
			[lcLnClass, lcInst] = connection.from.name.replace(/-left|-right/g, '').split('-')
		}

		if (connection.to.type === NODE_ELEMENT_TYPE.LC) {
			[lcLnClass, lcInst] = connection.to.name.replace(/-left|-right/g, '').split('-')
		}

		let lpLnClass: string | null = null
		let lpInst: string | null = null

		if (connection.from.type === NODE_ELEMENT_TYPE.LP) {
			[lpLnClass, lpInst] = connection.from.name.replace(/-left|-right/g, '').split('-')
		}

		if (connection.to.type === NODE_ELEMENT_TYPE.LP) {
			[lpLnClass, lpInst] = connection.to.name.replace(/-left|-right/g, '').split('-')
		}

		const connectorLC = ld0.querySelector(`LN[lnClass="${lcLnClass}"][inst="${lcInst}"]`)

		if (!connectorLC) {
			throw new Error('Connector LC LN not found!')
		}

		const localLC = store.findLC(lcLnClass || "", lcInst || "")

		if (!localLC) {
			throw new Error(`LC with lnClass ${lcLnClass} and inst ${lcInst} not found!`)
		}

		const connectedDO = store.selectedDataObject

		if (!connectedDO) {
			throw new Error(`DO with name ${doName} not found!`)
		}

		if (!isDoToLcConnectionAllowed(connectedDO, localLC)) {
			return
		}

		const doiName = connection.from.type === NODE_ELEMENT_TYPE.LC
			? `${connection.from.port.name}${connection.from.port.index ?? ""}`
			: `${connection.to.port.name}${connection.to.port.index ?? ""}`

		createElement({
			host,
			doc: store.doc,
			tagName: "DOI",
			attributes: {
				"name": doiName,
				"desc": connectionType
			},
			parent: connectorLC,
			reference: null
		})

		const doi = connectorLC.querySelector(`DOI[name="${doiName}"][desc="${connectionType}"]`)

		if (!doi) {
			throw new Error(`DOI[name="${doiName}",desc="${connectionType}"] not created!`)
		}

		if (connectionType === "input") {
			createElement({
				host,
				doc: store.doc,
				tagName: "LNRef",
				attributes: {
					"refLDInst": "LD0",
					"refLNClass": lpLnClass,
					"refLNInst": lpInst,
					"refDO": connection.from.type === NODE_ELEMENT_TYPE.LP
						? `${connection.from.port.name}${connection.from.port.index ?? ""}`
						: `${connection.to.port.name}${connection.to.port.index ?? ""}`
				},
				parent: doi,
				reference: null
			})
		}

		if (connectionType === "output") {
			createElement({
				host,
				doc: store.doc,
				tagName: "LNRef",
				attributes: {
					"refLDInst": connectedDO.objectPath.lDevice?.inst || "unknown",
					"refLNClass": connectedDO.objectPath.ln?.lnClass || "unknown",
					"refLNInst": connectedDO.objectPath.ln?.inst || "unknown",
					"refDO": doName,
				},
				parent: doi,
				reference: null
			})
		}
	}

	public removeConnection(connection: Connection) {
		if (!store.doc) { throw new Error('Doc not found!') }

		const host = this.requireHost()

		const storedConnection = store.connections.find((c) => c === connection);

		if (!storedConnection) {
			console.warn(`Connection (id: ${connection.id}) not found!`)
			return
		}

		//DO to LC connection
		if (storedConnection.from.type === NODE_ELEMENT_TYPE.DO) {
			const [lcLnClass, lcInst] = connection.to.name.replace(/-left|-right/g, '').split("-")

			const parentDOI = store.doc.querySelector(`LN[lnClass="${lcLnClass}"][inst="${lcInst}"] > DOI[name="${storedConnection.to.port.name}"][desc="output"]`)

			if (!parentDOI) {
				console.warn(`Parent DOI for connection (id: ${connection.id}) not found in doc!`)
				return
			}

			const connectionElement = parentDOI.querySelector(`LNRef[refDO="${storedConnection.from.port.name}"]`)

			if (!connectionElement) {
				console.warn(`connection (id: ${connection.id}) not found in doc!`)
				return
			}

			//Delete the LNRef (connection)
			createAndDispatchEditEvent({
				host,
				edit: {
					node: connectionElement
				}
			})

			const remainingLNRefNumber = Array.from(parentDOI.querySelectorAll("LNRef")).length

			if (remainingLNRefNumber === 0) {
				//Delete parent DOI if no LNRef (connection) within it
				createAndDispatchEditEvent({
					host,
					edit: {
						node: parentDOI
					}
				})
			}
		}

		//LC to LP connection
		if (storedConnection.from.type === NODE_ELEMENT_TYPE.LC) {
			const [lcLnClass, lcInst] = connection.from.name.replace(/-left|-right/g, '').split("-")

			const parentDOI = store.doc.querySelector(`LN[lnClass="${lcLnClass}"][inst="${lcInst}"] > DOI[name="${storedConnection.from.port.name}"][desc="input"]`)

			if (!parentDOI) {
				console.warn(`Parent DOI for connection (id: ${connection.id}) not found in doc!`)
				return
			}

			const connectionElement = parentDOI.querySelector(`LNRef[refDO="${storedConnection.to.port.name}"]`)

			if (!connectionElement) {
				console.warn(`connection (id: ${connection.id}) not found in doc!`)
				return
			}

			//Delete the LNRef (connection)
			createAndDispatchEditEvent({
				host,
				edit: {
					node: connectionElement
				}
			})

			const remainingLNRefNumber = Array.from(parentDOI.querySelectorAll("LNRef")).length

			if (remainingLNRefNumber === 0) {
				//Delete parent DOI if no LNRef (connection) within it
				createAndDispatchEditEvent({
					host,
					edit: {
						node: parentDOI
					}
				})
			}
		}
	}

	private requireSelectedIED(): Element {
		if (!store.doc) { throw new Error('Doc not found!') }

		const ied = store.doc.querySelector(`IED[name="${store.selectedIED?.name}"]`)

		if (!ied) {
			throw new Error(`IED with name ${store.selectedIED?.name} not found`)
		}

		return ied
	}

	private ensureDataTypeTemplates(): Element {
		if (!store.doc) { throw new Error('Doc not found!') }

		const sclRoot = store.doc.querySelector("SCL");

		if (!sclRoot) { throw new Error('SCL Root not found!') }

		const host = this.requireHost()

		let dTT = store.doc.querySelector('DataTypeTemplates')

		if (dTT) {
			return dTT
		}

		createElement({ host, doc: store.doc, tagName: "DataTypeTemplates", parent: sclRoot, reference: null })

		dTT = store.doc.querySelector('DataTypeTemplates')

		if (!dTT) { throw new Error('DataTypeTemplates still does not exist!') }

		return dTT
	}

	private ensureLD0(ied: Element): Element {
		const host = this.requireHost()

		let ld0 = ied.querySelector('LDevice[inst="LD0"]')
		if (ld0) {
			return ld0
		}

		let accessPoint = ied.querySelector('AccessPoint')
		console.log("accessPoint 1:", accessPoint)
		if (!accessPoint) {
			const newAccessPoint = store.doc.createElement('AccessPoint')
			newAccessPoint.setAttribute('name', 'AP1')
			createAndDispatchEditEvent({
				host,
				edit: { node: newAccessPoint, parent: ied, reference: null },
			})
			accessPoint = ied.querySelector('AccessPoint')
			console.log("accessPoint 2:", accessPoint)
		}
		if (!accessPoint) { throw new Error('server still does not exist') }

		let server = accessPoint?.querySelector('Server')
		console.log("server 1:", server)
		if (!server) {
			const newServer = store.doc.createElement('Server')
			createAndDispatchEditEvent({
				host,
				edit: { node: newServer, parent: accessPoint, reference: null },
			})
			server = accessPoint?.querySelector('Server')
			console.log("server 2:", server)
		}
		if (!server) { throw new Error('server still does not exist') }

		const newLD0 = store.doc.createElement('LDevice')
		newLD0.setAttribute('inst', 'LD0')
		createAndDispatchEditEvent({
			host,
			edit: { node: newLD0, parent: server, reference: null },
		})
		ld0 = ied.querySelector('LDevice[inst="LD0"]')
		if (!ld0) { throw new Error('ld0 still does not exist') }

		return ld0
	}


	private requireHost() {
		const host = this.getHost()
		if (!host) {
			throw new Error('no host element found')
		}
		return host
	}

}

export function newCommand(getHost: HostGetter) {
	return new Command(getHost)
}


type HostGetter = () => Nullable<HTMLElement>