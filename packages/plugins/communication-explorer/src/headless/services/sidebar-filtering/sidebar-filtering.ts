export type SidebarSearchOption<T> =
	| { kind: 'ied'; value: T }
	| { kind: 'bay'; value: string }

export function filterSidebarSearchOptions<T extends { label: string }>(
	ieds: T[],
	bays: string[],
	query: string
): { ieds: T[]; bays: string[] } {
	const normalizedQuery = query.toLowerCase()

	if (!normalizedQuery) {
		return { ieds, bays }
	}

	return {
		ieds: ieds.filter((ied) =>
			ied.label.toLowerCase().includes(normalizedQuery)
		),
		bays: bays.filter((bay) => bay.toLowerCase().includes(normalizedQuery))
	}
}

export function resolveSidebarSearchOption<T extends { label: string }>(
	ieds: T[],
	bays: string[],
	label: string
): SidebarSearchOption<T> | undefined {
	const bay = bays.find((candidate) => candidate === label)
	if (bay !== undefined) {
		return { kind: 'bay', value: bay }
	}

	const ied = ieds.find((candidate) => candidate.label === label)
	return ied === undefined ? undefined : { kind: 'ied', value: ied }
}

export function findSidebarIEDsByBay<T extends { bays?: ReadonlySet<string> }>(
	ieds: T[],
	bay: string
): T[] {
	return ieds.filter((ied) => ied.bays?.has(bay) === true)
}

export function isConnectionDirectionDisabled(
	filter: {
		selectedIEDs: { label: string }[]
		selectedConnection: unknown | undefined
	},
	iedFilterDisabled: boolean
): boolean {
	if (iedFilterDisabled) return true

	return (
		filter.selectedIEDs.length === 0 &&
		filter.selectedConnection === undefined
	)
}
