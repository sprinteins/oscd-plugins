import type { Insert, XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEditsForDeleteAccessPoint } from '../scl/edits/'
import { getEditor } from '../utils'
import { deleteAccessPointFromIed } from './delete-access-point.action'

vi.mock('../scl/edits/', () => ({
	buildEditsForDeleteAccessPoint: vi.fn()
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
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN an AccessPoint WHEN deleteAccessPointFromIed is called THEN commits without requiring Bay selection', () => {
		const accessPoint = makeAccessPoint('AP1')

		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint
		})

		expect(buildEditsForDeleteAccessPoint).toHaveBeenCalledWith({
			accessPoint,
			iedName: 'IED_A'
		})
		expect(mockEditor.commit).toHaveBeenCalled()
	})

	it('GIVEN no edits are generated WHEN deleteAccessPointFromIed is called THEN does not commit', () => {
		vi.mocked(buildEditsForDeleteAccessPoint).mockReturnValue([])

		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint('AP1')
		})

		expect(mockEditor.commit).not.toHaveBeenCalled()
	})

	it('GIVEN a named access point WHEN deleteAccessPointFromIed is called THEN commits with the AP name in the title', () => {
		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint('AP1')
		})

		expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
			title: 'Delete AccessPoint AP1 from IED_A'
		})
	})

	it('GIVEN an access point without a name WHEN deleteAccessPointFromIed is called THEN commits with (unnamed) in the title', () => {
		deleteAccessPointFromIed({
			iedName: 'IED_A',
			accessPoint: makeAccessPoint()
		})

		expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
			title: 'Delete AccessPoint (unnamed) from IED_A'
		})
	})
})
