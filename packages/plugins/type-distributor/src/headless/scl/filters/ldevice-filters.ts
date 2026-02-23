import type { LNodeTemplate } from '@/headless/common-types'
import type { IEDData, FilteredIED, FilteredAccessPoint } from './types'

function matchesLDevice(ldInst: string | undefined, term: string): boolean {
	return ldInst?.toLowerCase().includes(term) ?? false
}

export function filterByLDevice(ieds: IEDData[], term: string): FilteredIED[] {
	const normalizedTerm = term.toLowerCase().trim()
	if (!normalizedTerm) return []
	return ieds
		.map((ied) => {
			const filteredAPs: FilteredAccessPoint[] = ied.accessPoints
				.map((ap) => {
					const filteredLNodes: LNodeTemplate[] = ap.lNodes.filter((ln) =>
						matchesLDevice(ln.ldInst, normalizedTerm)
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
