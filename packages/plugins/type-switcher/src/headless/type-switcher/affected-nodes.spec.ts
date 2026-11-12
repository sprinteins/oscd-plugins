import type { HashedElementGroup } from '@oscd-plugins/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { getAffectedNodes } from './affected-nodes'

describe('GIVEN a type group with usages', () => {
	let group: HashedElementGroup

	beforeEach(() => {
		const doc = new DOMParser().parseFromString(
			`<SCL>
				<Bay name="Bay1"><LNode lnType="ln-a" /></Bay>
				<LDevice inst="LD1" desc="Logical device"><LN lnType="ln-a" /></LDevice>
				<LNodeType id="ln-a" />
				<LNodeType id="ln-b" />
			</SCL>`,
			'application/xml'
		)
		group = Array.from(doc.getElementsByTagName('LNodeType')).map(
			(element) => ({
				element: { id: element.id, element },
				hash: 'hash',
				usages: Array.from(
					doc.querySelectorAll(`[lnType="${element.id}"]`)
				).map((usage) => ({ element: usage }))
			})
		)
	})

	it('WHEN affected nodes are requested THEN it returns the parents of every usage with the source id', () => {
		expect(getAffectedNodes(group, [0, 1])).toEqual([
			{ parent: { name: 'Bay1', type: 'Bay' }, typeId: 'ln-a' },
			{
				parent: { name: 'Logical device', type: 'LDevice' },
				typeId: 'ln-a'
			}
		])
	})

	it('WHEN a missing index is requested THEN it throws', () => {
		expect(() => getAffectedNodes(group, [2])).toThrow(
			'No type found at index 2'
		)
	})
})
