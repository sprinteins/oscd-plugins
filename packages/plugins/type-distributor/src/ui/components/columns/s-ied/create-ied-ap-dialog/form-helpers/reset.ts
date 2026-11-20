import type { AccessPointData, IedData } from './types'

export function createInitialIedData(): IedData {
	return {
		name: '',
		description: '',
		isNew: true
	}
}

export function createInitialAccessPoint(): AccessPointData {
	return { name: '', description: '', serverAtApName: '' }
}

export function createInitialAccessPoints(): AccessPointData[] {
	return [createInitialAccessPoint()]
}

export function removePendingAccessPoint(
	confirmedAps: AccessPointData[],
	activeAp: AccessPointData,
	apName: string
): AccessPointData[] {
	return [
		...confirmedAps.filter(
			(ap) => ap.name !== apName && ap.serverAtApName !== apName
		),
		activeAp.serverAtApName === apName
			? createInitialAccessPoint()
			: activeAp
	]
}
