import { describe, it, expect } from 'vitest'
import { createEquipmentUpdateEdits } from './equipment-updates'
import type { EquipmentMatch } from '../types'
import type {
	ConductingEquipmentType,
	ConductingEquipmentTemplate
} from '@/headless/common-types/ssd-types'
import type { SetAttributes } from '@openscd/oscd-api'

describe('createEquipmentUpdateEdits', () => {
	describe('GIVEN an empty array of equipment matches', () => {
		describe('WHEN createEquipmentUpdateEdits is called', () => {
			it('THEN should return an empty array', () => {
				// GIVEN
				const matches: EquipmentMatch[] = []

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				expect(result).toEqual([])
			})
		})
	})

	describe('GIVEN a single equipment match without terminals', () => {
		describe('WHEN createEquipmentUpdateEdits is called', () => {
			it('THEN should create one SetAttributes edit for the equipment', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					'<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="CB1" type="CBR"></ConductingEquipment>',
					'application/xml'
				)
				const scdElement = mockDocument.documentElement

				const bayTypeEquipment: ConductingEquipmentType = {
					uuid: 'equip-type-uuid-1',
					templateUuid: 'template-ref-uuid-1',
					virtual: false
				}

				const templateEquipment: ConductingEquipmentTemplate = {
					uuid: 'template-uuid-1',
					name: 'CircuitBreaker',
					type: 'CBR',
					terminals: [],
					eqFunctions: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment,
						templateEquipment
					}
				]

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				expect(result).toHaveLength(1)
				const update = result[0] as SetAttributes
				expect(update.element).toBe(scdElement)
				expect(update.attributes?.templateUuid).toBe('equip-type-uuid-1')
				expect(update.attributes?.originUuid).toBe('template-uuid-1')
				expect(update.attributes?.uuid).toMatch(
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
				)
			})
		})
	})

	describe('GIVEN equipment match with terminals without uuid', () => {
		describe('WHEN createEquipmentUpdateEdits is called', () => {
			it('THEN should create SetAttributes edits for equipment and all terminals', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					`<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="CB1">
						<Terminal name="T1" connectivityNode="CN1"/>
						<Terminal name="T2" connectivityNode="CN2"/>
					</ConductingEquipment>`,
					'application/xml'
				)
				const scdElement = mockDocument.documentElement

				const bayTypeEquipment: ConductingEquipmentType = {
					uuid: 'equip-type-uuid-1',
					templateUuid: 'template-ref-uuid-1',
					virtual: false
				}

				const templateEquipment: ConductingEquipmentTemplate = {
					uuid: 'template-uuid-1',
					name: 'CircuitBreaker',
					type: 'CBR',
					terminals: [],
					eqFunctions: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment,
						templateEquipment
					}
				]

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				expect(result).toHaveLength(3) // 1 equipment + 2 terminals

				const equipmentUpdate = result[0] as SetAttributes
				expect(equipmentUpdate.element).toBe(scdElement)

				const terminal1Update = result[1] as SetAttributes
				expect(terminal1Update.element.nodeName).toBe('Terminal')
				expect(terminal1Update.attributes?.uuid).toBeTruthy()

				const terminal2Update = result[2] as SetAttributes
				expect(terminal2Update.element.nodeName).toBe('Terminal')
				expect(terminal2Update.attributes?.uuid).toBeTruthy()
			})
		})
	})

	describe('GIVEN equipment match with terminals that have uuid', () => {
		describe('WHEN createEquipmentUpdateEdits is called', () => {
			it('THEN should not create updates for terminals with existing uuid', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					`<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="CB1">
						<Terminal name="T1" uuid="existing-uuid-1" connectivityNode="CN1"/>
						<Terminal name="T2" uuid="existing-uuid-2" connectivityNode="CN2"/>
					</ConductingEquipment>`,
					'application/xml'
				)
				const scdElement = mockDocument.documentElement

				const bayTypeEquipment: ConductingEquipmentType = {
					uuid: 'equip-type-uuid-1',
					templateUuid: 'template-ref-uuid-1',
					virtual: false
				}

				const templateEquipment: ConductingEquipmentTemplate = {
					uuid: 'template-uuid-1',
					name: 'CircuitBreaker',
					type: 'CBR',
					terminals: [],
					eqFunctions: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment,
						templateEquipment
					}
				]

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				expect(result).toHaveLength(1) // Only equipment update
			})
		})
	})

	describe('GIVEN equipment match with mixed terminals', () => {
		describe('WHEN createEquipmentUpdateEdits is called', () => {
			it('THEN should only create updates for terminals without uuid', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					`<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="CB1">
						<Terminal name="T1" uuid="existing-uuid-1" connectivityNode="CN1"/>
						<Terminal name="T2" connectivityNode="CN2"/>
						<Terminal name="T3" uuid="existing-uuid-3" connectivityNode="CN3"/>
						<Terminal name="T4" connectivityNode="CN4"/>
					</ConductingEquipment>`,
					'application/xml'
				)
				const scdElement = mockDocument.documentElement

				const bayTypeEquipment: ConductingEquipmentType = {
					uuid: 'equip-type-uuid-1',
					templateUuid: 'template-ref-uuid-1',
					virtual: false
				}

				const templateEquipment: ConductingEquipmentTemplate = {
					uuid: 'template-uuid-1',
					name: 'CircuitBreaker',
					type: 'CBR',
					terminals: [],
					eqFunctions: []
				}

				const matches: EquipmentMatch[] = [
					{
						scdElement,
						bayTypeEquipment,
						templateEquipment
					}
				]

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				expect(result).toHaveLength(3) // 1 equipment + 2 terminals (T2 and T4)

				const terminalUpdates = result.slice(1) as SetAttributes[]
				expect(
					terminalUpdates.every(
						(u) => u.element.nodeName === 'Terminal'
					)
				).toBe(true)
				expect(terminalUpdates.every((u) => u.attributes?.uuid)).toBe(
					true
				)
			})
		})
	})

	describe('GIVEN multiple equipment matches', () => {
		describe('WHEN createEquipmentUpdateEdits is called', () => {
			it('THEN should create updates for all equipment', () => {
				// GIVEN
				const mockDoc1 = new DOMParser().parseFromString(
					'<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="CB1"></ConductingEquipment>',
					'application/xml'
				)
				const mockDoc2 = new DOMParser().parseFromString(
					'<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="DIS1"></ConductingEquipment>',
					'application/xml'
				)

				const matches: EquipmentMatch[] = [
					{
						scdElement: mockDoc1.documentElement,
						bayTypeEquipment: {
							uuid: 'equip-1',
							templateUuid: 'template-1',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-1',
							name: 'CB',
							type: 'CBR',
							terminals: [],
							eqFunctions: []
						}
					},
					{
						scdElement: mockDoc2.documentElement,
						bayTypeEquipment: {
							uuid: 'equip-2',
							templateUuid: 'template-2',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-2',
							name: 'DIS',
							type: 'DIS',
							terminals: [],
							eqFunctions: []
						}
					}
				]

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				expect(result).toHaveLength(2)
				expect(
					(result[0] as SetAttributes).element.getAttribute('name')
				).toBe('CB1')
				expect(
					(result[1] as SetAttributes).element.getAttribute('name')
				).toBe('DIS1')
			})

			it('THEN should generate unique uuids for each equipment', () => {
				// GIVEN
				const mockDoc1 = new DOMParser().parseFromString(
					'<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="CB1"></ConductingEquipment>',
					'application/xml'
				)
				const mockDoc2 = new DOMParser().parseFromString(
					'<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="DIS1"></ConductingEquipment>',
					'application/xml'
				)

				const matches: EquipmentMatch[] = [
					{
						scdElement: mockDoc1.documentElement,
						bayTypeEquipment: {
							uuid: 'equip-1',
							templateUuid: 'template-1',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-1',
							name: 'CB',
							type: 'CBR',
							terminals: [],
							eqFunctions: []
						}
					},
					{
						scdElement: mockDoc2.documentElement,
						bayTypeEquipment: {
							uuid: 'equip-2',
							templateUuid: 'template-2',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-2',
							name: 'DIS',
							type: 'DIS',
							terminals: [],
							eqFunctions: []
						}
					}
				]

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				const uuid1 = (result[0] as SetAttributes).attributes?.uuid
				const uuid2 = (result[1] as SetAttributes).attributes?.uuid
				expect(uuid1).not.toBe(uuid2)
			})
		})
	})

	describe('GIVEN equipment matches with complex terminal scenarios', () => {
		describe('WHEN createEquipmentUpdateEdits is called', () => {
			it('THEN should handle each equipment independently', () => {
				// GIVEN
				const mockDoc1 = new DOMParser().parseFromString(
					`<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="CB1">
						<Terminal name="T1" connectivityNode="CN1"/>
					</ConductingEquipment>`,
					'application/xml'
				)
				const mockDoc2 = new DOMParser().parseFromString(
					`<ConductingEquipment xmlns="http://www.iec.ch/61850/2003/SCL" name="DIS1">
						<Terminal name="T1" uuid="existing-uuid" connectivityNode="CN1"/>
						<Terminal name="T2" connectivityNode="CN2"/>
					</ConductingEquipment>`,
					'application/xml'
				)

				const matches: EquipmentMatch[] = [
					{
						scdElement: mockDoc1.documentElement,
						bayTypeEquipment: {
							uuid: 'equip-1',
							templateUuid: 'template-1',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-1',
							name: 'CB',
							type: 'CBR',
							terminals: [],
							eqFunctions: []
						}
					},
					{
						scdElement: mockDoc2.documentElement,
						bayTypeEquipment: {
							uuid: 'equip-2',
							templateUuid: 'template-2',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-uuid-2',
							name: 'DIS',
							type: 'DIS',
							terminals: [],
							eqFunctions: []
						}
					}
				]

				// WHEN
				const result = createEquipmentUpdateEdits(matches)

				// THEN
				// Equipment 1: 1 equipment + 1 terminal = 2
				// Equipment 2: 1 equipment + 1 terminal (T2, T1 has uuid) = 2
				// Total: 4
				expect(result).toHaveLength(4)
			})
		})
	})
})
