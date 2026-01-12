import type { IEDInfoWithBays } from '@/headless/types'

export function filterIEDsByBays<T extends IEDInfoWithBays>(
	iedInfos: T[],
	selectedBays: Set<string>
): T[] {
	if (selectedBays.size === 0) return iedInfos

	return iedInfos.filter((ied) => isIEDInSelectedBays(ied, selectedBays))
}

function isIEDInSelectedBays(
	ied: IEDInfoWithBays,
	selectedBays: Set<string>
): boolean {
	if (!ied.bays || ied.bays.size === 0) return false
	
	return Array.from(ied.bays).some((bay: string) => selectedBays.has(bay))
}
