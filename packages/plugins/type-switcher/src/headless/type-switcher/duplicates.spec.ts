import { webcrypto } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ElementCategoryMap } from '@/headless/types'
import { duplicateTypesScd } from '@/testing/duplicate-types'
import {
	flattenCategories,
	loadDuplicateCategories
} from './duplicates'

function ids(categories: ElementCategoryMap) {
	return Object.fromEntries(
		Object.entries(categories).map(([category, groups]) => [
			category,
			groups.map((group) => group.map((item) => item.element.id))
		])
	)
}

describe('GIVEN an SCD with duplicate types', () => {
	let categories: ElementCategoryMap

	beforeEach(async () => {
		vi.stubGlobal('crypto', webcrypto)
		vi.spyOn(console, 'info').mockImplementation(() => {})
		const doc = new DOMParser().parseFromString(
			duplicateTypesScd,
			'application/xml'
		)
		categories = await loadDuplicateCategories(doc.documentElement)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('WHEN duplicates are loaded THEN every category contains its duplicate group', () => {
		expect(ids(categories)).toEqual({
			'LN Type': [['ln-a', 'ln-b']],
			'DO Type': [['do-a', 'do-b', 'do-c']],
			'DA Type': [['da-a', 'da-b']],
			'Enum Type': [['enum-a', 'enum-b']]
		})
	})

	it('WHEN duplicates are loaded THEN each type carries the elements referencing it', () => {
		const [lnA] = categories['LN Type'][0]

		expect(lnA.usages.map((usage) => usage.element.tagName)).toEqual([
			'LNode',
			'LN'
		])
	})

	it('WHEN categories are flattened THEN groups follow the selected category order', () => {
		const flattened = flattenCategories(categories, [
			'Enum Type',
			'DO Type'
		])

		expect(flattened).toEqual([
			{ type: 'Enum Type', items: categories['Enum Type'][0] },
			{ type: 'DO Type', items: categories['DO Type'][0] }
		])
	})

	it('WHEN no categories are selected for flattening THEN no groups are returned', () => {
		expect(flattenCategories(categories, [])).toEqual([])
	})
})
