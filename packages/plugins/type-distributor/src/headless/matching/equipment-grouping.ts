export function groupEquipmentByType(
	elements: Element[]
): Record<string, Element[]> {
	const grouped: Record<string, Element[]> = {}

	for (const element of elements) {
		const type = element.getAttribute('type')
		if (!type) continue

		if (!grouped[type]) grouped[type] = []
		grouped[type].push(element)
	}

	return grouped
}
