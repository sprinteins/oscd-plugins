import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEditsForDeleteLNodeFromAccessPoint } from '../scl/edits'
import { bayStore } from '../stores'
import { getEditor } from '../utils'
import { deleteLnodeFromAccessPoint } from './delete-lnode.action'

vi.mock('../scl/edits', () => ({
	buildEditsForDeleteLNodeFromAccessPoint: vi.fn()
}))

vi.mock('../stores', () => ({
	bayStore: {
		scdBay: null as Element | null
	}
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('deleteLnodeFromAccessPoint', () => {
	const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
	const mockAccessPoint = document.createElement('AccessPoint')
	const lnode = {
		lnClass: 'XCBR',
		lnType: 'XCBR001',
		lnInst: '1',
		ldInst: 'LD0',
		iedName: undefined as undefined
	}

	beforeEach(() => {
		vi.mocked(getEditor).mockReturnValue(mockEditor)
		bayStore.scdBay = document.createElement('Bay')
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN no edits are generated WHEN deleteLnodeFromAccessPoint is called THEN does not commit', () => {
		vi.mocked(buildEditsForDeleteLNodeFromAccessPoint).mockReturnValue([])

		deleteLnodeFromAccessPoint({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			lnode
		})

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN valid edits WHEN deleteLnodeFromAccessPoint is called THEN commits with the LNode class in the title', () => {
		const mockEdit = { node: document.createElement('LNode') }
		vi.mocked(buildEditsForDeleteLNodeFromAccessPoint).mockReturnValue([
			mockEdit
		])

		deleteLnodeFromAccessPoint({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			lnode
		})

		expect(mockEditor.commit).toHaveBeenCalledWith([mockEdit], {
			title: 'Delete LNode XCBR'
		})
	})

	it('GIVEN valid input WHEN deleteLnodeFromAccessPoint is called THEN passes the correct params to the edit builder', () => {
		const mockBay = document.createElement('Bay')
		bayStore.scdBay = mockBay
		vi.mocked(buildEditsForDeleteLNodeFromAccessPoint).mockReturnValue([
			{ node: document.createElement('LNode') }
		])

		deleteLnodeFromAccessPoint({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			lnode
		})

		expect(buildEditsForDeleteLNodeFromAccessPoint).toHaveBeenCalledWith({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			lNodeTemplate: {
				lnClass: lnode.lnClass,
				lnType: lnode.lnType,
				lnInst: lnode.lnInst,
				ldInst: lnode.ldInst
			},
			selectedBay: mockBay
		})
	})
})
