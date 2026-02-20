import type { IEDData, FilteredIED } from './types'

function matchesIED(iedName: string, term: string): boolean {
	return iedName.toLowerCase().includes(term)
}

export function filterByIED(ieds: IEDData[], term: string): FilteredIED[] {
	return ieds
		.filter((ied) => matchesIED(ied.name, term))
		.map((ied) => ({ ...ied }))
}
