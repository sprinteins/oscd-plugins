// TYPES
import type { TypeElementByIds, AvailableTypeFamily } from '@/headless/stores'

export function getFilteredTypeElementByIds<
	GenericTypeFamily extends AvailableTypeFamily
>(
	filter: string,
	typeElementByIds: TypeElementByIds<GenericTypeFamily>
): TypeElementByIds<GenericTypeFamily> {
	return Object.entries(typeElementByIds).reduce(
		(accumulator, [key, typeElement]) => {
			const labelLowerCase = typeElement.parameters.label.toLowerCase()
			if (labelLowerCase.includes(filter.toLowerCase())) {
				accumulator[key] = typeElement
			}
			return accumulator
		},
		{} as TypeElementByIds<GenericTypeFamily>
	)
}
