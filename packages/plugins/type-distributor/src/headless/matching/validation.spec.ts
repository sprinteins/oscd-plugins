import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { BayType, ConductingEquipmentTemplate } from '../types'
import { validateEquipmentMatch } from './validation'
import { ssdImportStore } from '../stores'

// Mock the stores
vi.mock('../stores', () => ({
	ssdImportStore: {
		getConductingEquipmentTemplate: vi.fn()
	}
}))

describe('validation - ambiguous type detection', () => {
	let mockSCDDocument: Document
	let scdBay: Element

	beforeEach(() => {
		// Create SCD document with a Bay containing multiple DIS equipment
		mockSCDDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation name="TestSubstation">
					<VoltageLevel name="TestVL">
						<Bay name="TestBay">
							<ConductingEquipment name="DIS1" type="DIS"/>
							<ConductingEquipment name="DIS2" type="DIS"/>
							<ConductingEquipment name="CBR1" type="CBR"/>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		const bay = mockSCDDocument.querySelector('Bay')
		if (!bay) throw new Error('Bay not found')
		scdBay = bay
	})

	it('should detect ambiguous types when multiple templates have same type but different names', () => {
		// Setup: BayType with two different DIS types
		const disconnectorTemplate: ConductingEquipmentTemplate = {
			uuid: 'disconnector-template-uuid',
			name: 'Disconnector',
			type: 'DIS',
			desc: 'Disconnector Equipment',
			terminals: [],
			eqFunctions: []
		}

		const earthSwitchTemplate: ConductingEquipmentTemplate = {
			uuid: 'earth-switch-template-uuid',
			name: 'Earth Switch',
			type: 'DIS',
			desc: 'Earth Switch Equipment',
			terminals: [],
			eqFunctions: []
		}

		const cbrTemplate: ConductingEquipmentTemplate = {
			uuid: 'cbr-template-uuid',
			name: 'Circuit Breaker',
			type: 'CBR',
			desc: 'Circuit Breaker Equipment',
			terminals: [],
			eqFunctions: []
		}

		const bayType: BayType = {
			uuid: 'baytype-uuid',
			name: 'TestBayType',
			desc: 'Test Bay Type',
			conductingEquipments: [
				{
					uuid: 'baytype-dis1-uuid',
					templateUuid: 'disconnector-template-uuid',
					virtual: false
				},
				{
					uuid: 'baytype-dis2-uuid',
					templateUuid: 'earth-switch-template-uuid',
					virtual: false
				},
				{
					uuid: 'baytype-cbr-uuid',
					templateUuid: 'cbr-template-uuid',
					virtual: false
				}
			],
			functions: []
		}

		// Mock getConductingEquipmentTemplate
		vi.mocked(
			ssdImportStore.getConductingEquipmentTemplate
		).mockImplementation((uuid: string) => {
			if (uuid === 'disconnector-template-uuid')
				return disconnectorTemplate
			if (uuid === 'earth-switch-template-uuid')
				return earthSwitchTemplate
			if (uuid === 'cbr-template-uuid') return cbrTemplate
			return undefined
		})

		// Execute validation
		const result = validateEquipmentMatch(scdBay, bayType)

		// Verify
		expect(result.isValid).toBe(false)
		expect(result.requiresManualMatching).toBe(true)
		expect(result.ambiguousTypes).toBeDefined()
		expect(result.ambiguousTypes?.length).toBeGreaterThan(0)
		expect(result.ambiguousTypes?.[0]).toContain('DIS')
		expect(result.ambiguousTypes?.[0]).toContain('Disconnector')
		expect(result.ambiguousTypes?.[0]).toContain('Earth Switch')
		expect(result.errors[0]).toContain('Manual matching required')
	})

	it('should NOT flag ambiguous types when multiple templates have same type AND same name', () => {
		// This would be duplicates, not ambiguity
		const disconnectorTemplate1: ConductingEquipmentTemplate = {
			uuid: 'disconnector-template-uuid-1',
			name: 'Disconnector',
			type: 'DIS',
			desc: 'Disconnector Equipment 1',
			terminals: [],
			eqFunctions: []
		}

		const disconnectorTemplate2: ConductingEquipmentTemplate = {
			uuid: 'disconnector-template-uuid-2',
			name: 'Disconnector',
			type: 'DIS',
			desc: 'Disconnector Equipment 2',
			terminals: [],
			eqFunctions: []
		}

		const cbrTemplate: ConductingEquipmentTemplate = {
			uuid: 'cbr-template-uuid',
			name: 'Circuit Breaker',
			type: 'CBR',
			desc: 'Circuit Breaker Equipment',
			terminals: [],
			eqFunctions: []
		}

		const bayType: BayType = {
			uuid: 'baytype-uuid',
			name: 'TestBayType',
			desc: 'Test Bay Type',
			conductingEquipments: [
				{
					uuid: 'baytype-dis1-uuid',
					templateUuid: 'disconnector-template-uuid-1',
					virtual: false
				},
				{
					uuid: 'baytype-dis2-uuid',
					templateUuid: 'disconnector-template-uuid-2',
					virtual: false
				},
				{
					uuid: 'baytype-cbr-uuid',
					templateUuid: 'cbr-template-uuid',
					virtual: false
				}
			],
			functions: []
		}

		vi.mocked(
			ssdImportStore.getConductingEquipmentTemplate
		).mockImplementation((uuid: string) => {
			if (uuid === 'disconnector-template-uuid-1')
				return disconnectorTemplate1
			if (uuid === 'disconnector-template-uuid-2')
				return disconnectorTemplate2
			if (uuid === 'cbr-template-uuid') return cbrTemplate
			return undefined
		})

		// Execute validation
		const result = validateEquipmentMatch(scdBay, bayType)

		// Should pass validation (same names means not ambiguous, just duplicates)
		expect(result.isValid).toBe(true)
		expect(result.requiresManualMatching).toBeUndefined()
	})

	it('should pass validation when all equipment types are unique', () => {
		const disconnectorTemplate: ConductingEquipmentTemplate = {
			uuid: 'disconnector-template-uuid',
			name: 'Disconnector',
			type: 'DIS',
			desc: 'Disconnector Equipment',
			terminals: [],
			eqFunctions: []
		}

		const cbrTemplate: ConductingEquipmentTemplate = {
			uuid: 'cbr-template-uuid',
			name: 'Circuit Breaker',
			type: 'CBR',
			desc: 'Circuit Breaker Equipment',
			terminals: [],
			eqFunctions: []
		}

		const bayType: BayType = {
			uuid: 'baytype-uuid',
			name: 'TestBayType',
			desc: 'Test Bay Type',
			conductingEquipments: [
				{
					uuid: 'baytype-dis1-uuid',
					templateUuid: 'disconnector-template-uuid',
					virtual: false
				},
				{
					uuid: 'baytype-cbr-uuid',
					templateUuid: 'cbr-template-uuid',
					virtual: false
				}
			],
			functions: []
		}

		vi.mocked(
			ssdImportStore.getConductingEquipmentTemplate
		).mockImplementation((uuid: string) => {
			if (uuid === 'disconnector-template-uuid')
				return disconnectorTemplate
			if (uuid === 'cbr-template-uuid') return cbrTemplate
			return undefined
		})

		// Update SCD to match: 1 DIS, 1 CBR
		mockSCDDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation name="TestSubstation">
					<VoltageLevel name="TestVL">
						<Bay name="TestBay">
							<ConductingEquipment name="DIS1" type="DIS"/>
							<ConductingEquipment name="CBR1" type="CBR"/>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		const bay = mockSCDDocument.querySelector('Bay')
		if (!bay) throw new Error('Bay not found')
		scdBay = bay

		// Execute validation
		const result = validateEquipmentMatch(scdBay, bayType)

		// Should pass
		expect(result.isValid).toBe(true)
		expect(result.requiresManualMatching).toBeUndefined()
		expect(result.errors).toHaveLength(0)
	})

	it('should provide clear error message for UI to show manual matching dialog', () => {
		const disconnectorTemplate: ConductingEquipmentTemplate = {
			uuid: 'disconnector-template-uuid',
			name: 'Disconnector',
			type: 'DIS',
			desc: 'Disconnector Equipment',
			terminals: [],
			eqFunctions: []
		}

		const earthSwitchTemplate: ConductingEquipmentTemplate = {
			uuid: 'earth-switch-template-uuid',
			name: 'Earth Switch',
			type: 'DIS',
			desc: 'Earth Switch Equipment',
			terminals: [],
			eqFunctions: []
		}

		const bayType: BayType = {
			uuid: 'baytype-uuid',
			name: 'TestBayType',
			desc: 'Test Bay Type',
			conductingEquipments: [
				{
					uuid: 'baytype-dis1-uuid',
					templateUuid: 'disconnector-template-uuid',
					virtual: false
				},
				{
					uuid: 'baytype-dis2-uuid',
					templateUuid: 'earth-switch-template-uuid',
					virtual: false
				}
			],
			functions: []
		}

		vi.mocked(
			ssdImportStore.getConductingEquipmentTemplate
		).mockImplementation((uuid: string) => {
			if (uuid === 'disconnector-template-uuid')
				return disconnectorTemplate
			if (uuid === 'earth-switch-template-uuid')
				return earthSwitchTemplate
			return undefined
		})

		// Execute validation
		const result = validateEquipmentMatch(scdBay, bayType)

		// Verify clear error messages for UI
		expect(result.requiresManualMatching).toBe(true)
		expect(result.errors.length).toBeGreaterThan(0)

		// Check that error message contains manual matching info
		const errorText = result.errors.join(' ')
		expect(errorText).toContain('Manual matching required')
		expect(errorText).toContain('Multiple equipment templates')
	})
})
