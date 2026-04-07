import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildUpdatesForRenameAccessPoint } from '../scl/edits'
import { assignedLNodesStore } from '../stores'
import { getEditor } from '../utils'
import { renameAccessPoint } from './rename-access-point.action'

vi.mock('../scl/edits', () => ({
	buildUpdatesForRenameAccessPoint: vi.fn()
}))

vi.mock('../stores', () => ({
	assignedLNodesStore: { rebuild: vi.fn() }
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('renameAccessPoint', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	const mockEdit = {
		element: document.createElement('AccessPoint'),
		attributes: {},
		attributesNS: {}
	}

	beforeEach(() => {
		mockEditor = { commit: vi.fn() }
		vi.mocked(getEditor).mockReturnValue(mockEditor as unknown as XMLEditor)
		vi.mocked(buildUpdatesForRenameAccessPoint).mockReturnValue([
			mockEdit
		] as never)
	})

	afterEach(() => {
		vi.clearAllMocks()
		vi.restoreAllMocks()
	})

	it('GIVEN valid params WHEN renameAccessPoint is called THEN commits with correct title', () => {
		const accessPoint = document.createElement('AccessPoint')

		renameAccessPoint({
			accessPoint,
			iedName: 'IED_A',
			oldName: 'AP1',
			newName: 'AP2',
			newDescription: ''
		})

		expect(mockEditor.commit).toHaveBeenCalledWith([mockEdit], {
			title: 'Rename Access Point "AP1" to "AP2" in S-IED "IED_A"'
		})
	})

	it('GIVEN valid params WHEN renameAccessPoint is called THEN passes all params to buildUpdatesForRenameAccessPoint', () => {
		const accessPoint = document.createElement('AccessPoint')

		renameAccessPoint({
			accessPoint,
			iedName: 'IED_A',
			oldName: 'AP1',
			newName: 'AP2',
			newDescription: 'My AP'
		})

		expect(buildUpdatesForRenameAccessPoint).toHaveBeenCalledWith({
			accessPoint,
			iedName: 'IED_A',
			oldName: 'AP1',
			newName: 'AP2',
			newDescription: 'My AP'
		})
	})

	it('GIVEN valid params WHEN renameAccessPoint is called THEN rebuilds the assignedLNodes store', () => {
		const accessPoint = document.createElement('AccessPoint')

		renameAccessPoint({
			accessPoint,
			iedName: 'IED_A',
			oldName: 'AP1',
			newName: 'AP2',
			newDescription: ''
		})

		expect(assignedLNodesStore.rebuild).toHaveBeenCalled()
	})

	it('GIVEN no edits are produced WHEN renameAccessPoint is called THEN does not commit', () => {
		vi.mocked(buildUpdatesForRenameAccessPoint).mockReturnValue([])
		const accessPoint = document.createElement('AccessPoint')

		renameAccessPoint({
			accessPoint,
			iedName: 'IED_A',
			oldName: 'AP1',
			newName: 'AP2',
			newDescription: ''
		})

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN no edits are produced WHEN renameAccessPoint is called THEN does not rebuild the store', () => {
		vi.mocked(buildUpdatesForRenameAccessPoint).mockReturnValue([])
		const accessPoint = document.createElement('AccessPoint')

		renameAccessPoint({
			accessPoint,
			iedName: 'IED_A',
			oldName: 'AP1',
			newName: 'AP2',
			newDescription: ''
		})

		expect(assignedLNodesStore.rebuild).not.toHaveBeenCalled()
	})
})
