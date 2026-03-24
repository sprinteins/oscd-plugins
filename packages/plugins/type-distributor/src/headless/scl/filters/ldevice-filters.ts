import type { LDeviceData } from '@/headless/common-types'
import type { FilteredAccessPoint, FilteredIED, IEDData } from './types'

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
					const filteredLDevices: LDeviceData[] = ap.lDevices.filter(
						(ld) => matchesLDevice(ld.ldInst, normalizedTerm)
					)
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
