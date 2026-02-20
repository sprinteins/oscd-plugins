import type { IEDData, FilteredIED, FilteredAccessPoint } from './types'

function matchesAccessPoint(apName: string | null, term: string): boolean {
	return apName?.toLowerCase().includes(term) ?? false
}

export function filterByAccessPoint(ieds: IEDData[], term: string): FilteredIED[] {
	const normalizedTerm = term.toLowerCase().trim()
	return ieds
		.map((ied) => {
			const filteredAPs: FilteredAccessPoint[] = ied.accessPoints.filter((ap) =>
				matchesAccessPoint(ap.name, normalizedTerm)
			)
			if (filteredAPs.length > 0) {
				return { ...ied, accessPoints: filteredAPs }
			}
			return null
		})
		.filter((ied): ied is FilteredIED => ied !== null)
}
