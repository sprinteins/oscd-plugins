import { webcrypto } from 'node:crypto'
import type { HashedElementGroup } from '@oscd-plugins/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ElementCategoryMap } from '@/headless/types'
import { duplicateTypesScd } from '@/testing/duplicate-types'
import { loadDuplicateCategories } from './duplicates'
import { createRelinkActions } from './relink'

describe('GIVEN duplicate groups loaded from an SCD', () => {
	let doc: Document
	let categories: ElementCategoryMap

	beforeEach(async () => {
		vi.stubGlobal('crypto', webcrypto)
		vi.spyOn(console, 'info').mockImplementation(() => {})
		doc = new DOMParser().parseFromString(
			duplicateTypesScd,
			'application/xml'
		)
		categories = await loadDuplicateCategories(doc.documentElement)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	describe('WHEN a DO type is relinked', () => {
		let usages: Element[]
		let actions: ReturnType<typeof createRelinkActions>

		beforeEach(() => {
			usages = Array.from(doc.querySelectorAll('DO[type="do-a"]'))
			actions = createRelinkActions(categories['DO Type'][0], [0], 1)
		})

		it('THEN it replaces every usage with a clone referencing the target', () => {
			expect(actions.map((action) => action.old.element)).toEqual(usages)
			for (const action of actions) {
				expect(action.new.element).not.toBe(action.old.element)
				expect(action.new.element.getAttribute('type')).toBe('do-b')
			}
		})

		it('THEN it does not mutate the document', () => {
			for (const usage of usages) {
				expect(usage.getAttribute('type')).toBe('do-a')
			}
		})

		it('THEN it preserves the attributes and children of each usage', () => {
			const posA = actions.find(
				(action) => action.old.element.getAttribute('name') === 'PosA'
			)

			expect(posA?.new.element.getAttribute('desc')).toBe('keep')
			expect(
				posA?.new.element.querySelector('Private > value')?.textContent
			).toBe('preserved')
		})
	})

	it('WHEN an LN type is relinked THEN it updates lnType without adding type', () => {
		const actions = createRelinkActions(categories['LN Type'][0], [0], 1)

		expect(actions.map((action) => action.old.element)).toEqual(
			Array.from(doc.querySelectorAll('[lnType="ln-a"]'))
		)
		for (const action of actions) {
			expect(action.new.element.getAttribute('lnType')).toBe('ln-b')
			expect(action.new.element.hasAttribute('type')).toBe(false)
		}
	})

	it.each([
		['DA Type', 'da-a', 'da-b'],
		['Enum Type', 'enum-a', 'enum-b']
	] as const)('WHEN a %s is relinked THEN it updates every type reference', (category, source, target) => {
		const actions = createRelinkActions(categories[category][0], [0], 1)

		expect(actions.map((action) => action.old.element)).toEqual(
			Array.from(doc.querySelectorAll(`DA[type="${source}"]`))
		)
		for (const action of actions) {
			expect(action.new.element.getAttribute('type')).toBe(target)
		}
	})

	it('WHEN multiple sources are relinked THEN usages of every source are replaced', () => {
		const actions = createRelinkActions(categories['DO Type'][0], [0, 1], 2)

		expect(actions.map((action) => action.old.element)).toEqual(
			Array.from(doc.querySelectorAll('DO[type="do-a"], DO[type="do-b"]'))
		)
		for (const action of actions) {
			expect(action.new.element.getAttribute('type')).toBe('do-c')
		}
	})

	it('WHEN no sources are selected THEN no actions are created', () => {
		expect(createRelinkActions(categories['DO Type'][0], [], 0)).toEqual([])
	})

	it.each([
		[[0], 3],
		[[3], 0]
	])('WHEN sources %j and target %i are relinked THEN it throws for the missing index', (sourceIndexes, targetIndex) => {
		expect(() =>
			createRelinkActions(
				categories['DO Type'][0],
				sourceIndexes,
				targetIndex
			)
		).toThrow('No type found at index 3')
	})
})

describe('GIVEN hand-built type groups', () => {
	let doc: Document

	beforeEach(() => {
		doc = new DOMParser().parseFromString(
			`<SCL>
				<LNodeType id="ln-a" />
				<LNodeType id="ln-b" />
				<DO name="Pos" type="ln-a" />
				<Unknown id="unknown-a" />
				<Unknown id="unknown-b" />
			</SCL>`,
			'application/xml'
		)
	})

	function group(tagName: string, usage: string): HashedElementGroup {
		return Array.from(doc.getElementsByTagName(tagName)).map((element) => ({
			element: { id: element.id, element },
			hash: 'hash',
			usages: Array.from(doc.querySelectorAll(usage)).map((element) => ({
				element
			}))
		}))
	}

	it('WHEN a usage does not reference the source through the expected attribute THEN it throws', () => {
		expect(() =>
			createRelinkActions(group('LNodeType', 'DO'), [0], 1)
		).toThrow('DO does not reference "ln-a" through "lnType"')
	})

	it('WHEN the source is not a supported type element THEN it throws', () => {
		expect(() =>
			createRelinkActions(group('Unknown', 'DO'), [0], 1)
		).toThrow('Unsupported type element "Unknown"')
	})
})
