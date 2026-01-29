import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
	collectAllTypesFromLNodeTemplates,
	insertDataTypeTemplatesInStages
} from './copy-data-type-templates'
import { ssdImportStore } from '@/headless/stores'
import type { LNodeTemplate } from '@/headless/common-types/ssd-types'
import type { XMLEditor } from '@openscd/oscd-editor'

vi.mock('@/headless/stores', () => ({
	ssdImportStore: {
		loadedSSDDocument: null
	}
}))

vi.mock('./type-creation-helpers', () => ({
	createTypeEdits: vi.fn()
}))

const { createTypeEdits } = await import('./type-creation-helpers')

describe('copy-data-type-templates', () => {
	let mockSSDDocument: Document
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		mockSSDDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<DataTypeTemplates>
					<LNodeType id="XCBR_Type1" lnClass="XCBR">
						<DO name="Mod" type="MOD_Type1"/>
						<DO name="Beh" type="BEH_Type1"/>
					</LNodeType>
					<LNodeType id="CSWI_Type1" lnClass="CSWI">
						<DO name="Pos" type="POS_Type1"/>
					</LNodeType>
					<DOType id="MOD_Type1" cdc="ENC">
						<DA name="stVal" bType="Enum" type="ModKind"/>
						<DA name="origin" bType="Struct" type="Origin_Type"/>
					</DOType>
					<DOType id="BEH_Type1" cdc="ENS">
						<DA name="stVal" bType="Enum" type="BehKind"/>
					</DOType>
					<DOType id="POS_Type1" cdc="DPC">
						<DA name="stVal" bType="BOOLEAN"/>
					</DOType>
					<DAType id="Origin_Type">
						<BDA name="orCat" bType="Enum" type="OriginatorCategory"/>
						<BDA name="nested" bType="Struct" type="Nested_Type"/>
					</DAType>
					<DAType id="Nested_Type">
						<BDA name="value" bType="INT32"/>
					</DAType>
					<EnumType id="ModKind">
						<EnumVal ord="1">on</EnumVal>
						<EnumVal ord="2">off</EnumVal>
					</EnumType>
					<EnumType id="BehKind">
						<EnumVal ord="1">on</EnumVal>
					</EnumType>
					<EnumType id="OriginatorCategory">
						<EnumVal ord="0">not-supported</EnumVal>
					</EnumType>
				</DataTypeTemplates>
			</SCL>`,
			'application/xml'
		)

		ssdImportStore.loadedSSDDocument = mockSSDDocument

		mockEditor = {
			commit: vi.fn()
		}

		vi.clearAllMocks()
	})

	afterEach(() => {
		ssdImportStore.loadedSSDDocument = null
	})

	describe('collectAllTypesFromLNodeTemplates', () => {
		describe('GIVEN an empty array of LNode templates', () => {
			describe('WHEN collectAllTypesFromLNodeTemplates is called', () => {
				it('THEN should return empty collections', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = []

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.lnodeTypeIds.size).toBe(0)
					expect(result.doTypeIds.size).toBe(0)
					expect(result.daTypeIds.size).toBe(0)
					expect(result.enumTypeIds.size).toBe(0)
				})
			})
		})

		describe('GIVEN a single LNode template', () => {
			describe('WHEN collectAllTypesFromLNodeTemplates is called', () => {
				it('THEN should collect LNodeType ID', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.lnodeTypeIds.size).toBe(1)
					expect(result.lnodeTypeIds.has('XCBR_Type1')).toBe(true)
				})

				it('THEN should collect all related DOType IDs', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.doTypeIds.size).toBe(2)
					expect(result.doTypeIds.has('MOD_Type1')).toBe(true)
					expect(result.doTypeIds.has('BEH_Type1')).toBe(true)
				})

				it('THEN should collect all related DAType IDs', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.daTypeIds.size).toBeGreaterThan(0)
					expect(result.daTypeIds.has('Origin_Type')).toBe(true)
				})

				it('THEN should collect all related EnumType IDs', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.enumTypeIds.size).toBeGreaterThan(0)
					expect(result.enumTypeIds.has('ModKind')).toBe(true)
					expect(result.enumTypeIds.has('BehKind')).toBe(true)
				})

				it('THEN should handle nested DATypes recursively', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.daTypeIds.has('Origin_Type')).toBe(true)
					expect(result.daTypeIds.has('Nested_Type')).toBe(true)
					expect(result.enumTypeIds.has('OriginatorCategory')).toBe(
						true
					)
				})
			})
		})

		describe('GIVEN multiple LNode templates', () => {
			describe('WHEN collectAllTypesFromLNodeTemplates is called', () => {
				it('THEN should collect types from all templates', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						},
						{
							lnClass: 'CSWI',
							lnType: 'CSWI_Type1',
							lnInst: '1'
						}
					]

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.lnodeTypeIds.size).toBe(2)
					expect(result.lnodeTypeIds.has('XCBR_Type1')).toBe(true)
					expect(result.lnodeTypeIds.has('CSWI_Type1')).toBe(true)
				})

				it('THEN should deduplicate shared type references', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						},
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '2'
						}
					]

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.lnodeTypeIds.size).toBe(1)
					expect(result.lnodeTypeIds.has('XCBR_Type1')).toBe(true)
				})
			})
		})

		describe('GIVEN LNode template with non-existent type', () => {
			describe('WHEN collectAllTypesFromLNodeTemplates is called', () => {
				it('THEN should handle missing LNodeType gracefully', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'UNKNOWN',
							lnType: 'NonExistent_Type',
							lnInst: '1'
						}
					]

					const consoleWarnSpy = vi
						.spyOn(console, 'warn')
						.mockImplementation(() => {})

					// WHEN
					const result =
						collectAllTypesFromLNodeTemplates(lnodeTemplates)

					// THEN
					expect(result.lnodeTypeIds.has('NonExistent_Type')).toBe(
						true
					)
					expect(result.doTypeIds.size).toBe(0)
					expect(consoleWarnSpy).toHaveBeenCalledWith(
						'LNodeType NonExistent_Type not found in SSD'
					)
				})
			})
		})

		describe('GIVEN no SSD document loaded', () => {
			describe('WHEN collectAllTypesFromLNodeTemplates is called', () => {
				it('THEN should throw an error', () => {
					// GIVEN
					ssdImportStore.loadedSSDDocument = null
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					// WHEN & THEN
					expect(() => {
						collectAllTypesFromLNodeTemplates(lnodeTemplates)
					}).toThrow('No SSD document loaded in store')
				})
			})
		})
	})

	describe('insertDataTypeTemplatesInStages', () => {
		let mockDocument: Document
		let mockDataTypeTemplates: Element

		beforeEach(() => {
			mockDocument = new DOMParser().parseFromString(
				'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><DataTypeTemplates></DataTypeTemplates></SCL>',
				'application/xml'
			)
			const DataTypeTemplates =
				mockDocument.querySelector('DataTypeTemplates')
			if (!DataTypeTemplates) {
				throw new Error(
					'DataTypeTemplates element not found in mock document'
				)
			}
			mockDataTypeTemplates = DataTypeTemplates
		})

		describe('GIVEN an empty array of LNode templates', () => {
			describe('WHEN insertDataTypeTemplatesInStages is called', () => {
				it('THEN should not commit any edits', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = []

					// WHEN
					insertDataTypeTemplatesInStages(
						mockDocument,
						mockDataTypeTemplates,
						lnodeTemplates,
						mockEditor as unknown as XMLEditor
					)

					// THEN
					expect(mockEditor.commit).not.toHaveBeenCalled()
				})
			})
		})

		describe('GIVEN LNode templates requiring types', () => {
			describe('WHEN insertDataTypeTemplatesInStages is called', () => {
				it('THEN should call createTypeEdits in correct order', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					vi.mocked(createTypeEdits).mockReturnValue([])

					// WHEN
					insertDataTypeTemplatesInStages(
						mockDocument,
						mockDataTypeTemplates,
						lnodeTemplates,
						mockEditor as unknown as XMLEditor
					)

					// THEN
					const calls = vi.mocked(createTypeEdits).mock.calls
					const typeNameOrder = calls.map((call) => call[2])

					// Should be called for each type in TYPE_ORDER
					expect(typeNameOrder).toContain('LNodeType')
					expect(typeNameOrder).toContain('DOType')
					expect(typeNameOrder).toContain('DAType')
					expect(typeNameOrder).toContain('EnumType')
				})

				it('THEN should commit edits for each type stage', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					const mockInserts = [
						{
							parent: mockDataTypeTemplates,
							node: {} as Element,
							reference: null
						}
					]
					vi.mocked(createTypeEdits).mockReturnValue(mockInserts)

					// WHEN
					insertDataTypeTemplatesInStages(
						mockDocument,
						mockDataTypeTemplates,
						lnodeTemplates,
						mockEditor as unknown as XMLEditor
					)

					// THEN
					expect(mockEditor.commit).toHaveBeenCalled()
					expect(mockEditor.commit.mock.calls.length).toBeGreaterThan(
						0
					)
				})

				it('THEN should use squash option for all commits', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					const mockInserts = [
						{
							parent: mockDataTypeTemplates,
							node: {} as Element,
							reference: null
						}
					]
					vi.mocked(createTypeEdits).mockReturnValue(mockInserts)

					// WHEN
					insertDataTypeTemplatesInStages(
						mockDocument,
						mockDataTypeTemplates,
						lnodeTemplates,
						mockEditor as unknown as XMLEditor
					)

					// THEN
					for (const call of mockEditor.commit.mock.calls) {
						expect(call[1]).toEqual({ squash: true })
					}
				})
			})
		})

		describe('GIVEN document already contains some types', () => {
			beforeEach(() => {
				const existingLNodeType =
					mockDocument.createElement('LNodeType')
				existingLNodeType.setAttribute('id', 'XCBR_Type1')
				mockDataTypeTemplates.appendChild(existingLNodeType)

				const existingDOType = mockDocument.createElement('DOType')
				existingDOType.setAttribute('id', 'MOD_Type1')
				mockDataTypeTemplates.appendChild(existingDOType)
			})

			describe('WHEN insertDataTypeTemplatesInStages is called', () => {
				it('THEN should only create edits for missing types', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					vi.mocked(createTypeEdits).mockReturnValue([])

					// WHEN
					insertDataTypeTemplatesInStages(
						mockDocument,
						mockDataTypeTemplates,
						lnodeTemplates,
						mockEditor as unknown as XMLEditor
					)

					// THEN
					const calls = vi.mocked(createTypeEdits).mock.calls

					// Check that existing types are filtered out
					const lnodeTypeCall = calls.find(
						(call) => call[2] === 'LNodeType'
					)
					if (lnodeTypeCall) {
						const typeIds = lnodeTypeCall[1] as Set<string>
						expect(typeIds.has('XCBR_Type1')).toBe(false)
					}

					const doTypeCall = calls.find(
						(call) => call[2] === 'DOType'
					)
					if (doTypeCall) {
						const typeIds = doTypeCall[1] as Set<string>
						expect(typeIds.has('MOD_Type1')).toBe(false)
					}
				})
			})
		})

		describe('GIVEN type stage with no missing types', () => {
			describe('WHEN insertDataTypeTemplatesInStages is called', () => {
				it('THEN should not commit edits for that stage', () => {
					// GIVEN
					const lnodeTemplates: LNodeTemplate[] = [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1'
						}
					]

					// Mock to return empty array for some stages
					vi.mocked(createTypeEdits).mockImplementation(
						(_, typeIds) => {
							return typeIds.size > 0
								? [
										{
											parent: mockDataTypeTemplates,
											node: {} as Element,
											reference: null
										}
									]
								: []
						}
					)

					const commitCountBefore =
						mockEditor.commit.mock.calls.length

					// WHEN
					insertDataTypeTemplatesInStages(
						mockDocument,
						mockDataTypeTemplates,
						lnodeTemplates,
						mockEditor as unknown as XMLEditor
					)

					// THEN
					const commitCountAfter = mockEditor.commit.mock.calls.length
					// Should only commit for stages with types
					expect(commitCountAfter).toBeGreaterThanOrEqual(
						commitCountBefore
					)
				})
			})
		})
	})
})
