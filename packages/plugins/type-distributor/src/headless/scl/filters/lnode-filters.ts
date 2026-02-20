import type { LNodeTemplate } from '@/headless/common-types'
import type { IEDData, FilteredIED, FilteredAccessPoint } from './types'

function matchesLNode(lNode: LNodeTemplate, term: string): boolean {
	return (
		lNode.lnClass.toLowerCase().includes(term) ||
		lNode.lnType.toLowerCase().includes(term) ||
		lNode.lnInst.toLowerCase().includes(term)
	)
}

export function filterByLNode(ieds: IEDData[], term: string): FilteredIED[] {
	const normalizedTerm = term.toLowerCase().trim()
	return ieds
		.map((ied) => {
			const filteredAPs: FilteredAccessPoint[] = ied.accessPoints
				.map((ap) => {
					const filteredLNodes: LNodeTemplate[] = ap.lNodes.filter((ln) =>
						matchesLNode(ln, normalizedTerm)
					)
					if (filteredLNodes.length > 0) {
						return { ...ap, lNodes: filteredLNodes }
					}
					return null
				})
				.filter((ap): ap is FilteredAccessPoint => ap !== null)
			if (filteredAPs.length > 0) {
				return { ...ied, accessPoints: filteredAPs }
			}
			return null
		})
		.filter((ied): ied is FilteredIED => ied !== null)
}
