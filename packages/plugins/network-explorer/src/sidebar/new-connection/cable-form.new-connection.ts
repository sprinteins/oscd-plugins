import { getNetworkingWithOpenPort } from '../../diagram/ied-helper'
import type { IED } from '../../diagram/networking'
import type {
	CreateCableEvent,
	UpdateCableEvent
} from '../../editor-events/network-events'
import type { ConnectionBetweenNodes } from '../../store'

export interface CableNameErrors {
	required: boolean
	cableNameInUse: boolean
}

export function getCableNameErrors(
	cableName: string,
	cableNames: string[],
	existingCableName: string | null
): CableNameErrors {
	const required = !cableName
	const cableNameInUse =
		!required &&
		cableNames.includes(cableName) &&
		cableName !== existingCableName

	return { required, cableNameInUse }
}

export function getInitialPort(
	ied: IED,
	existingCableName: string | null
): string {
	const ports = getNetworkingWithOpenPort(ied, existingCableName)
	const networking = existingCableName
		? ports.find((port) => port.cable === existingCableName)
		: ports[0]

	if (!networking) {
		throw new Error(
			existingCableName
				? `Port for cable ${existingCableName} in IED ${ied.name} not found`
				: `No open port found in IED ${ied.name}`
		)
	}

	return networking.port
}

export function buildCreateCableEvent(
	connection: ConnectionBetweenNodes,
	cableName: string,
	sourceSelectedPort?: string,
	targetSelectedPort?: string
): CreateCableEvent {
	const sourcePort = sourceSelectedPort || getDefaultPort(connection.source)
	const targetPort = targetSelectedPort || getDefaultPort(connection.target)

	return {
		cable: cableName,
		source: { ied: connection.source, port: sourcePort },
		target: { ied: connection.target, port: targetPort }
	}
}

export function buildUpdateCableEvent(
	connection: ConnectionBetweenNodes,
	cableName: string,
	sourceSelectedPort?: string,
	targetSelectedPort?: string
): UpdateCableEvent {
	const existingCableName = connection.cableName
	if (!existingCableName) {
		throw new Error('Existing cable not found during update')
	}

	const oldSourcePort = getOldPort(connection.source, existingCableName)
	const oldTargetPort = getOldPort(connection.target, existingCableName)

	return {
		cable: cableName,
		source: {
			ied: connection.source,
			oldPort: oldSourcePort,
			newPort: sourceSelectedPort || oldSourcePort
		},
		target: {
			ied: connection.target,
			oldPort: oldTargetPort,
			newPort: targetSelectedPort || oldTargetPort
		}
	}
}

function getDefaultPort(ied: IED): string {
	const networking = getNetworkingWithOpenPort(ied)[0]
	if (!networking) {
		throw new Error(`No open port found in IED ${ied.name}`)
	}

	return networking.port
}

function getOldPort(ied: IED, cableName: string): string {
	const networking = ied.networking.find((port) => port.cable === cableName)
	if (!networking) {
		throw new Error(
			`Port for cable ${cableName} in IED ${ied.name} not found`
		)
	}

	return networking.port
}
