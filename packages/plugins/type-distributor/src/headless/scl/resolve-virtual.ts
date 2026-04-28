export function resolveVirtual(
	instanceVirtual: boolean | undefined,
	templateVirtual: boolean | undefined
): 'true' | 'false' | null {
	const effective = instanceVirtual ?? templateVirtual
	if (effective === undefined) return null
	return effective ? 'true' : 'false'
}
