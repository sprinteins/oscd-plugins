export function mapNamedNodeMapToObject(
	namedNodeMap: NamedNodeMap
): Record<string, string> {
	return Array.from(namedNodeMap).reduce(
		(accumulator: Record<string, string>, attribute) => {
			accumulator[attribute.name] = attribute.value
			return accumulator
		},
		{}
	)
}
