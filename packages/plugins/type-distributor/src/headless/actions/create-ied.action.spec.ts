import type { Insert, XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEditForCreateIed } from '../scl'
import { getEditor } from '../utils'
import { createIed } from './create-ied.action'

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

	it('GIVEN IED data WHEN createIed is called THEN builds and commits the named edit', () => {
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
		expect(mockEditor.commit).toHaveBeenCalledWith([mockEdit], {
			title: 'Create IED "MyIED"'
		})
	})
})
