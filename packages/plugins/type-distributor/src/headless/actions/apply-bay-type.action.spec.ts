import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
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
		generalEquipmentTemplates: [],
		functionTemplates: [],
		loadedSSDDocument: null as XMLDocument | null
	},
	bayStore: {
		scdBay: null
	}
}))

const mockBayType: BayType = {
	uuid: 'bt-1',
	name: 'TestBayType',
	conductingEquipments: [],
	generalEquipments: [],
	functions: []
}

describe('applyBayType', () => {
	let mockDoc: XMLDocument
	let mockScdBay: Element
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		mockDoc = new DOMParser().parseFromString('<SCL/>', 'application/xml')
		mockScdBay = document.createElement('Bay')
		mockEditor = { commit: vi.fn() }

		vi.mocked(getDocumentAndEditor).mockReturnValue({
			doc: mockDoc as XMLDocument,
			editor: mockEditor as unknown as XMLEditor
		})

		ssdImportStore.selectedBayType = 'bt-1'
		ssdImportStore.bayTypes = [mockBayType]
		ssdImportStore.conductingEquipmentTemplates = []
		ssdImportStore.generalEquipmentTemplates = []
		ssdImportStore.functionTemplates = []
		ssdImportStore.loadedSSDDocument = mockDoc as XMLDocument
		bayStore.scdBay = mockScdBay
		equipmentMatchingStore.manualMatches.clear()
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

			expect(result).toEqual([])
		})

		it('WHEN the document already has DataTypeTemplates THEN no DataTypeTemplates creation edit is committed', () => {
			const docWithDts = new DOMParser().parseFromString(
				'<SCL><DataTypeTemplates/></SCL>',
				'application/xml'
			)
			vi.mocked(getDocumentAndEditor).mockReturnValue({
				doc: docWithDts as XMLDocument,
				editor: mockEditor as unknown as XMLEditor
			})
			ssdImportStore.loadedSSDDocument = docWithDts as XMLDocument

			applyBayType('Bay1')

			const [committedEdits] = vi.mocked(mockEditor.commit).mock.calls[0]
			const hasDtsInsert = committedEdits.some(
				(edit: unknown) =>
					edit !== null &&
					typeof edit === 'object' &&
					'node' in (edit as object) &&
					(edit as { node: Element }).node?.tagName ===
						'DataTypeTemplates'
			)
			expect(hasDtsInsert).toBe(false)
		})

		it('WHEN the document is missing DataTypeTemplates THEN a DataTypeTemplates creation edit is committed', () => {
			applyBayType('Bay1')

			const [committedEdits] = vi.mocked(mockEditor.commit).mock.calls[0]
			const hasDtsInsert = committedEdits.some(
				(edit: unknown) =>
					edit !== null &&
					typeof edit === 'object' &&
					'node' in (edit as object) &&
					(edit as { node: Element }).node?.tagName ===
						'DataTypeTemplates'
			)
			expect(hasDtsInsert).toBe(true)
		})
	})
})
