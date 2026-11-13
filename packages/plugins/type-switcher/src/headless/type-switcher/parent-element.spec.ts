import { beforeEach, describe, expect, it } from 'vitest'
import { getParent } from './parent-element'

describe('GIVEN usages with different parent attributes', () => {
	let document: XMLDocument

	beforeEach(() => {
		document = new DOMParser().parseFromString(
			`<SCL>
				<LNodeType id="type-id" name="type-name" desc="description"><DO /></LNodeType>
				<LNodeType id="" name="type-name" desc="description"><DO /></LNodeType>
				<LNodeType desc="description"><DO /></LNodeType>
				<LNodeType><DO /></LNodeType>
			</SCL>`,
			'application/xml'
		)
	})

	it.each([
		[0, 'type-id'],
		[1, 'type-name'],
		[2, 'description'],
		[3, '~name not found~']
	])('WHEN usage %i is inspected THEN it returns the first available parent name', (index, name) => {
		const element = document.getElementsByTagName('DO')[index]

		expect(getParent({ element })).toEqual({ name, type: 'LNodeType' })
	})
})

it('GIVEN a detached usage WHEN its parent is inspected THEN it returns empty metadata', () => {
	const element = document.createElement('DO')

	expect(getParent({ element })).toEqual({ name: '', type: '' })
})
