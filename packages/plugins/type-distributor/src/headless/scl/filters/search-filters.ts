import { filterByAccessPoint } from './access-point-filters'
import { filterByIED } from './ied-filters'
import { filterByLDevice } from './ldevice-filters'
import { filterByLN } from './ln-filters'
import type { FilteredIED, IEDData, SearchType } from './types'

export function filterIedDataBySearch(
	ieds: IEDData[],
	searchType: SearchType,
	searchTerm: string
): FilteredIED[] {
	if (!searchTerm) return ieds

	switch (searchType) {
		case 'IED':
			return filterByIED(ieds, searchTerm)
		case 'AccessPoint':
			return filterByAccessPoint(ieds, searchTerm)
		case 'LDevice':
			return filterByLDevice(ieds, searchTerm)
		case 'LN/LN0':
			return filterByLN(ieds, searchTerm)
	}
}
