import type { LDeviceData, LNodeTemplate } from '../../common-types'

export function queryLDevicesFromAccessPoint(
	accessPoint: Element
): LDeviceData[] {
	const lDevices: LDeviceData[] = []

	const servers = accessPoint.querySelectorAll(':scope > Server')

	for (const server of servers) {
		const lDeviceElements = server.querySelectorAll(':scope > LDevice')

		for (const lDevice of lDeviceElements) {
			const ldInst = lDevice.getAttribute('inst') ?? undefined
			const lnElements = lDevice.querySelectorAll(
				':scope > LN, :scope > LN0'
			)

			const lNodes: LNodeTemplate[] = []
			for (const lnode of lnElements) {
				lNodes.push({
					lnClass: lnode.getAttribute('lnClass') ?? '',
					lnType: lnode.getAttribute('lnType') ?? '',
					lnInst: lnode.getAttribute('lnInst') ?? '',
					iedName: lnode.getAttribute('iedName') ?? undefined,
					ldInst
				})
			}
			if (lNodes.length > 0 && ldInst) {
				lDevices.push({ ldInst, lNodes })
			}
		}
	}
	return lDevices
}
