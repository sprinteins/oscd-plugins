import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { deleteLDevice } from './delete-ldevice.action'
import { buildEditsForDeleteLDevice } from '../scl/edits'
import { bayStore } from '../stores'
import { getEditor } from '../utils'
import type { XMLEditor } from '@openscd/oscd-editor'

vi.mock('../scl/edits', () => ({
	buildEditsForDeleteLDevice: vi.fn()
}))

vi.mock('../stores', () => ({
	bayStore: {
		scdBay: null as Element | null
	}
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('deleteLDevice', () => {
	const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
	const mockAccessPoint = document.createElement('AccessPoint')
	const ldInst = 'LD_Test'
	const iedName = 'IED_A'

	beforeEach(() => {
		vi.mocked(getEditor).mockReturnValue(mockEditor)
		bayStore.scdBay = document.createElement('Bay')
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN no edits are generated WHEN deleteLDevice is called THEN does not commit', () => {
		vi.mocked(buildEditsForDeleteLDevice).mockReturnValue([])

		deleteLDevice({
			iedName,
			accessPoint: mockAccessPoint,
			ldInst
		})

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN valid edits WHEN deleteLDevice is called THEN commits with the LDevice inst in the title', () => {
		const mockEdit = { node: document.createElement('LDevice') }
		vi.mocked(buildEditsForDeleteLDevice).mockReturnValue([mockEdit])

		deleteLDevice({
			iedName,
			accessPoint: mockAccessPoint,
			ldInst
		})

		expect(mockEditor.commit).toHaveBeenCalledWith([mockEdit], {
			title: 'Delete LDevice LD_Test'
		})
	})

	it('GIVEN valid input WHEN deleteLDevice is called THEN passes the correct params to the edit builder', () => {
		const mockBay = document.createElement('Bay')
		bayStore.scdBay = mockBay
		vi.mocked(buildEditsForDeleteLDevice).mockReturnValue([
			{ node: document.createElement('LDevice') }
		])

		deleteLDevice({
			iedName,
			accessPoint: mockAccessPoint,
			ldInst
		})

		expect(buildEditsForDeleteLDevice).toHaveBeenCalledWith({
			iedName,
			accessPoint: mockAccessPoint,
			ldInst,
			selectedBay: mockBay
		})
	})
})
