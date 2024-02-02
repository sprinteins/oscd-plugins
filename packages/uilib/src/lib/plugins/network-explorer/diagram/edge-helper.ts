import type { IEDNetworkInfoV3, PhysConnection } from "@oscd-plugins/core"
import type { Edge } from "@xyflow/svelte"
import { getIedNameFromId } from "./ied-helper"

const shortUuidDigits = 6

export function createCableId(label: string): string {
	return `${crypto.randomUUID().substring(0, shortUuidDigits)}-${label}`
}

export function extractCableNameFromId(cableName: string): string {
	return cableName.substring(shortUuidDigits + 1)
}

export function getPhysConnectionsFromEdge(edge: Edge, currentIedNetworkInfos: IEDNetworkInfoV3[]): PhysConnection[] {
	const cableName = extractCableNameFromId(edge.id)
	const iedCableCombinations = [
		{ iedName: getIedNameFromId(edge.source), cableName },
		{ iedName: getIedNameFromId(edge.target), cableName },
	]

	return iedCableCombinations.map(({ iedName, cableName }) => {
		const ied = currentIedNetworkInfos.find(ied => ied.iedName === iedName)

		if (!ied) {
			throw Error(`ied ${iedName} not found`)
		}

		const physConn = ied.networkInfo.connections.find(physConn => physConn.cable === cableName)

		if (!physConn) {
			throw Error(`cable ${cableName} not found`)
		}

		return physConn
	})
}
