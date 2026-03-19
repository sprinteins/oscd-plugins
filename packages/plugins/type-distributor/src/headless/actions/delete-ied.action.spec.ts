import type { XMLEditor } from '@openscd/oscd-editor/dist/XMLEditor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEditForDeleteEmptyIed } from '../scl/edits'
import { getEditor } from '../utils'
import { deleteEmptyIed } from './delete-ied.action'

vi.mock('../scl/edits', () => ({
	buildEditForDeleteEmptyIed: vi.fn()
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('deleteEmptyIed', () => {
	const mockEditor = { commit: vi.fn() } as unknown as XMLEditor

	beforeEach(() => {
		vi.mocked(getEditor).mockReturnValue(mockEditor)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN buildEditForDeleteEmptyIed returns null WHEN deleteEmptyIed is called THEN does not commit', () => {
		vi.mocked(buildEditForDeleteEmptyIed).mockReturnValue(null)

		deleteEmptyIed('IED_A')

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN a valid edit WHEN deleteEmptyIed is called THEN commits with the IED name in the title', () => {
		const mockEdit = { node: document.createElement('IED') }
		vi.mocked(buildEditForDeleteEmptyIed).mockReturnValue(mockEdit)

		deleteEmptyIed('IED_A')

		expect(mockEditor.commit).toHaveBeenCalledWith(mockEdit, {
			title: 'Delete IED IED_A'
		})
	})
})
