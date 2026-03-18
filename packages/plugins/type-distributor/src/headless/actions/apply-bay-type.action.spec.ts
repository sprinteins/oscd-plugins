import type { Insert, SetAttributes, XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	type EquipmentMatch,
	matchEquipmentForInitialApply,
	resolveMatchingContext
} from '@/headless/domain/matching'
import {
	buildEditForBayUpdate,
	buildEditsForEquipmentUpdates
} from '@/headless/scl/edits/bay-type-edits'
import {
	buildEditsForDataTypeTemplates,
	ensureDataTypeTemplates
} from '@/headless/scl/edits/data-type-edits'
import {
	buildInsertEditsForEqFunction,
	buildInsertEditsForFunction
} from '@/headless/scl/edits/function-edits'
import { ssdImportStore } from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils'
import type { BayType } from '../common-types'
import { applyBayType } from './apply-bay-type.action'

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
	buildEditForBayUpdate: vi.fn(),
	buildEditsForEquipmentUpdates: vi.fn()
}))

vi.mock('@/headless/scl/edits/function-edits', () => ({
	buildInsertEditsForEqFunction: vi.fn(),
	buildInsertEditsForFunction: vi.fn()
}))

vi.mock('@/headless/scl/edits/data-type-edits', () => ({
	ensureDataTypeTemplates: vi.fn(),
	buildEditsForDataTypeTemplates: vi.fn()
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
		vi.mocked(buildEditForBayUpdate).mockReturnValue({
			element: document.createElement('Bay')
		} as SetAttributes)
		vi.mocked(buildEditsForEquipmentUpdates).mockReturnValue([])
		vi.mocked(buildInsertEditsForEqFunction).mockReturnValue([])
		vi.mocked(buildInsertEditsForFunction).mockReturnValue([])
		vi.mocked(buildEditsForDataTypeTemplates).mockReturnValue([])
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
