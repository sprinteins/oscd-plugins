import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createFunctionInsertEdits } from './function-creation'
import type {
	BayType,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types/ssd-types'
import { ssdImportStore } from '../../stores/ssd-import.store.svelte'

vi.mock('../../stores/ssd-import.store.svelte', () => ({
	ssdImportStore: {
		getFunctionTemplate: vi.fn()
	}
}))

describe('createFunctionInsertEdits', () => {
	let mockDocument: Document
	let mockScdBay: Element

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<Bay xmlns="http://www.iec.ch/61850/2003/SCL"><ConnectivityNode name="CN1"/></Bay>',
			'application/xml'
		)
		mockScdBay = mockDocument.documentElement
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('GIVEN a bay type with no functions', () => {
		describe('WHEN createFunctionInsertEdits is called', () => {
			it('THEN should return an empty array', () => {
				// GIVEN
				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: []
				}

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				expect(result).toEqual([])
			})
		})
	})

	describe('GIVEN a bay type with a single function', () => {
		describe('WHEN the function template exists', () => {
			it('THEN should create one Insert edit with Function element', () => {
				// GIVEN
				const functionTemplate: FunctionTemplate = {
					uuid: 'func-template-uuid',
					name: 'ProtectionFunction',
					desc: 'Protection function description',
					lnodes: []
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue(
					functionTemplate
				)

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				expect(result).toHaveLength(1)
				expect(ssdImportStore.getFunctionTemplate).toHaveBeenCalledWith(
					'func-template-uuid'
				)
			})

			it('THEN should set correct attributes on Function element', () => {
				// GIVEN
				const functionTemplate: FunctionTemplate = {
					uuid: 'func-template-uuid',
					name: 'ProtectionFunction',
					desc: 'Protection function description',
					lnodes: []
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue(
					functionTemplate
				)

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				const insert = result[0]
				const functionElement = insert.node as Element

				expect(functionElement.tagName).toBe('Function')
				expect(functionElement.getAttribute('name')).toBe(
					'ProtectionFunction'
				)
				expect(functionElement.getAttribute('desc')).toBe(
					'Protection function description'
				)
				expect(functionElement.getAttribute('templateUuid')).toBe(
					'func-type-uuid-1'
				)
				expect(functionElement.getAttribute('originUuid')).toBe(
					'func-template-uuid'
				)
				expect(functionElement.getAttribute('uuid')).toMatch(
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
				)
			})

			it('THEN should not set desc attribute when description is not provided', () => {
				// GIVEN
				const functionTemplate: FunctionTemplate = {
					uuid: 'func-template-uuid',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue(
					functionTemplate
				)

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				const insert = result[0]
				const functionElement = insert.node as Element

				expect(functionElement.hasAttribute('desc')).toBe(false)
			})

			it('THEN should set correct insert parent and reference', () => {
				// GIVEN
				const functionTemplate: FunctionTemplate = {
					uuid: 'func-template-uuid',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue(
					functionTemplate
				)

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				const insert = result[0]
				const connectivityNode =
					mockScdBay.querySelector('ConnectivityNode')

				expect(insert.parent).toBe(mockScdBay)
				expect(insert.reference).toBe(connectivityNode)
			})
		})

		describe('WHEN the function template does not exist', () => {
			it('THEN should return empty array and log warning', () => {
				// GIVEN
				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'non-existent-template'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue(
					undefined
				)
				const consoleWarnSpy = vi
					.spyOn(console, 'warn')
					.mockImplementation(() => {})

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				expect(result).toEqual([])
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					'Function template non-existent-template not found'
				)
			})
		})
	})

	describe('GIVEN a bay type with multiple functions', () => {
		describe('WHEN all function templates exist', () => {
			it('THEN should create multiple Insert edits', () => {
				// GIVEN
				const functionTemplate1: FunctionTemplate = {
					uuid: 'func-template-uuid-1',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const functionTemplate2: FunctionTemplate = {
					uuid: 'func-template-uuid-2',
					name: 'ControlFunction',
					lnodes: []
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid-1'
						},
						{
							uuid: 'func-type-uuid-2',
							templateUuid: 'func-template-uuid-2'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate)
					.mockReturnValueOnce(functionTemplate1)
					.mockReturnValueOnce(functionTemplate2)

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				expect(result).toHaveLength(2)
				expect((result[0].node as Element).getAttribute('name')).toBe(
					'ProtectionFunction'
				)
				expect((result[1].node as Element).getAttribute('name')).toBe(
					'ControlFunction'
				)
			})
		})

		describe('WHEN some function templates do not exist', () => {
			it('THEN should only create Insert edits for existing templates', () => {
				// GIVEN
				const functionTemplate1: FunctionTemplate = {
					uuid: 'func-template-uuid-1',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid-1'
						},
						{
							uuid: 'func-type-uuid-2',
							templateUuid: 'non-existent-template'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate)
					.mockReturnValueOnce(functionTemplate1)
					.mockReturnValueOnce(undefined)

				vi.spyOn(console, 'warn').mockImplementation(() => {})

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				expect(result).toHaveLength(1)
				expect((result[0].node as Element).getAttribute('name')).toBe(
					'ProtectionFunction'
				)
			})
		})
	})

	describe('GIVEN a function template with LNodes', () => {
		describe('WHEN createFunctionInsertEdits is called', () => {
			it('THEN should create LNode child elements for each lnode template', () => {
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
						lnInst: '1',
						iedName: 'IED1'
					}
				]

				const functionTemplate: FunctionTemplate = {
					uuid: 'func-template-uuid',
					name: 'ProtectionFunction',
					lnodes: lnodeTemplates
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue(
					functionTemplate
				)

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocument,
					bayType,
					mockScdBay
				)

				// THEN
				const functionElement = result[0].node as Element
				const lnodeElements = Array.from(
					functionElement.querySelectorAll('LNode')
				)

				expect(lnodeElements).toHaveLength(2)
				expect(lnodeElements[0].getAttribute('lnClass')).toBe('XCBR')
				expect(lnodeElements[0].getAttribute('lnType')).toBe(
					'XCBR_Type1'
				)
				expect(lnodeElements[0].getAttribute('lnInst')).toBe('1')
				expect(lnodeElements[1].getAttribute('lnClass')).toBe('CSWI')
			})
		})
	})

	describe('GIVEN an SCD Bay without ConnectivityNode', () => {
		describe('WHEN createFunctionInsertEdits is called', () => {
			it('THEN should create Insert with null reference', () => {
				// GIVEN
				const mockDocWithoutCN = new DOMParser().parseFromString(
					'<Bay xmlns="http://www.iec.ch/61850/2003/SCL"></Bay>',
					'application/xml'
				)
				const mockBayWithoutCN = mockDocWithoutCN.documentElement

				const functionTemplate: FunctionTemplate = {
					uuid: 'func-template-uuid',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const bayType: BayType = {
					uuid: 'bay-uuid-1',
					name: 'TestBay',
					conductingEquipments: [],
					functions: [
						{
							uuid: 'func-type-uuid-1',
							templateUuid: 'func-template-uuid'
						}
					]
				}

				vi.mocked(ssdImportStore.getFunctionTemplate).mockReturnValue(
					functionTemplate
				)

				// WHEN
				const result = createFunctionInsertEdits(
					mockDocWithoutCN,
					bayType,
					mockBayWithoutCN
				)

				// THEN
				expect(result[0].reference).toBeNull()
				expect(result[0].parent).toBe(mockBayWithoutCN)
			})
		})
	})
})
