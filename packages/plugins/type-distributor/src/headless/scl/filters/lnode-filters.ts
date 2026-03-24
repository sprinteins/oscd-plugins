import type { LDeviceData, LNodeTemplate } from '@/headless/common-types'
import type { FilteredAccessPoint, FilteredIED, IEDData } from './types'

function matchesLNode(lNode: LNodeTemplate, term: string): boolean {
	return (
		lNode.lnClass.toLowerCase().includes(term) ||
		lNode.lnType.toLowerCase().includes(term) ||
		lNode.lnInst.toLowerCase().includes(term)
	)
}

export function filterByLNode(ieds: IEDData[], term: string): FilteredIED[] {
	const normalizedTerm = term.toLowerCase().trim()
	if (!normalizedTerm) return []
	return ieds
		.map((ied) => {
			const filteredAPs: FilteredAccessPoint[] = ied.accessPoints
				.map((ap) => {
					const filteredLDevices: LDeviceData[] = ap.lDevices
						.map((ld) => {
							const filteredLNodes = ld.lNodes.filter((ln) =>
								matchesLNode(ln, normalizedTerm)
							)
							return filteredLNodes.length > 0
								? { ...ld, lNodes: filteredLNodes }
								: null
						})
						.filter((ld): ld is LDeviceData => ld !== null)
					if (filteredLDevices.length > 0) {
						return { ...ap, lDevices: filteredLDevices }
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
