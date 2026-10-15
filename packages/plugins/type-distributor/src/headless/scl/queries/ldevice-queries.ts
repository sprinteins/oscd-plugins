import type { IedLDeviceData, IedLNData } from '../../common-types'

export function queryLDevicesFromAccessPoint(
	accessPoint: Element
): IedLDeviceData[] {
	const lDevices: IedLDeviceData[] = []

	const servers = accessPoint.querySelectorAll(':scope > Server')

	for (const server of servers) {
		const lDeviceElements = server.querySelectorAll(':scope > LDevice')

		for (const lDevice of lDeviceElements) {
			const ldInst = lDevice.getAttribute('inst') ?? undefined
			if (!ldInst) continue

			const lnElements = lDevice.querySelectorAll(
				':scope > LN, :scope > LN0'
			)

			const lns: IedLNData[] = []
			for (const ln of lnElements) {
				lns.push({
					lnClass: ln.getAttribute('lnClass') ?? '',
					lnType: ln.getAttribute('lnType') ?? '',
					inst: ln.getAttribute('inst') ?? '',
					iedName: ln.getAttribute('iedName') ?? undefined,
					ldInst
				})
			}
			if (lns.length > 0) {
				lDevices.push({ ldInst, lns })
			}
		}
	}
	return lDevices
}
