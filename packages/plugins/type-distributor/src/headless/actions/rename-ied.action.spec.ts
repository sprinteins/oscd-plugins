import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildUpdatesForRenameIed } from '../scl/edits'
import { assignedLNodesStore, bayStore } from '../stores'
import { getEditor } from '../utils'
import { renameIed } from './rename-ied.action'

vi.mock('../scl/edits', () => ({
	buildUpdatesForRenameIed: vi.fn()
}))

vi.mock('../stores', () => ({
	bayStore: { scdBay: null as Element | null },
	assignedLNodesStore: { rebuild: vi.fn() }
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('renameIed', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	const mockEdit = { element: document.createElement('IED'), attributes: {}, attributesNS: {} }

	beforeEach(() => {
		mockEditor = { commit: vi.fn() }
		vi.mocked(getEditor).mockReturnValue(mockEditor as unknown as XMLEditor)
		vi.mocked(buildUpdatesForRenameIed).mockReturnValue([mockEdit] as never)
		bayStore.scdBay = null
	})

	afterEach(() => {
		vi.clearAllMocks()
		vi.restoreAllMocks()
	})

	it('GIVEN valid params WHEN renameIed is called THEN commits with correct title', () => {
		const iedElement = document.createElement('IED')

		renameIed({ iedElement, oldName: 'OLD', newName: 'NEW', newDescription: '' })

		expect(mockEditor.commit).toHaveBeenCalledWith(
			[mockEdit],
			{ title: 'Rename S-IED from "OLD" to "NEW"' }
		)
	})

	it('GIVEN valid params WHEN renameIed is called THEN calls buildUpdatesForRenameIed with the bay from store', () => {
		const iedElement = document.createElement('IED')
		const bay = document.createElement('Bay')
		bayStore.scdBay = bay

		renameIed({ iedElement, oldName: 'OLD', newName: 'NEW', newDescription: 'Desc' })

		expect(buildUpdatesForRenameIed).toHaveBeenCalledWith({
			iedElement,
			oldName: 'OLD',
			newName: 'NEW',
			newDescription: 'Desc',
			selectedBay: bay
		})
	})

	it('GIVEN valid params WHEN renameIed is called THEN rebuilds the assignedLNodes store', () => {
		const iedElement = document.createElement('IED')

		renameIed({ iedElement, oldName: 'OLD', newName: 'NEW', newDescription: '' })

		expect(assignedLNodesStore.rebuild).toHaveBeenCalled()
	})

	it('GIVEN no edits are produced WHEN renameIed is called THEN does not commit', () => {
		vi.mocked(buildUpdatesForRenameIed).mockReturnValue([])
		const iedElement = document.createElement('IED')

		renameIed({ iedElement, oldName: 'OLD', newName: 'NEW', newDescription: '' })

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN no edits are produced WHEN renameIed is called THEN does not rebuild the store', () => {
		vi.mocked(buildUpdatesForRenameIed).mockReturnValue([])
		const iedElement = document.createElement('IED')

		renameIed({ iedElement, oldName: 'OLD', newName: 'NEW', newDescription: '' })

		expect(assignedLNodesStore.rebuild).not.toHaveBeenCalled()
	})
})
