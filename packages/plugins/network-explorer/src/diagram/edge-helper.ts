import type { Networking } from "@oscd-plugins/core"
import type { Edge } from "@xyflow/svelte"
import { getIedNameFromId } from "./ied-helper"
import type { IED } from "./networking"

const shortUuidDigits = 6

export function createCableId(label: string): string {
	return `${crypto.randomUUID().substring(0, shortUuidDigits)}-${label}`
}

export function extractCableNameFromId(cableName: string): string {
	return cableName.substring(shortUuidDigits + 1)
}

export function getPhysConnectionsFromEdge(edge: Edge, currentIEDs: IED[]): Networking[] {
	const cableName = extractCableNameFromId(edge.id)
	const iedCableCombinations = [
		{ iedName: getIedNameFromId(edge.source), cableName },
		{ iedName: getIedNameFromId(edge.target), cableName },
	]

	return iedCableCombinations.map(({ iedName, cableName }) => {
		const ied = currentIEDs.find(ied => ied.name === iedName)

		if (!ied) {
			throw Error(`ied ${iedName} not found`)
		}

		const networking = ied.networking.find(net => net.cable === cableName)

		if (!networking) {
			throw Error(`cable ${cableName} not found`)
		}

		return networking
	})
}
