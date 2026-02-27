export function hasRemainingConnections(bay: Element): boolean {
	return bay.querySelectorAll('LNode[iedName]').length > 0
}

export function hasRemainingConnectionsAfterClearing(
	bay: Element,
	clearedLNodes: Set<Element>
): boolean {
	const allLNodes = Array.from(bay.querySelectorAll('LNode[iedName]'))
	const remainingLNodes = allLNodes.filter(
		(lnode) => !clearedLNodes.has(lnode)
	)
	return remainingLNodes.length > 0
}
