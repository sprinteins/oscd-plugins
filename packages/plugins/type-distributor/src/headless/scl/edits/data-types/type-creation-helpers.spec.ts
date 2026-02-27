import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildEditsForType } from './type-creation-helpers'
import { ssdImportStore } from '@/headless/stores'
import type { Insert } from '@openscd/oscd-api'
import { queryTypeReference } from '../../queries/data-type-refs-queries'

vi.mock('@/headless/stores', () => ({
	ssdImportStore: {
		loadedSSDDocument: null
	}
}))

vi.mock('../../queries/data-type-refs-queries', () => ({
	queryTypeReference: vi.fn()
}))

describe('type-creation-helpers', () => {
	let mockSSDDocument: Document
	let mockDataTypeTemplates: Element

	beforeEach(() => {
		mockSSDDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<DataTypeTemplates>
					<LNodeType id="TestLN1" lnClass="XCBR">
						<DO name="Mod" type="MOD_Type1"/>
					</LNodeType>
					<LNodeType id="TestLN2" lnClass="CSWI">
						<DO name="Pos" type="POS_Type1"/>
					</LNodeType>
					<DOType id="MOD_Type1" cdc="ENC">
						<DA name="stVal" bType="Enum" type="Mod"/>
					</DOType>
					<DOType id="POS_Type1" cdc="DPC">
						<DA name="stVal" bType="BOOLEAN"/>
					</DOType>
					<DAType id="Origin_Type">
						<BDA name="orCat" bType="Enum" type="OriginatorCategory"/>
					</DAType>
					<EnumType id="OriginatorCategory">
						<EnumVal ord="0">not-supported</EnumVal>
					</EnumType>
				</DataTypeTemplates>
			</SCL>`,
			'application/xml'
		)

		ssdImportStore.loadedSSDDocument = mockSSDDocument

		mockDataTypeTemplates = new DOMParser().parseFromString(
			'<DataTypeTemplates xmlns="http://www.iec.ch/61850/2003/SCL"></DataTypeTemplates>',
			'application/xml'
		).documentElement

		vi.clearAllMocks()
	})

	afterEach(() => {
		ssdImportStore.loadedSSDDocument = null
	})

	describe('buildEditsForType', () => {
		describe('GIVEN an empty set of type IDs', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should return an empty array', () => {
					// GIVEN
					const typeIds = new Set<string>()
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result).toEqual([])
				})
			})
		})

		describe('GIVEN a set with one LNodeType ID that exists in SSD', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should create one Insert edit', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1'])
					const mockReference = mockDataTypeTemplates.firstChild
					vi.mocked(queryTypeReference).mockReturnValue(mockReference)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result).toHaveLength(1)
					expect(result[0]).toHaveProperty('parent')
					expect(result[0]).toHaveProperty('node')
					expect(result[0]).toHaveProperty('reference')
				})

				it('THEN should clone the element from SSD', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					const insert = result[0] as Insert
					const clonedElement = insert.node as Element
					expect(clonedElement.tagName).toBe('LNodeType')
					expect(clonedElement.getAttribute('id')).toBe('TestLN1')
					expect(clonedElement.getAttribute('lnClass')).toBe('XCBR')
				})

				it('THEN should preserve all child elements', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					const clonedElement = result[0].node as Element
					const doElement = clonedElement.querySelector('DO')
					expect(doElement).toBeTruthy()
					expect(doElement?.getAttribute('name')).toBe('Mod')
					expect(doElement?.getAttribute('type')).toBe('MOD_Type1')
				})

				it('THEN should set correct parent', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result[0].parent).toBe(mockDataTypeTemplates)
				})

				it('THEN should call queryTypeReference with correct arguments', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(queryTypeReference).toHaveBeenCalledWith(
						mockDataTypeTemplates,
						'LNodeType'
					)
					expect(queryTypeReference).toHaveBeenCalledTimes(1)
				})

				it('THEN should use reference from queryTypeReference', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1'])
					const mockReference = { nodeType: 1 } as Node
					vi.mocked(queryTypeReference).mockReturnValue(mockReference)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result[0].reference).toBe(mockReference)
				})
			})
		})

		describe('GIVEN multiple type IDs that exist in SSD', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should create multiple Insert edits', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1', 'TestLN2'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result).toHaveLength(2)
				})

				it('THEN should clone all specified elements', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1', 'TestLN2'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					const ids = result.map((r) =>
						(r.node as Element).getAttribute('id')
					)
					expect(ids).toContain('TestLN1')
					expect(ids).toContain('TestLN2')
				})

				it('THEN should use same reference for all inserts', () => {
					// GIVEN
					const typeIds = new Set(['TestLN1', 'TestLN2'])
					const mockReference = { nodeType: 1 } as Node
					vi.mocked(queryTypeReference).mockReturnValue(mockReference)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result[0].reference).toBe(mockReference)
					expect(result[1].reference).toBe(mockReference)
				})
			})
		})

		describe('GIVEN type IDs for DOType elements', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should clone DOType elements correctly', () => {
					// GIVEN
					const typeIds = new Set(['MOD_Type1', 'POS_Type1'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'DOType'
					)

					// THEN
					expect(result).toHaveLength(2)
					const clonedElements = result.map((r) => r.node as Element)
					expect(clonedElements[0].tagName).toBe('DOType')
					expect(clonedElements[1].tagName).toBe('DOType')
				})

				it('THEN should preserve attributes and children of DOType', () => {
					// GIVEN
					const typeIds = new Set(['MOD_Type1'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'DOType'
					)

					// THEN
					const clonedElement = result[0].node as Element
					expect(clonedElement.getAttribute('id')).toBe('MOD_Type1')
					expect(clonedElement.getAttribute('cdc')).toBe('ENC')
					expect(clonedElement.querySelector('DA')).toBeTruthy()
				})
			})
		})

		describe('GIVEN type IDs for DAType elements', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should clone DAType elements correctly', () => {
					// GIVEN
					const typeIds = new Set(['Origin_Type'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'DAType'
					)

					// THEN
					expect(result).toHaveLength(1)
					const clonedElement = result[0].node as Element
					expect(clonedElement.tagName).toBe('DAType')
					expect(clonedElement.getAttribute('id')).toBe('Origin_Type')
				})
			})
		})

		describe('GIVEN type IDs for EnumType elements', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should clone EnumType elements correctly', () => {
					// GIVEN
					const typeIds = new Set(['OriginatorCategory'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'EnumType'
					)

					// THEN
					expect(result).toHaveLength(1)
					const clonedElement = result[0].node as Element
					expect(clonedElement.tagName).toBe('EnumType')
					expect(clonedElement.getAttribute('id')).toBe(
						'OriginatorCategory'
					)
					expect(clonedElement.querySelector('EnumVal')).toBeTruthy()
				})
			})
		})

		describe('GIVEN a type ID that does not exist in SSD', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should skip non-existent types', () => {
					// GIVEN
					const typeIds = new Set(['NonExistent_Type'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result).toEqual([])
				})

				it('THEN should only clone existing types when mixed with non-existent', () => {
					// GIVEN
					const typeIds = new Set([
						'TestLN1',
						'NonExistent_Type',
						'TestLN2'
					])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN
					const result = buildEditsForType(
						mockDataTypeTemplates,
						typeIds,
						'LNodeType'
					)

					// THEN
					expect(result).toHaveLength(2)
					const ids = result.map((r) =>
						(r.node as Element).getAttribute('id')
					)
					expect(ids).toContain('TestLN1')
					expect(ids).toContain('TestLN2')
					expect(ids).not.toContain('NonExistent_Type')
				})
			})
		})

		describe('GIVEN no SSD document loaded', () => {
			describe('WHEN buildEditsForType is called', () => {
				it('THEN should throw an error', () => {
					// GIVEN
					ssdImportStore.loadedSSDDocument = null
					const typeIds = new Set(['TestLN1'])
					vi.mocked(queryTypeReference).mockReturnValue(null)

					// WHEN & THEN
					expect(() => {
						buildEditsForType(
							mockDataTypeTemplates,
							typeIds,
							'LNodeType'
						)
					}).toThrow('No SSD document loaded in store')
				})
			})
		})
	})
})
