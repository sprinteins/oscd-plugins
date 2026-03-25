import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyBayType as applyBayTypeAction } from '@/headless/actions'
import { bayStore } from '../bay.store.svelte'
import { equipmentMatchingStore } from '../equipment-matching.store.svelte'
import { ssdImportStore } from '../ssd-import.store.svelte'
import {
	applyBayType,
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
isReadyToApply: false,
assignedBayTypeUuid: null as string | null,
selectedBay: null as string | null,
manualMatchingConfirmed: false
}
}))

vi.mock('../equipment-matching.store.svelte', () => ({
equipmentMatchingStore: {
validationResult: null as null | {
isValid?: boolean
requiresManualMatching?: boolean
},
reset: vi.fn()
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
		bayStore.isReadyToApply = false
		bayStore.manualMatchingConfirmed = false
		equipmentMatchingStore.validationResult = null
		vi.clearAllMocks()
	})

	describe('shouldApplyBayType', () => {
		it('GIVEN bayStore.isReadyToApply is false WHEN shouldApplyBayType THEN returns false', () => {
			// GIVEN
			bayStore.isReadyToApply = false

			// WHEN
			const result = shouldApplyBayType()

			// THEN
			expect(result).toBe(false)
		})

		it('GIVEN bayStore.isReadyToApply is true WHEN shouldApplyBayType THEN returns true', () => {
			// GIVEN
			bayStore.isReadyToApply = true

			// WHEN
			const result = shouldApplyBayType()

			// THEN
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

		it('GIVEN bay is selected WHEN applyBayType THEN calls action and resets state', () => {
			// GIVEN
			bayStore.selectedBay = 'Bay-1'
			bayStore.manualMatchingConfirmed = true

			// WHEN
			const matches = applyBayType()

			// THEN
			expect(matches).toEqual(expect.any(Array))
			expect(applyBayTypeAction).toHaveBeenCalledWith('Bay-1')
			expect(bayStore.manualMatchingConfirmed).toBe(false)
			expect(equipmentMatchingStore.reset).toHaveBeenCalled()
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
	})
})
