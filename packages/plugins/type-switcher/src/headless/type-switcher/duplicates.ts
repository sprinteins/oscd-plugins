import { SCDQueries, UCTypeTypeSwitcher } from '@oscd-plugins/core'
import type {
	ElementCategory,
	ElementCategoryMap,
	HashedElementTypedCollective
} from '@/headless/types'

export async function loadDuplicateCategories(
	doc: Element
): Promise<ElementCategoryMap> {
	const start = performance.now()
	const deduper = new UCTypeTypeSwitcher(new SCDQueries(doc))
	const [lnTypes, doTypes, daTypes, enumTypes] = await Promise.all([
		deduper.findDuplicateLogicalNodeTypes(),
		deduper.findDuplicateDataObjectTypes(),
		deduper.findDuplicateDataAttributeTypes(),
		deduper.findDuplicateEnumTypes()
	])

	const finish = performance.now()
	console.info({
		level: 'perf',
		msg: 'typeswitcher::loadDuplicates',
		start,
		finish,
		duration: finish - start
	})

	return {
		'LN Type': lnTypes,
		'DO Type': doTypes,
		'DA Type': daTypes,
		'Enum Type': enumTypes
	}
}

export function flattenCategories(
	categories: ElementCategoryMap,
	selectedCategories: ElementCategory[]
): HashedElementTypedCollective {
	return selectedCategories.flatMap((category) =>
		categories[category].map((items) => ({ type: category, items }))
	)
}
