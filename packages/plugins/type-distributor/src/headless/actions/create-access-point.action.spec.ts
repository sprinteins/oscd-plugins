import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEditsForCreateAccessPoint } from '../scl'
import { getEditor } from '../utils'
import { createAccessPoint } from './create-access-point.action'

vi.mock('../scl', () => ({
	buildEditsForCreateAccessPoint: vi.fn()
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('createAccessPoint', () => {
	const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
	const ied = { name: 'TestIED', description: '', isNew: false }

	beforeEach(() => {
		vi.mocked(getEditor).mockReturnValue(mockEditor)
		vi.mocked(buildEditsForCreateAccessPoint).mockReturnValue([])
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('GIVEN a single access point', () => {
		it('WHEN createAccessPoint is called THEN commits with the AP and IED name in the title', () => {
			const accessPoints = [{ name: 'AP-1', description: '' }]

			createAccessPoint(ied, accessPoints)

			expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
				title: 'Add Access Point "AP-1" to IED "TestIED"'
			})
		})
	})

	describe('GIVEN multiple access points', () => {
		it('WHEN createAccessPoint is called THEN commits with the count in the title', () => {
			const accessPoints = [
				{ name: 'AP-1', description: '' },
				{ name: 'AP-2', description: '' },
				{ name: 'AP-3', description: '' }
			]

			createAccessPoint(ied, accessPoints)

			expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
				title: 'Add 3 Access Points to IED "TestIED"'
			})
		})
	})
})
