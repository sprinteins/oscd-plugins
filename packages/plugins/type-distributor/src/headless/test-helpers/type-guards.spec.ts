import type { EditV2 } from '@openscd/oscd-api'
import { describe, expect, it } from 'vitest'
import { isRemoveEdit, isSetAttributesEdit } from './type-guards'

describe('isRemoveEdit', () => {
	it('GIVEN an edit with a node property WHEN called THEN returns true', () => {
		const edit = {
			node: document.createElement('div')
		} as unknown as EditV2
		expect(isRemoveEdit(edit)).toBe(true)
	})

	it('GIVEN an edit without a node property WHEN called THEN returns false', () => {
		const edit = {
			element: document.createElement('div'),
			attributes: {}
		} as unknown as EditV2
		expect(isRemoveEdit(edit)).toBe(false)
	})
})

describe('isSetAttributesEdit', () => {
	it('GIVEN an edit with element and attributes WHEN called THEN returns true', () => {
		const edit = {
			element: document.createElement('div'),
			attributes: { name: 'test' }
		} as unknown as EditV2
		expect(isSetAttributesEdit(edit)).toBe(true)
	})

	it('GIVEN an edit with element and attributesNs WHEN called THEN returns true', () => {
		const edit = {
			element: document.createElement('div'),
			attributesNs: { 'http://ns': { name: 'test' } }
		} as unknown as EditV2
		expect(isSetAttributesEdit(edit)).toBe(true)
	})

	it('GIVEN an edit without element property WHEN called THEN returns false', () => {
		const edit = {
			node: document.createElement('div')
		} as unknown as EditV2
		expect(isSetAttributesEdit(edit)).toBe(false)
	})

	it('GIVEN an edit with element but without attributes or attributesNs WHEN called THEN returns false', () => {
		const edit = {
			element: document.createElement('div')
		} as unknown as EditV2
		expect(isSetAttributesEdit(edit)).toBe(false)
	})
})
