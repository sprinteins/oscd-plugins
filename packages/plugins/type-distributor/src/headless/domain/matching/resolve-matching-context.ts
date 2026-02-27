import type { BayType } from '@/headless/common-types'

export type MatchingContext = {
	scdBay: Element
	bayType: BayType
}

export function resolveMatchingContext(
	selectedBayTypeUuid: string | null | undefined,
	bayTypes: BayType[],
	scdBay: Element | null | undefined
): MatchingContext {
	if (!selectedBayTypeUuid) {
		throw new Error('No BayType selected')
	}

	const bayType = bayTypes.find((bay) => bay.uuid === selectedBayTypeUuid)
	if (!bayType) {
		throw new Error(`BayType "${selectedBayTypeUuid}" not found`)
	}

	if (!scdBay) {
		throw new Error('No Bay selected in SCD')
	}

	return { scdBay, bayType }
}
