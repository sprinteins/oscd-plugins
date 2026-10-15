import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEditsForDeleteLNFromAccessPoint } from '../scl/edits'
import { bayStore } from '../stores'
import { getEditor } from '../utils'
import { deleteLNFromAccessPoint } from './delete-ln.action'

vi.mock('../scl/edits', () => ({
	buildEditsForDeleteLNFromAccessPoint: vi.fn()
}))

vi.mock('../stores', () => ({
	bayStore: {
		scdBay: null as Element | null
	}
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('deleteLNFromAccessPoint', () => {
	const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
	const mockAccessPoint = document.createElement('AccessPoint')
	const ln = {
		lnClass: 'XCBR',
		lnType: 'XCBR001',
		inst: '1',
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

	it('GIVEN no edits are generated WHEN deleteLNFromAccessPoint is called THEN does not commit', () => {
		vi.mocked(buildEditsForDeleteLNFromAccessPoint).mockReturnValue([])

		deleteLNFromAccessPoint({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			ln
		})

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN valid edits WHEN deleteLNFromAccessPoint is called THEN commits with the LN class in the title', () => {
		const mockEdit = { node: document.createElement('LN') }
		vi.mocked(buildEditsForDeleteLNFromAccessPoint).mockReturnValue([
			mockEdit
		])

		deleteLNFromAccessPoint({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			ln
		})

		expect(mockEditor.commit).toHaveBeenCalledWith([mockEdit], {
			title: 'Delete LN XCBR'
		})
	})

	it('GIVEN valid input WHEN deleteLNFromAccessPoint is called THEN passes the correct params to the edit builder', () => {
		const mockBay = document.createElement('Bay')
		bayStore.scdBay = mockBay
		vi.mocked(buildEditsForDeleteLNFromAccessPoint).mockReturnValue([
			{ node: document.createElement('LNode') }
		])

		deleteLNFromAccessPoint({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			ln
		})

		expect(buildEditsForDeleteLNFromAccessPoint).toHaveBeenCalledWith({
			iedName: 'IED_A',
			accessPoint: mockAccessPoint,
			ln,
			selectedBay: mockBay
		})
	})
})
