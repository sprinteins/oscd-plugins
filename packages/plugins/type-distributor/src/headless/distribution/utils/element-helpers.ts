import type { ConductingEquipmentTemplate } from '../../types'

/**
 * Gets the next available LNode instance number for a given class
 * @param parent The parent element to search within
 * @param lnClass The LNode class
 * @returns The next available instance number as string
 */
export function getNextLNodeInstance(
	parent: Element,
	lnClass: string
): string {
	const existingLNodes = Array.from(
		parent.querySelectorAll(`LN[lnClass="${lnClass}"]`)
	)
	if (existingLNodes.length === 0) {
		return '1'
	}

	const instances = existingLNodes
		.map((ln) => Number.parseInt(ln.getAttribute('lnInst') || '0', 10))
		.filter((n) => !Number.isNaN(n))

	const maxInstance = Math.max(...instances, 0)
	return String(maxInstance + 1)
}

/**
 * Checks if conducting equipment is part of a template structure
 * @param element The conducting equipment element
 * @returns True if it has template-related attributes
 */
export function isConductingEquipmentFromTemplate(
	element: ConductingEquipmentTemplate
): boolean {
	return 'eqFunctions' in element && element.eqFunctions.length > 0
}
