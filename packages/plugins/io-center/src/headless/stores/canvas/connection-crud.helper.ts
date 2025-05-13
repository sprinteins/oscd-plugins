// CORE
import {
	typeGuard,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
// CONSTANTS
import {
	LOGICAL_CONDITIONER_CLASS,
	ALLOWED_LOGICAL_CONDITIONER_CLASS_BY_CDC,
	PORT_KIND,
	PORT_KIND_TO_ELEMENT_TAG_NAME,
	CONNECTION_ELEMENT_TAG_NAME,
	LOGICAL_PHYSICAL_CLASS,
	PORT_SIDE
} from '@/headless/constants'
// STORES
import {
	iedStore,
	canvasStore,
	pluginLocalStore,
	logicalStore
} from '@/headless/stores'
// UTILS
import { pushInStringArrayIfNotPresent } from '@/headless/utils'
// TYPES
import type {
	PortConfig,
	LogicalConditionerClass,
	ConnectionId
} from '@/headless/stores'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

//====== READ ======//

export function getConnectionsUuids() {
	const connectionsUuids: ConnectionId[] = []

	for (const iED of Array.from(pluginLocalStore.rootSubElements.ied || [])) {
		for (const dOIElement of iED.querySelectorAll('DOI')) {
			for (const lNRefElement of dOIElement.querySelectorAll('LNRef')) {
				const dOIUuid = dOIElement.getAttribute('uuid')
				if (!dOIUuid) throw new Error('DOI uuid not found')
				const lNRefUuid = lNRefElement.getAttribute('uuid')
				if (!lNRefUuid) throw new Error('LNRef uuid not found')

				connectionsUuids.push({
					dOISource: dOIUuid,
					lNRefTarget: lNRefUuid
				})
			}
		}
	}

	return connectionsUuids
}

export function getCurrentConnectedUuidsAndAddLogicalToSelection() {
	if (!iedStore.selectedDataObjects.length)
		throw new Error('No data objects selected')

	for (const currentDataObject of iedStore.selectedDataObjects) {
		const currentDataObjectUuid = currentDataObject.ports[0].payload.uuid
		// loop through all ids
		for (const connectionId of canvasStore.connectionUuids) {
			// begin with conditioner as their are considered as source
			// for both dataObject and physical in the connectionUuids array
			for (const conditioner of logicalStore.conditioners.raw) {
				for (const conditionerPort of conditioner.ports) {
					if (
						connectionId.dOISource === conditionerPort.payload.uuid
					) {
						const isConnectedToCurrentSelectedDataObject =
							conditionerPort.allowedTarget.kind ===
								PORT_KIND.dataObject &&
							connectionId.lNRefTarget === currentDataObjectUuid
						// check connection between conditioner and dataObject
						if (isConnectedToCurrentSelectedDataObject) {
							// add dataObject
							pushInStringArrayIfNotPresent(
								canvasStore.currentConnectedDataObjectAndLogicalUuids,
								currentDataObjectUuid
							)
							// add conditioner
							pushInStringArrayIfNotPresent(
								canvasStore.currentConnectedDataObjectAndLogicalUuids,
								conditionerPort.payload.uuid
							)

							pushInStringArrayIfNotPresent(
								logicalStore.conditionerFilterValues
									.selectedLogicalIds,
								conditioner.id
							)
						}

						// check connection between conditioner and physical
						if (
							conditionerPort.allowedTarget.kind ===
							PORT_KIND.logicalPhysical
						) {
							for (const physical of logicalStore.physicals.raw) {
								for (const physicalPort of physical.ports) {
									if (
										connectionId.lNRefTarget ===
										physicalPort.payload.uuid
									) {
										// add conditioner
										pushInStringArrayIfNotPresent(
											canvasStore.currentConnectedDataObjectAndLogicalUuids,
											conditionerPort.payload.uuid
										)
										pushInStringArrayIfNotPresent(
											logicalStore.conditionerFilterValues
												.selectedLogicalIds,
											conditioner.id
										)
										// add physical
										pushInStringArrayIfNotPresent(
											canvasStore.currentConnectedDataObjectAndLogicalUuids,
											physicalPort.payload.uuid
										)
										pushInStringArrayIfNotPresent(
											logicalStore.physicalFilterValues
												.selectedLogicalIds,
											physical.id
										)
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

//====== CREATE ======//

export async function createConnection(params: {
	source: PortConfig
	target: PortConfig
}) {
	if (!isConnectionAllowed()) throw new Error('Connection not allowed')

	const { dOIPort, lNRefPort } = getNamedPortFromSourceAndTarget(params)

	const doesConnectionAlreadyExists = canvasStore.connectionUuids.some(
		(connectionUuid) =>
			connectionUuid.dOISource === dOIPort.payload.uuid &&
			connectionUuid.lNRefTarget === lNRefPort.payload.uuid
	)
	if (doesConnectionAlreadyExists)
		throw new Error('Connection already exists')

	const currentDOI =
		iedStore.selectedIED?.element?.querySelector(
			`DOI[uuid="${dOIPort.payload.uuid}"]`
		) || createDOI(dOIPort)

	const currentLNRef = iedStore.selectedIED?.element?.querySelector(
		`LNRef[uuid="${lNRefPort.payload.uuid}"]`
	)
	if (!currentLNRef) createLnRef(lNRefPort, currentDOI)
}

function createLnRef(port: PortConfig, parent: Element) {
	if (!iedStore.selectedDataObjects.length)
		throw new Error('No data object selected')

	return pluginLocalStore.createElement({
		tagName: CONNECTION_ELEMENT_TAG_NAME.lNRef,
		attributes: {
			uuid: port.payload.uuid,
			ldInst: port.payload.ldInst,
			lnUuid: port.payload.lnUuid,
			lnClass: port.payload.lnClass,
			lnInst: port.payload.lnInst,
			...(port.kind === PORT_KIND.dataObject && {
				doName: port.name
			}),
			...(port.payload.lnClass === LOGICAL_PHYSICAL_CLASS.LPDO && {
				order: `${port.index}`
			})
		},
		parent
	})
}

function createDOI(port: PortConfig) {
	const parent = iedStore.selectedIED?.element?.querySelector(
		`LN[uuid="${port.payload.lnUuid}"]`
	)
	if (!parent) throw new Error('No parent found for DOI')

	return pluginLocalStore.createElement({
		tagName: CONNECTION_ELEMENT_TAG_NAME.dOI,
		attributes: {
			uuid: port.payload.uuid,
			name: `${port.name}-${port.index}`,
			desc: port.side === 'left' ? 'output' : 'input'
		},
		parent
	})
}

//====== DELETE ======//

export function deleteConnection(params: {
	source: string
	target: string
}) {
	if (!pluginGlobalStore.host) throw new Error('No host found')

	const dOIElement = iedStore.selectedIED?.element?.querySelector(
		`[uuid="${params.source}"]`
	)
	const hasLNRefChildren =
		dOIElement?.children &&
		Array.from(dOIElement?.children).filter(
			(child) => child.tagName === 'LNRef'
		).length > 1

	const lNRefElement = iedStore.selectedIED?.element?.querySelector(
		`[uuid="${params.target}"]`
	)

	if (!dOIElement || !lNRefElement)
		throw new Error('No source or target found')

	const editPayload = [
		{ node: lNRefElement },
		...(hasLNRefChildren ? [] : [{ node: dOIElement }])
	]
	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: editPayload
	})
}

//====== TESTER FUNCTIONS ======//

export function isConnectionAllowed() {
	const source = canvasStore.currentPortSource
	const target = canvasStore.currentPortTarget

	if (!source || !target) return false

	if (
		source.allowedTarget.kind !== target.kind ||
		source.allowedTarget.side !== target.side
	)
		return false

	const isConnectionBetweenDataObjectAndLogicalConditioner =
		(source.kind === PORT_KIND.dataObject &&
			target.kind === PORT_KIND.logicalConditioner) ||
		(source.kind === PORT_KIND.logicalConditioner &&
			target.kind === PORT_KIND.dataObject)

	if (
		isConnectionBetweenDataObjectAndLogicalConditioner &&
		typeGuard.isPropertyOfObject(
			target.payload.lnClass,
			LOGICAL_CONDITIONER_CLASS
		)
	) {
		const { dOIPort, lNRefPort } = getNamedPortFromSourceAndTarget({
			source,
			target
		})
		if (!dOIPort.commonDataClass) return true
		return isDoToLcConnectionAllowed(
			dOIPort.commonDataClass,
			lNRefPort.payload.lnClass as LogicalConditionerClass
		)
	}

	return true
}

function isDoToLcConnectionAllowed(
	dataObjectCommonDataClass: string,
	logicalConditionerClass: LogicalConditionerClass
): boolean {
	const isClassImpactedByCdcRestriction = typeGuard.isPropertyOfObject(
		dataObjectCommonDataClass,
		ALLOWED_LOGICAL_CONDITIONER_CLASS_BY_CDC
	)

	if (!isClassImpactedByCdcRestriction) return true

	const isClassAllowed = typeGuard.isTuplesIncludingString(
		logicalConditionerClass,
		ALLOWED_LOGICAL_CONDITIONER_CLASS_BY_CDC[dataObjectCommonDataClass]
	)

	if (isClassAllowed) return true

	return false
}

export function isPortConnected(port: PortConfig): boolean {
	return canvasStore.currentConnectedDataObjectAndLogicalUuids.includes(
		port.payload.uuid
	)
}

export function isAtLeastOnePortConnected(ports: PortConfig[]): boolean {
	return ports.some((port) => isPortConnected(port))
}

export function isPortDisabled(port: PortConfig): boolean {
	return (
		(port.kind === PORT_KIND.dataObject ||
			port.kind === PORT_KIND.logicalPhysical ||
			(port.kind === PORT_KIND.logicalConditioner &&
				port.side === PORT_SIDE.left)) &&
		canvasStore.isPortConnected(port)
	)
}

//====== LOCAL HELPERS ======//

function getNamedPortFromSourceAndTarget(params: {
	source: PortConfig
	target: PortConfig
}): { dOIPort: PortConfig; lNRefPort: PortConfig } {
	let dOIPort: PortConfig
	let lNRefPort: PortConfig
	const sourceTagName = PORT_KIND_TO_ELEMENT_TAG_NAME[params.source.kind]
	const targetTagName = PORT_KIND_TO_ELEMENT_TAG_NAME[params.target.kind]

	if (sourceTagName === CONNECTION_ELEMENT_TAG_NAME.dOI) {
		dOIPort = params.source
		lNRefPort = params.target
	} else if (targetTagName === CONNECTION_ELEMENT_TAG_NAME.dOI) {
		dOIPort = params.target
		lNRefPort = params.source
	} else throw new Error('No ports source or target found')

	return { dOIPort, lNRefPort }
}
