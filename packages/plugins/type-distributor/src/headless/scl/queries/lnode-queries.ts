import type { LNodeTemplate } from '../../common-types'

export function queryLNodesFromAccessPoint(
	accessPoint: Element
): LNodeTemplate[] {
	const lNodes: LNodeTemplate[] = []

	const servers = accessPoint.querySelectorAll(':scope > Server')

	for (const server of servers) {
		const lDevices = server.querySelectorAll(':scope > LDevice')

		for (const lDevice of lDevices) {
			const lDeviceName = lDevice.getAttribute('inst') ?? undefined
			const lnElements = lDevice.querySelectorAll(':scope > LN, :scope > LN0')

			for (const lnode of lnElements) {
				lNodes.push({
					lnClass: lnode.getAttribute('lnClass') ?? '',
					lnType: lnode.getAttribute('lnType') ?? '',
					lnInst: lnode.getAttribute('lnInst') ?? '',
					iedName: lnode.getAttribute('iedName') ?? undefined,
					lDeviceName
				})
			}
		}
	}
	return lNodes
}
