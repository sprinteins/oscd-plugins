import { describe, it, expect, beforeEach } from 'vitest'
import { createEqFunctionInsertEdits } from './eqfunction-creation'
import type { EquipmentMatch } from '@/headless/matching/types'
import type {
	EqFunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types/ssd-types'

describe('createEqFunctionInsertEdits', () => {
	let mockDocument: Document

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<root xmlns="http://www.iec.ch/61850/2003/SCL"></root>',
			'application/xml'
		)
	})

	describe('GIVEN an empty array of equipment matches', () => {
		describe('WHEN createEqFunctionInsertEdits is called', () => {
			it('THEN should return an empty array', () => {
				// GIVEN
				const matches: EquipmentMatch[] = []

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				expect(result).toEqual([])
			})
		})
	})

	describe('GIVEN equipment match with no EqFunctions', () => {
		describe('WHEN createEqFunctionInsertEdits is called', () => {
			it('THEN should return an empty array', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: []
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				expect(result).toEqual([])
			})
		})
	})

	describe('GIVEN equipment match with single EqFunction without LNodes', () => {
		describe('WHEN createEqFunctionInsertEdits is called', () => {
			it('THEN should create one Insert edit with EqFunction element', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)

				const eqFunctionTemplate: EqFunctionTemplate = {
					uuid: 'eqfunc-uuid',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: [eqFunctionTemplate]
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				expect(result).toHaveLength(1)
				const insert = result[0]
				expect(insert.parent).toBe(scdElement)
				expect((insert.node as Element).tagName).toBe('EqFunction')
			})

			it('THEN should set correct attributes on EqFunction element', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)

				const eqFunctionTemplate: EqFunctionTemplate = {
					uuid: 'eqfunc-uuid',
					name: 'ProtectionFunction',
					desc: 'Protection function description',
					lnodes: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: [eqFunctionTemplate]
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				const eqFunctionElement = result[0].node as Element
				expect(eqFunctionElement.getAttribute('name')).toBe(
					'ProtectionFunction'
				)
				expect(eqFunctionElement.getAttribute('uuid')).toMatch(
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
				)
			})

			it('THEN should set reference to null when no terminals exist', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)

				const eqFunctionTemplate: EqFunctionTemplate = {
					uuid: 'eqfunc-uuid',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: [eqFunctionTemplate]
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				expect(result[0].reference).toBeNull()
			})
		})
	})

	describe('GIVEN equipment match with terminals', () => {
		describe('WHEN createEqFunctionInsertEdits is called', () => {
			it('THEN should set reference to node after last terminal', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)
				const terminal1 = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'Terminal'
				)
				terminal1.setAttribute('name', 'T1')
				const terminal2 = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'Terminal'
				)
				terminal2.setAttribute('name', 'T2')
				scdElement.appendChild(terminal1)
				scdElement.appendChild(terminal2)

				const eqFunctionTemplate: EqFunctionTemplate = {
					uuid: 'eqfunc-uuid',
					name: 'ProtectionFunction',
					lnodes: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: [eqFunctionTemplate]
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				const expectedReference = terminal2.nextSibling
				expect(result[0].reference).toBe(expectedReference)
			})
		})
	})

	describe('GIVEN equipment match with EqFunction containing LNodes', () => {
		describe('WHEN createEqFunctionInsertEdits is called', () => {
			it('THEN should create LNode child elements for each lnode template', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)

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

				const eqFunctionTemplate: EqFunctionTemplate = {
					uuid: 'eqfunc-uuid',
					name: 'ProtectionFunction',
					lnodes: lnodeTemplates
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: [eqFunctionTemplate]
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				const eqFunctionElement = result[0].node as Element
				const lnodeElements = Array.from(
					eqFunctionElement.querySelectorAll('LNode')
				)

				expect(lnodeElements).toHaveLength(2)
				expect(lnodeElements[0].getAttribute('lnClass')).toBe('XCBR')
				expect(lnodeElements[1].getAttribute('lnClass')).toBe('CSWI')
				expect(lnodeElements[1].getAttribute('iedName')).toBe('IED1')
			})
		})
	})

	describe('GIVEN equipment match with multiple EqFunctions', () => {
		describe('WHEN createEqFunctionInsertEdits is called', () => {
			it('THEN should create multiple Insert edits', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)

				const eqFunctionTemplates: EqFunctionTemplate[] = [
					{
						uuid: 'eqfunc-uuid-1',
						name: 'ProtectionFunction',
						lnodes: []
					},
					{
						uuid: 'eqfunc-uuid-2',
						name: 'ControlFunction',
						lnodes: []
					}
				]

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: eqFunctionTemplates
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
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
	})

	describe('GIVEN multiple equipment matches with EqFunctions', () => {
		describe('WHEN createEqFunctionInsertEdits is called', () => {
			it('THEN should create Insert edits for all equipment', () => {
				// GIVEN
				const scdElement1 = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)
				scdElement1.setAttribute('name', 'CB1')

				const scdElement2 = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)
				scdElement2.setAttribute('name', 'DIS1')

				const matches: EquipmentMatch[] = [
					{
						scdElement: scdElement1,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid-1',
							templateUuid: 'template-ref-uuid-1',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-1',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: [
								{
									uuid: 'eqfunc-uuid-1',
									name: 'ProtectionFunction',
									lnodes: []
								}
							]
						}
					},
					{
						scdElement: scdElement2,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid-2',
							templateUuid: 'template-ref-uuid-2',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-2',
							name: 'DIS1',
							type: 'DIS',
							terminals: [],
							eqFunctions: [
								{
									uuid: 'eqfunc-uuid-2',
									name: 'IsolationFunction',
									lnodes: []
								},
								{
									uuid: 'eqfunc-uuid-3',
									name: 'ControlFunction',
									lnodes: []
								}
							]
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				expect(result).toHaveLength(3) // 1 from CB1 + 2 from DIS1
				expect(result[0].parent).toBe(scdElement1)
				expect(result[1].parent).toBe(scdElement2)
				expect(result[2].parent).toBe(scdElement2)
			})

			it('THEN should preserve namespace URI from parent element', () => {
				// GIVEN
				const scdElement = mockDocument.createElementNS(
					'http://www.iec.ch/61850/2003/SCL',
					'ConductingEquipment'
				)

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment: {
							uuid: 'equip-type-uuid',
							templateUuid: 'template-ref-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid',
							name: 'CB1',
							type: 'CBR',
							terminals: [],
							eqFunctions: [
								{
									uuid: 'eqfunc-uuid',
									name: 'ProtectionFunction',
									lnodes: []
								}
							]
						}
					}
				]

				// WHEN
				const result = createEqFunctionInsertEdits(
					mockDocument,
					matches
				)

				// THEN
				const eqFunctionElement = result[0].node as Element
				expect(eqFunctionElement.namespaceURI).toBe(
					'http://www.iec.ch/61850/2003/SCL'
				)
			})
		})
	})
})
