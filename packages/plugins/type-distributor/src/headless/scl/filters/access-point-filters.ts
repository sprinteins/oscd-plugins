import type {
	AccessPointGroup,
	FilteredAccessPoint,
	FilteredIED,
	IEDData
} from './types'

function matchesAccessPoint(apName: string | null, term: string): boolean {
	return apName?.toLowerCase().includes(term) ?? false
}

export function groupAccessPointsByServer(
	accessPoints: FilteredAccessPoint[]
): AccessPointGroup[] {
	const hosts = accessPoints.filter(
		(accessPoint) => accessPoint.serverAtApName === undefined
	)
	const serverAtAccessPoints = accessPoints.filter(
		(accessPoint) => accessPoint.serverAtApName !== undefined
	)
	const groups: AccessPointGroup[] = hosts.map((host) => ({
		type: 'host',
		host,
		serverAtAccessPoints: serverAtAccessPoints.filter(
			(accessPoint) => accessPoint.serverAtApName === host.name
		)
	}))
	const groupedServerAtElements = new Set(
		groups.flatMap((group) =>
			group.type === 'host' ? group.serverAtAccessPoints : []
		)
	)

	for (const accessPoint of serverAtAccessPoints) {
		if (!groupedServerAtElements.has(accessPoint)) {
			groups.push({ type: 'unresolved-server-at', accessPoint })
		}
	}

	return groups
}

export function filterAccessPointGroupsByAccessPoint(
	groups: AccessPointGroup[],
	matchingAccessPoints: FilteredAccessPoint[]
): AccessPointGroup[] {
	const matchingByElement = new Map(
		matchingAccessPoints.map((accessPoint) => [
			accessPoint.element,
			accessPoint
		])
	)

	return groups.flatMap((group): AccessPointGroup[] => {
		if (group.type === 'unresolved-server-at') {
			const accessPoint = matchingByElement.get(group.accessPoint.element)
			return accessPoint ? [{ ...group, accessPoint }] : []
		}

		const host = matchingByElement.get(group.host.element)
		const serverAtAccessPoints = group.serverAtAccessPoints.flatMap(
			(accessPoint) => {
				const matchingAccessPoint = matchingByElement.get(
					accessPoint.element
				)
				return matchingAccessPoint ? [matchingAccessPoint] : []
			}
		)
		if (!host && serverAtAccessPoints.length === 0) {
			return []
		}

		return [{ ...group, host: host ?? group.host, serverAtAccessPoints }]
	})
}

export function filterByAccessPoint(
	ieds: IEDData[],
	term: string
): FilteredIED[] {
	const normalizedTerm = term.toLowerCase().trim()
	if (!normalizedTerm) return []
	return ieds
		.map((ied) => {
			const filteredAPs: FilteredAccessPoint[] = ied.accessPoints.filter(
				(ap) => matchesAccessPoint(ap.name, normalizedTerm)
			)
			if (filteredAPs.length > 0) {
				return { ...ied, accessPoints: filteredAPs }
			}
			return null
		})
		.filter((ied): ied is FilteredIED => ied !== null)
}
