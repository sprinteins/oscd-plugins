import type { Insert, XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEditsForDeleteAccessPoint } from '../scl/edits/'
import { bayStore } from '../stores'
import { getEditor } from '../utils'
import { deleteAccessPointFromIed } from './delete-access-point.action'

vi.mock('../scl/edits/', () => ({
	buildEditsForDeleteAccessPoint: vi.fn()
}))

vi.mock('../stores', () => ({
	bayStore: {
		scdBay: null as Element | null
	}
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('deleteAccessPointFromIed', () => {
	let mockEditor = { commit: vi.fn() } as unknown as XMLEditor

	const makeAccessPoint = (name?: string): Element => {
		const el = document.createElement('AccessPoint')
		if (name) el.setAttribute('name', name)
		return el
	}

	beforeEach(() => {
		mockEditor = { commit: vi.fn() } as unknown as XMLEditor
		vi.mocked(getEditor).mockReturnValue(mockEditor)
		vi.mocked(buildEditsForDeleteAccessPoint).mockReturnValue([
			{ node: document.createElement('AccessPoint') } as unknown as Insert
		])
		bayStore.scdBay = document.createElement('Bay')
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN hasLNodes is true AND no bay is selected WHEN deleteAccessPointFromIed is called THEN returns without committing', () => {
		bayStore.scdBay = null

		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint('AP1'),
			hasLNodes: true
		})

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN hasLNodes is false AND no bay is selected WHEN deleteAccessPointFromIed is called THEN proceeds to commit', () => {
		bayStore.scdBay = null

		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint('AP1'),
			hasLNodes: false
		})

		expect(mockEditor.commit).toHaveBeenCalled()
	})

	it('GIVEN no edits are generated WHEN deleteAccessPointFromIed is called THEN does not commit', () => {
		vi.mocked(buildEditsForDeleteAccessPoint).mockReturnValue([])

		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint('AP1'),
			hasLNodes: false
		})

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN a named access point WHEN deleteAccessPointFromIed is called THEN commits with the AP name in the title', () => {
		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint('AP1'),
			hasLNodes: false
		})

		expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
			title: 'Delete AccessPoint AP1 from IED_A'
		})
	})

	it('GIVEN an access point without a name WHEN deleteAccessPointFromIed is called THEN commits with (unnamed) in the title', () => {
		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint(),
			hasLNodes: false
		})

		expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
			title: 'Delete AccessPoint (unnamed) from IED_A'
		})
	})
})
