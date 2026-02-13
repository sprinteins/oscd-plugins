/**
 * Checks if a Bay has any remaining LNode connections (LNodes with iedName attribute set)
 * @param bay - The Bay element to check
 * @returns true if there are LNodes with iedName attribute, false otherwise
 */
export function hasRemainingConnections(bay: Element): boolean {
	return bay.querySelectorAll('LNode[iedName]').length > 0
}

/**
 * Checks if a Bay has any remaining LNode connections after applying attribute clears
 * This simulates the state after SetAttributes edits would be applied
 * @param bay - The Bay element to check
 * @param clearedLNodes - Set of LNode elements that will have iedName cleared
 * @returns true if there will be remaining LNodes with iedName after clearing
 */
export function hasRemainingConnectionsAfterClearing(
	bay: Element,
	clearedLNodes: Set<Element>
): boolean {
	const allLNodes = Array.from(bay.querySelectorAll('LNode[iedName]'))
	const remainingLNodes = allLNodes.filter((lnode) => !clearedLNodes.has(lnode))
	return remainingLNodes.length > 0
}
