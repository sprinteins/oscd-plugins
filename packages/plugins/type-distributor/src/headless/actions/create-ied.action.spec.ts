import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createIed } from './create-ied.action'
import { buildEditForCreateIed } from '../scl'
import { getEditor } from '../utils'
import type { Insert, XMLEditor } from '@openscd/oscd-editor'

vi.mock('../scl', () => ({
	buildEditForCreateIed: vi.fn()
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('createIed', () => {
	const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
	const mockEdit = { node: document.createElement('IED') }

	beforeEach(() => {
		vi.mocked(getEditor).mockReturnValue(mockEditor)
		vi.mocked(buildEditForCreateIed).mockReturnValue([
			mockEdit
		] as unknown as Insert)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN IED data WHEN createIed is called THEN commits with the IED name in the title', () => {
		const ied = { name: 'TestIED', description: 'A test IED', isNew: true }

		createIed(ied)

		expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
			title: 'Create IED "TestIED"'
		})
	})

	it('GIVEN IED data WHEN createIed is called THEN builds the edit with the correct name and description', () => {
		const ied = {
			name: 'MyIED',
			description: 'My description',
			isNew: true
		}

		createIed(ied)

		expect(buildEditForCreateIed).toHaveBeenCalledWith(
			'MyIED',
			'My description'
		)
	})
})
