import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SvelteMap } from 'svelte/reactivity'
import type { BayType, LNodeTemplate } from '@/headless/common-types'
import type { Insert } from '@openscd/oscd-api'
import type { XMLEditor } from '@openscd/oscd-editor'
import { getDocumentAndEditor } from '@/headless/utils'
import { matchEquipment } from './matching'
import {
	buildEditForBayUpdate,
	buildInsertEditsForEqFunction,
	buildInsertEditsForFunction,
	buildEditsForEquipmentUpdates,
} from './scd-edits'
import { ensureDataTypeTemplates } from './scd-edits/data-types/ensure-data-type-templates'
import { buildEditsForDataTypeTemplates } from './scd-edits/data-types'
import {
	ssdImportStore,
	equipmentMatchingStore,
	bayStore
} from '@/headless/stores'
import { applyBayTypeSelection } from './applyBayTypeSelection'

vi.mock('@/headless/utils', () => ({
	getDocumentAndEditor: vi.fn()
}))

vi.mock('./matching', () => ({
	matchEquipment: vi.fn()
}))

vi.mock('./scd-edits', () => ({
	buildEditForBayUpdate: vi.fn(),
	buildEditsForEquipmentUpdates: vi.fn(),
	buildInsertEditsForEqFunction: vi.fn(),
	buildInsertEditsForFunction: vi.fn()
}))

vi.mock('./scd-edits/data-types/ensure-data-type-templates', () => ({
	ensureDataTypeTemplates: vi.fn()
}))

vi.mock('./scd-edits/data-types', () => ({
	buildEditsForDataTypeTemplates: vi.fn()
}))

vi.mock('@/headless/stores', () => ({
	ssdImportStore: {
		bayTypes: [],
		selectedBayType: null,
		getFunctionTemplate: vi.fn()
	},
	equipmentMatchingStore: {
		manualMatches: new SvelteMap()
	},
	bayStore: {
		scdBay: null,
		assignedBayType: null,
		equipmentMatches: []
	}
}))

describe('applyBayTypeSelection', () => {
	let mockDoc: Document
	let mockEditor: XMLEditor
	let mockScdBay: Element
	let mockBayType: BayType
	let mockDataTypeTemplates: Element

	beforeEach(() => {
		vi.clearAllMocks()

		mockDoc = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation>
					<VoltageLevel>
						<Bay name="Bay1">
							<ConductingEquipment name="CB1" type="CBR"/>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		const scdBay = mockDoc.querySelector('Bay')
		if (!scdBay) {
			throw new Error('Missing Bay element in test XML')
		}
		mockScdBay = scdBay
		mockEditor = { commit: vi.fn() } as unknown as XMLEditor

		mockDataTypeTemplates = mockDoc.createElement('DataTypeTemplates')

		mockBayType = {
			uuid: 'baytype-uuid-1',
			name: 'BayType1',
			conductingEquipments: [
				{
					uuid: 'ce1',
					templateUuid: 'template1',
					virtual: false
				}
			],
			functions: []
		}

		vi.mocked(getDocumentAndEditor).mockReturnValue({
			doc: mockDoc,
			editor: mockEditor
		})
	})

	describe('GIVEN no BayType is selected', () => {
		describe('WHEN applyBayTypeSelection is called', () => {
			it('THEN should throw error about missing BayType selection', () => {
				// GIVEN
				ssdImportStore.selectedBayType = null
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				// WHEN / THEN
				expect(() => applyBayTypeSelection('Bay1')).toThrow(
					'No BayType selected'
				)
				expect(matchEquipment).not.toHaveBeenCalled()
				expect(mockEditor.commit).not.toHaveBeenCalled()
			})
		})
	})

	describe('GIVEN selected BayType does not exist', () => {
		describe('WHEN applyBayTypeSelection is called', () => {
			it('THEN should throw error about BayType not found', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'non-existent-uuid'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				// WHEN / THEN
				expect(() => applyBayTypeSelection('Bay1')).toThrow(
					'BayType "non-existent-uuid" not found'
				)
				expect(matchEquipment).not.toHaveBeenCalled()
				expect(mockEditor.commit).not.toHaveBeenCalled()
			})
		})
	})

	describe('GIVEN no Bay is selected in SCD', () => {
		describe('WHEN applyBayTypeSelection is called', () => {
			it('THEN should throw error about missing Bay in SCD', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = null

				// WHEN / THEN
				expect(() => applyBayTypeSelection('Bay1')).toThrow(
					'No Bay selected in SCD'
				)
				expect(matchEquipment).not.toHaveBeenCalled()
				expect(mockEditor.commit).not.toHaveBeenCalled()
			})
		})
	})

	describe('GIVEN a valid BayType selection', () => {
		describe('WHEN edits are created and committed', () => {
			it('THEN should include DataTypeTemplates creation and correct title', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				const manualMatches = new SvelteMap<string, string>([
					['CB1', 'template1']
				])
				equipmentMatchingStore.manualMatches = manualMatches

				const mockDTSCreationEdit: Insert = {
					parent: mockDoc.documentElement,
					node: mockDataTypeTemplates,
					reference: null
				}

				vi.mocked(matchEquipment).mockReturnValue([])
				vi.mocked(buildEditForBayUpdate).mockReturnValue({
					element: mockScdBay,
					attributes: {},
					attributesNS: {}
				})
				vi.mocked(buildEditsForEquipmentUpdates).mockReturnValue([])
				vi.mocked(buildInsertEditsForEqFunction).mockReturnValue([])
				vi.mocked(buildInsertEditsForFunction).mockReturnValue([])
				vi.mocked(buildEditsForDataTypeTemplates).mockReturnValue([])
				vi.mocked(ensureDataTypeTemplates).mockReturnValue({
					element: mockDataTypeTemplates,
					edit: mockDTSCreationEdit
				})

				// WHEN
				applyBayTypeSelection('MyCustomBay')

				// THEN
				expect(matchEquipment).toHaveBeenCalledWith(
					mockScdBay,
					mockBayType,
					manualMatches
				)
				expect(mockEditor.commit).toHaveBeenCalledWith(
					expect.arrayContaining([mockDTSCreationEdit]),
					{
						title: 'Assign BayType "BayType1" to Bay "MyCustomBay"'
					}
				)
			})
		})
	})

	describe('GIVEN LNode templates on equipment and functions', () => {
		describe('WHEN applyBayTypeSelection is called', () => {
			it('THEN should collect all LNode templates for insertion', () => {
				// GIVEN
				const equipmentLNodes: LNodeTemplate[] = [
					{
						uuid: 'ln1',
						lnClass: 'XCBR',
						lnType: 'XCBR_Type1',
						lnInst: '1'
					}
				]

				const functionLNodes: LNodeTemplate[] = [
					{
						uuid: 'ln2',
						lnClass: 'CSWI',
						lnType: 'CSWI_Type1',
						lnInst: '1'
					}
				]

				mockBayType.functions = [
					{
						uuid: 'func1',
						templateUuid: 'func-template1'
					}
				]

				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				const conductingEquipment = mockScdBay.querySelector(
					'ConductingEquipment'
				)
				if (!conductingEquipment) {
					throw new Error(
						'Missing ConductingEquipment element in test XML'
					)
				}
				const mockMatches = [
					{
						scdElement: conductingEquipment,
						bayTypeEquipment: mockBayType.conductingEquipments[0],
						templateEquipment: {
							uuid: 'template1',
							type: 'CBR',
							name: 'CB1',
							lnodes: [],
							eqFunctions: [
								{
									uuid: 'eqf1',
									name: 'EqFunc1',
									lnodes: equipmentLNodes
								}
							]
						}
					}
				]

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue({
					uuid: 'func-template1',
					name: 'Function1',
					lnodes: functionLNodes
				})

				vi.mocked(matchEquipment).mockReturnValue(mockMatches)
				vi.mocked(buildEditForBayUpdate).mockReturnValue({
					element: mockScdBay,
					attributes: {},
					attributesNS: {}
				})
				vi.mocked(buildEditsForEquipmentUpdates).mockReturnValue([])
				vi.mocked(buildInsertEditsForEqFunction).mockReturnValue([])
				vi.mocked(buildInsertEditsForFunction).mockReturnValue([])
				vi.mocked(buildEditsForDataTypeTemplates).mockReturnValue([])
				vi.mocked(ensureDataTypeTemplates).mockReturnValue({
					element: mockDataTypeTemplates,
					edit: null
				})

				// WHEN
				applyBayTypeSelection('Bay1')

				// THEN
				expect(ssdImportStore.getFunctionTemplate).toHaveBeenCalledWith(
					'func-template1'
				)
				expect(buildEditsForDataTypeTemplates).toHaveBeenCalledWith(
					mockDoc,
					mockDataTypeTemplates,
					[...equipmentLNodes, ...functionLNodes]
				)
			})
		})
	})
})
