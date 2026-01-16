export function getLNodesFromAccessPoint(
	accessPoint: Element
): Element[] {
	const lNodes: Element[] = []

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
			lNodes.push(...lnElements)
		}
	}

	return lNodes
}