import type {
	IEDConnectionWithCustomValues,
	IEDNode
} from '../../../components/diagram'
import { hasActiveIEDSelection, isIEDSelected } from '../_store-view-filter'
import type { Config } from './config'
// TYPES
import type { IED } from '@oscd-plugins/core'

export function generateIEDLayout(
	ieds: IED.CommunicationInfo[],
	edges: IEDConnectionWithCustomValues[],
	config: Config
): IEDNode[] {
	const hasSelection = hasActiveIEDSelection()

	const relevantEdges = edges.filter((edge) => edge.isRelevant)
	const relevantNodes = new Set<string>()
	relevantEdges.forEach((edge) => {
		edge.relevantIEDNames?.forEach((iedName) => {
			relevantNodes.add(iedName)
		})
	})

	const children: IEDNode[] = ieds.map((ied, ii) => {
		let isRelevant = true
		if (hasSelection) {
			// TODO: smells, we should be independent of the label
			const isNodeRelevant = relevantNodes.has(ied.iedName)
			const isNodeSelected = isIEDSelected({ label: ied.iedName })
			isRelevant = isNodeRelevant || isNodeSelected
		}

		return {
			id: Id(ii),
			width: config.width,
			height: config.height,
			label: ied.iedName,
			isRelevant: isRelevant,
			children: [],
			details: ied.iedDetails,
			bays: ied.bays
		}
	})

	return children
}

export function Id(something: unknown): string {
	return `ied-${something}`
}
