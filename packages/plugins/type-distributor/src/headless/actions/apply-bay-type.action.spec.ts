import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { applyBayType } from './apply-bay-type.action'
import { getDocumentAndEditor } from '@/headless/utils'
import { ssdImportStore } from '@/headless/stores'
import {
	resolveMatchingContext,
	matchEquipmentForInitialApply,
	type EquipmentMatch
} from '@/headless/domain/matching'
import {
	buildUpdateForBay,
	buildEditsForEquipmentUpdates
} from '@/headless/scl/edits/bay-type-edits'
import {
	buildInsertsForEqFunction,
	buildInsertsForFunction
} from '@/headless/scl/edits/function-edits'
import {
	ensureDataTypeTemplates,
	buildInsertsForDataTypeTemplates
} from '@/headless/scl/edits/data-type-edits'
import type { Insert, SetAttributes, XMLEditor } from '@openscd/oscd-editor'
import type { BayType } from '../common-types'

vi.mock('@/headless/utils', () => ({
	getDocumentAndEditor: vi.fn()
}))

vi.mock('@/headless/stores', () => ({
	equipmentMatchingStore: {
		manualMatches: new Map<string, string>()
	},
	ssdImportStore: {
		selectedBayType: 'bt-1',
		bayTypes: [],
		conductingEquipmentTemplates: [],
		functionTemplates: [],
		loadedSSDDocument: null as XMLDocument | null
	},
	bayStore: {
		scdBay: null
	}
}))

vi.mock('@/headless/domain/matching', () => ({
	resolveMatchingContext: vi.fn(),
	matchEquipmentForInitialApply: vi.fn()
}))

vi.mock('@/headless/scl/edits/bay-type-edits', () => ({
	buildUpdateForBay: vi.fn(),
	buildEditsForEquipmentUpdates: vi.fn()
}))

vi.mock('@/headless/scl/edits/function-edits', () => ({
	buildInsertsForEqFunction: vi.fn(),
	buildInsertsForFunction: vi.fn()
}))

vi.mock('@/headless/scl/edits/data-type-edits', () => ({
	ensureDataTypeTemplates: vi.fn(),
	buildInsertsForDataTypeTemplates: vi.fn()
}))

describe('applyBayType', () => {
	const mockScdBay = document.createElement('Bay')
	const mockBayType = {
		uuid: 'bt-1',
		name: 'TestBayType',
		conductingEquipments: [],
		functions: []
	}
	const mockDoc = new DOMParser().parseFromString('<SCL/>', 'application/xml')
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	const mockMatches = [
		{
			scdElement: document.createElement('ConductingEquipment'),
			bayTypeEquipment: {
				uuid: 'ce-1',
				templateUuid: 'tmpl-1',
				virtual: false
			},
			templateEquipment: {
				uuid: 'tmpl-1',
				name: 'CB1',
				type: 'CBR',
				terminals: [],
				eqFunctions: []
			}
		}
	]

	beforeEach(() => {
		mockEditor = { commit: vi.fn() }
		vi.mocked(getDocumentAndEditor).mockReturnValue({
			doc: mockDoc as XMLDocument,
			editor: mockEditor as unknown as XMLEditor
		})
		vi.mocked(resolveMatchingContext).mockReturnValue({
			scdBay: mockScdBay,
			bayType: mockBayType as BayType
		})
		vi.mocked(matchEquipmentForInitialApply).mockReturnValue(
			mockMatches as EquipmentMatch[]
		)
		vi.mocked(buildUpdateForBay).mockReturnValue({
			element: document.createElement('Bay')
		} as SetAttributes)
		vi.mocked(buildEditsForEquipmentUpdates).mockReturnValue([])
		vi.mocked(buildInsertsForEqFunction).mockReturnValue([])
		vi.mocked(buildInsertsForFunction).mockReturnValue([])
		vi.mocked(buildInsertsForDataTypeTemplates).mockReturnValue([])
		vi.mocked(ensureDataTypeTemplates).mockReturnValue({
			element: document.createElement('DataTypeTemplates'),
			edit: null
		})
		ssdImportStore.loadedSSDDocument = mockDoc as XMLDocument
		ssdImportStore.functionTemplates = []
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN no SSD document is loaded WHEN applyBayType is called THEN throws an error', () => {
		ssdImportStore.loadedSSDDocument = null

		expect(() => applyBayType('Bay1')).toThrow('No SSD document loaded')
	})

	describe('GIVEN a valid setup with a loaded SSD document', () => {
		it('WHEN applyBayType is called THEN commits edits with bay type name and bay name in the title', () => {
			applyBayType('Bay1')

			expect(mockEditor.commit).toHaveBeenCalledWith(expect.any(Array), {
				title: 'Assign BayType "TestBayType" to Bay "Bay1"'
			})
		})

		it('WHEN applyBayType is called THEN returns the equipment matches', () => {
			const result = applyBayType('Bay1')

			expect(result).toBe(mockMatches)
		})

		it('WHEN applyBayType is called THEN the dtsCreationEdit is NOT included when absent', () => {
			vi.mocked(ensureDataTypeTemplates).mockReturnValue({
				element: document.createElement('DataTypeTemplates'),
				edit: null
			})

			applyBayType('Bay1')

			expect(mockEditor.commit).toHaveBeenCalledWith(
				expect.not.arrayContaining([null]),
				expect.anything()
			)
		})

		it('WHEN applyBayType is called AND dtsCreationEdit exists THEN includes it in committed edits', () => {
			const dtsCreationEdit = {
				node: document.createElement('DataTypeTemplates')
			}
			vi.mocked(ensureDataTypeTemplates).mockReturnValue({
				element: document.createElement('DataTypeTemplates'),
				edit: dtsCreationEdit as unknown as Insert
			})

			applyBayType('Bay1')

			expect(mockEditor.commit).toHaveBeenCalledWith(
				expect.arrayContaining([dtsCreationEdit]),
				expect.anything()
			)
		})
	})
})
