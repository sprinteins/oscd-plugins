import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createIedWithAccessPoints } from './create-ied-with-access-points.action'
import { buildEditsForCreateIedWithAccessPoints } from '../scl'
import { getEditor } from '../utils'
import type { XMLEditor } from '@openscd/oscd-editor'

vi.mock('../scl', () => ({
	buildEditsForCreateIedWithAccessPoints: vi.fn()
}))

vi.mock('../utils', () => ({
	getEditor: vi.fn()
}))

describe('createIedWithAccessPoints', () => {
	const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
	const ied = { name: 'TestIED', description: 'Test', isNew: true }

	beforeEach(() => {
		vi.mocked(getEditor).mockReturnValue(mockEditor)
		vi.mocked(buildEditsForCreateIedWithAccessPoints).mockReturnValue([])
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('GIVEN a single access point', () => {
		it('WHEN createIedWithAccessPoints is called THEN commits with IED and AP name in the title', () => {
			const accessPoints = [{ name: 'P1', description: '' }]

			createIedWithAccessPoints(ied, accessPoints)

			expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
				title: 'Create IED "TestIED" with Access Point "P1"'
			})
		})
	})

	describe('GIVEN multiple access points', () => {
		it('WHEN createIedWithAccessPoints is called THEN commits with IED name and count in the title', () => {
			const accessPoints = [
				{ name: 'P1', description: '' },
				{ name: 'P2', description: '' }
			]

			createIedWithAccessPoints(ied, accessPoints)

			expect(mockEditor.commit).toHaveBeenCalledWith(expect.anything(), {
				title: 'Create IED "TestIED" with 2 Access Points'
			})
		})
	})
})
