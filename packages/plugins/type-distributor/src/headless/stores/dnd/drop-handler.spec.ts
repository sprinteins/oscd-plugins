import type { Insert, SetAttributes, XMLEditor } from '@openscd/oscd-editor'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyBayType as applyBayTypeAction } from '@/headless/actions'
import { getDocumentAndEditor } from '@/headless/utils/get-document-and-Editor'
import { bayStore } from '../bay.store.svelte'
import { ssdImportStore } from '../ssd-import.store.svelte'
import {
	applyBayType,
	commitEdits,
	generateCommitTitle,
	shouldApplyBayType
} from './drop-handler'

vi.mock('../ssd-import.store.svelte', () => ({
	ssdImportStore: {
		selectedBayType: null as string | null
	}
}))

vi.mock('../bay-types.utils', () => ({
	getBayTypeWithTemplates: vi.fn()
}))

vi.mock('../bay.store.svelte', () => ({
	bayStore: {
		assignedBayTypeUuid: null as string | null,
		selectedBay: null as string | null,
		manualMatchingConfirmed: false
	}
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

vi.mock('@/headless/actions', () => ({
	applyBayType: vi.fn().mockReturnValue([])
}))

vi.mock('@/headless/utils/get-document-and-Editor', () => ({
	getDocumentAndEditor: vi.fn()
}))

vi.mock('@/headless/scl', () => ({
	createMultipleLNodesInAccessPoint: vi.fn()
}))

describe('drop-handler', () => {
	const mockLNodes = [
		{
			lnClass: 'XCBR',
			lnType: 'XCBR_Type1',
			lnInst: '1',
			iedName: undefined,
			ldInst: 'LD0'
		}
	]
	const mockFunction = {
		uuid: 'func-uuid',
		name: 'TestFunction',
		lnodes: mockLNodes
	}

	beforeEach(() => {
		ssdImportStore.selectedBayType = null
		bayStore.assignedBayTypeUuid = null
		bayStore.selectedBay = null
		bayStore.manualMatchingConfirmed = false
		vi.clearAllMocks()
	})

	describe('shouldApplyBayType', () => {
		it('GIVEN assignedBayTypeUuid exists WHEN shouldApplyBayType THEN returns false', () => {
			const result = shouldApplyBayType({
				assignedBayTypeUuid: 'existing-uuid',
				selectedBayType: 'selected-bay-type',
				validationResult: { isValid: true, errors: [] },
				manualMatchingConfirmed: false
			})

			expect(result).toBe(false)
		})

		it('GIVEN no selectedBayType WHEN shouldApplyBayType THEN returns false', () => {
			const result = shouldApplyBayType({
				assignedBayTypeUuid: null,
				selectedBayType: null,
				validationResult: { isValid: true, errors: [] },
				manualMatchingConfirmed: false
			})

			expect(result).toBe(false)
		})

		it('GIVEN no validationResult WHEN shouldApplyBayType THEN returns false', () => {
			const result = shouldApplyBayType({
				assignedBayTypeUuid: null,
				selectedBayType: 'selected-bay-type',
				validationResult: null,
				manualMatchingConfirmed: false
			})

			expect(result).toBe(false)
		})

		it('GIVEN valid result without manual matching required WHEN shouldApplyBayType THEN returns true', () => {
			const result = shouldApplyBayType({
				assignedBayTypeUuid: null,
				selectedBayType: 'selected-bay-type',
				validationResult: {
					isValid: true,
					requiresManualMatching: false,
					errors: []
				},
				manualMatchingConfirmed: false
			})

			expect(result).toBe(true)
		})

		it('GIVEN manual matching required but not confirmed WHEN shouldApplyBayType THEN returns false', () => {
			const result = shouldApplyBayType({
				assignedBayTypeUuid: null,
				selectedBayType: 'selected-bay-type',
				validationResult: {
					isValid: true,
					requiresManualMatching: true,
					errors: []
				},
				manualMatchingConfirmed: false
			})

			expect(result).toBe(false)
		})

		it('GIVEN manual matching required and confirmed WHEN shouldApplyBayType THEN returns true', () => {
			const result = shouldApplyBayType({
				assignedBayTypeUuid: null,
				selectedBayType: 'selected-bay-type',
				validationResult: {
					isValid: true,
					requiresManualMatching: true,
					errors: []
				},
				manualMatchingConfirmed: true
			})

			expect(result).toBe(true)
		})
	})

	describe('applyBayType', () => {
		it('GIVEN no bay selected WHEN applyBayType THEN throws error', () => {
			// GIVEN
			bayStore.selectedBay = null

			// WHEN / THEN
			expect(() => applyBayType()).toThrowError(
				'[DnD] No bay selected to apply bay type to'
			)
		})

		it('GIVEN bay is selected WHEN applyBayType THEN calls action without resetting matching state', () => {
			// GIVEN
			bayStore.selectedBay = 'Bay-1'
			bayStore.manualMatchingConfirmed = true

			// WHEN
			const matches = applyBayType()

			// THEN
			expect(matches).toEqual(expect.any(Array))
			expect(applyBayTypeAction).toHaveBeenCalledWith('Bay-1')
			// State is preserved so an undo can restore the user back to their matching context
			expect(bayStore.manualMatchingConfirmed).toBe(true)
		})
	})

	describe('generateCommitTitle', () => {
		it('GIVEN didApplyBayType is false WHEN generateCommitTitle THEN returns base title format', () => {
			// GIVEN
			const didApplyBayType = false

			// WHEN
			const commitTitle = generateCommitTitle({
				lNodes: mockLNodes,
				functionName: mockFunction.name,
				targetSIedName: 'targetSied',
				didApplyBayType
			})

			// THEN
			expect(commitTitle).toBe(
				'Assign XCBR from TestFunction to IED targetSied'
			)
		})

		it('GIVEN didApplyBayType is true WHEN generateCommitTitle THEN returns title with bay type info', () => {
			// GIVEN
			const didApplyBayType = true

			// WHEN
			const commitTitle = generateCommitTitle({
				lNodes: mockLNodes,
				functionName: mockFunction.name,
				targetSIedName: 'targetSied',
				didApplyBayType
			})

			// THEN
			expect(commitTitle).toBe(
				'Assign BayType "Unknown" to Bay "Unknown" + Assign XCBR from TestFunction to IED targetSied'
			)
		})

		it('GIVEN multiple lNodes WHEN didApplyBayType is false THEN uses "N LNodes" format', () => {
			const multipleLNodes = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1',
					iedName: undefined,
					ldInst: 'LD0'
				},
				{
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '1',
					iedName: undefined,
					ldInst: 'LD0'
				}
			]

			const commitTitle = generateCommitTitle({
				lNodes: multipleLNodes,
				functionName: 'TestFunction',
				targetSIedName: 'targetSied',
				didApplyBayType: false
			})

			expect(commitTitle).toBe(
				'Assign 2 LNodes from TestFunction to IED targetSied'
			)
		})

		it('GIVEN multiple lNodes WHEN didApplyBayType is true THEN uses "N LNodes" format with bay type info', () => {
			const multipleLNodes = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1',
					iedName: undefined,
					ldInst: 'LD0'
				},
				{
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '1',
					iedName: undefined,
					ldInst: 'LD0'
				}
			]

			const commitTitle = generateCommitTitle({
				lNodes: multipleLNodes,
				functionName: 'TestFunction',
				targetSIedName: 'targetSied',
				didApplyBayType: true
			})

			expect(commitTitle).toBe(
				'Assign BayType "Unknown" to Bay "Unknown" + Assign 2 LNodes from TestFunction to IED targetSied'
			)
		})
	})

	describe('commitEdits', () => {
		it('GIVEN squash is false WHEN commitEdits called THEN calls editor.commit with only title', () => {
			const mockCommit = vi.fn()
			vi.mocked(getDocumentAndEditor).mockReturnValue({
				doc: {} as XMLDocument,
				editor: { commit: mockCommit } as unknown as XMLEditor
			})
			const edits: (Insert | SetAttributes)[] = []

			commitEdits({ edits, title: 'My Title', squash: false })

			expect(mockCommit).toHaveBeenCalledWith(edits, {
				title: 'My Title'
			})
		})

		it('GIVEN squash is true WHEN commitEdits called THEN calls editor.commit with title and squash: true', () => {
			const mockCommit = vi.fn()
			vi.mocked(getDocumentAndEditor).mockReturnValue({
				doc: {} as XMLDocument,
				editor: { commit: mockCommit } as unknown as XMLEditor
			})
			const edits: (Insert | SetAttributes)[] = []

			commitEdits({ edits, title: 'My Title', squash: true })

			expect(mockCommit).toHaveBeenCalledWith(edits, {
				title: 'My Title',
				squash: true
			})
		})
	})
})
