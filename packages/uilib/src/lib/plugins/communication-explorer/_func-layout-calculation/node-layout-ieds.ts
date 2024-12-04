import type { IEDCommInfo } from "@oscd-plugins/core"
import { isBayNode, type IEDConnectionWithCustomValues, type IEDNode } from "../../../components/diagram"
import { hasActiveIEDSelection, isIEDSelected, hasActiveBaySelection, isBaySelected } from "../_store-view-filter"
import type { Config } from "./config"



export function generateIEDLayout(
	ieds: IEDCommInfo[], 
	edges: IEDConnectionWithCustomValues[], 
	config: Config, 
): IEDNode[] {
	const hasIEDSelection = hasActiveIEDSelection()
	const hasBaySelection = hasActiveBaySelection()

	const relevantEdges = edges.filter(edge => edge.isRelevant)
	const relevantNodes = new Set<string>()
	relevantEdges.forEach(edge => {
		edge.relevantIEDNames?.forEach(iedName => { relevantNodes.add(iedName) })
	})

	const children: IEDNode[] = ieds.map((ied, ii) => {
		let isRelevant = true
		if (hasIEDSelection) {
			// TODO: smells, we should be independent of the label
			const isNodeRelevant = relevantNodes.has(ied.iedName)
			const isNodeSelected = isIEDSelected({label: ied.iedName})
			isRelevant = isNodeRelevant || isNodeSelected
		}
		if (hasBaySelection) {
			isRelevant = isBaySelected(ied.bayLabels.values().next().value) //TODO: this needs to change to support multiple bays!
		}

		return {
			id:         	Id(ii),
			width:      	config.iedWidth,
			height:     	config.iedHeight, //+ config.bayLabelHeight + config.bayLabelGap,
			label:      	ied.iedName,
			isRelevant: 	isRelevant,
			children:   	[],
			details:		ied.iedDetails,
			bayLabels:		ied.bayLabels,
			bayLabelHeight:	config.bayLabelHeight,
			bayLabelGap:	config.bayLabelGap,
			iedHeight:		config.iedHeight
		}
	})

	return children
}

export function Id(something: unknown): string {
	return `ied-${something}`
}