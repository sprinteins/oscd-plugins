import type { IedLDeviceData, IedLNData } from '@/headless/common-types'
import type { FilteredAccessPoint, FilteredIED, IEDData } from './types'

function matchesLN(ln: IedLNData, term: string): boolean {
	return (
		ln.lnClass.toLowerCase().includes(term) ||
		ln.lnType.toLowerCase().includes(term) ||
		ln.inst.toLowerCase().includes(term)
	)
}

export function filterByLN(ieds: IEDData[], term: string): FilteredIED[] {
	const normalizedTerm = term.toLowerCase().trim()
	if (!normalizedTerm) return []
	return ieds
		.map((ied) => {
			const filteredAPs: FilteredAccessPoint[] = ied.accessPoints
				.map((ap) => {
					const filteredLDevices: IedLDeviceData[] = ap.lDevices
						.map((ld) => {
							const filteredLNs = ld.lns.filter((ln) =>
								matchesLN(ln, normalizedTerm)
							)
							return filteredLNs.length > 0
								? { ...ld, lns: filteredLNs }
								: null
						})
						.filter((ld): ld is IedLDeviceData => ld !== null)
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
