import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildUpdatesForRenameAccessPoint, buildUpdatesForRenameIed } from '../scl/edits'
import { assignedLNodesStore, bayStore } from '../stores'
import { getEditor } from '../utils'
import { renameIedAndAccessPoint } from './rename-ied-and-access-point.action'

vi.mock('../scl/edits', () => ({
	buildUpdatesForRenameIed: vi.fn(),
	buildUpdatesForRenameAccessPoint: vi.fn()
}))

vi.mock('../stores', () => ({
	bayStore: { scdBay: null as Element | null },
	assignedLNodesStore: { rebuild: vi.fn() }
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('renameIedAndAccessPoint', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	const iedEdit = { element: document.createElement('IED'), attributes: {}, attributesNS: {} }
	const apEdit = { element: document.createElement('AccessPoint'), attributes: {}, attributesNS: {} }

	const defaultParams = () => ({
		iedElement: document.createElement('IED'),
		accessPoint: document.createElement('AccessPoint'),
		oldIedName: 'OLD_IED',
		newIedName: 'NEW_IED',
		newIedDescription: '',
		oldApName: 'AP1',
		newApName: 'AP2',
		newApDescription: ''
	})

	beforeEach(() => {
		mockEditor = { commit: vi.fn() }
		vi.mocked(getEditor).mockReturnValue(mockEditor as unknown as XMLEditor)
		vi.mocked(buildUpdatesForRenameIed).mockReturnValue([iedEdit] as never)
		vi.mocked(buildUpdatesForRenameAccessPoint).mockReturnValue([apEdit] as never)
		bayStore.scdBay = null
	})

	afterEach(() => {
		vi.clearAllMocks()
		vi.restoreAllMocks()
	})

	it('GIVEN valid params WHEN called THEN commits all IED and AP edits together', () => {
		renameIedAndAccessPoint(defaultParams())

		expect(mockEditor.commit).toHaveBeenCalledWith(
			[iedEdit, apEdit],
			expect.any(Object)
		)
	})

	it('GIVEN valid params WHEN called THEN commits with a title containing both old and new names', () => {
		renameIedAndAccessPoint(defaultParams())

		expect(mockEditor.commit).toHaveBeenCalledWith(
			expect.anything(),
			{ title: 'Rename S-IED "OLD_IED" to "NEW_IED" and Access Point "AP1" to "AP2"' }
		)
	})

	it('GIVEN valid params WHEN called THEN passes the new IED name as iedName to AP edits builder', () => {
		const params = defaultParams()

		renameIedAndAccessPoint(params)

		expect(buildUpdatesForRenameAccessPoint).toHaveBeenCalledWith(
			expect.objectContaining({ iedName: 'NEW_IED' })
		)
	})

	it('GIVEN valid params WHEN called THEN passes the bay from the store to IED edits builder', () => {
		const bay = document.createElement('Bay')
		bayStore.scdBay = bay
		const params = defaultParams()

		renameIedAndAccessPoint(params)

		expect(buildUpdatesForRenameIed).toHaveBeenCalledWith(
			expect.objectContaining({ selectedBay: bay })
		)
	})

	it('GIVEN valid params WHEN called THEN rebuilds the assignedLNodes store', () => {
		renameIedAndAccessPoint(defaultParams())

		expect(assignedLNodesStore.rebuild).toHaveBeenCalled()
	})

	it('GIVEN both edit builders return empty arrays WHEN called THEN does not commit', () => {
		vi.mocked(buildUpdatesForRenameIed).mockReturnValue([])
		vi.mocked(buildUpdatesForRenameAccessPoint).mockReturnValue([])

		renameIedAndAccessPoint(defaultParams())

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN both edit builders return empty arrays WHEN called THEN does not rebuild the store', () => {
		vi.mocked(buildUpdatesForRenameIed).mockReturnValue([])
		vi.mocked(buildUpdatesForRenameAccessPoint).mockReturnValue([])

		renameIedAndAccessPoint(defaultParams())

		expect(assignedLNodesStore.rebuild).not.toHaveBeenCalled()
	})
})
