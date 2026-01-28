import type { LNodeTemplate } from '../types'

export function getLNodesFromAccessPoint(
	accessPoint: Element
): LNodeTemplate[] {
	const lNodes: LNodeTemplate[] = []

	const servers = Array.from(accessPoint.children).filter(
		(child) => child.localName === 'Server'
	)

	for (const server of servers) {
		const lDevices = Array.from(server.children).filter(
			(child) => child.localName === 'LDevice'
		)

		for (const lDevice of lDevices) {
			const lnElements = Array.from(lDevice.children).filter(
				(child) => child.localName === 'LN0' || child.localName === 'LN'
			)

			for (const lnode of lnElements) {
				lNodes.push({
					lnClass: lnode.getAttribute('lnClass') ?? '',
					lnType: lnode.getAttribute('lnType') ?? '',
					lnInst: lnode.getAttribute('lnInst') ?? '',
					iedName: lnode.getAttribute('iedName') ?? undefined
				})
			}
		}
	}

	return lNodes
}
