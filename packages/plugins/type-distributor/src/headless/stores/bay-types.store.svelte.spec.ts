import { describe, it, expect, beforeEach } from 'vitest'
import { bayTypesStore } from './bay-types.store.svelte'
import { ssdImportStore } from './ssd-import.store.svelte'
import { resetSSDImportStore } from '@/headless/test-helpers'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

describe('bayTypesStore', () => {
	let doc: XMLDocument

	beforeEach(() => {
		resetSSDImportStore()

		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
		ssdImportStore.loadFromSSD(doc, 'test.ssd')
	})

	describe('bayTypes getter', () => {
		it('GIVEN ssdImportStore has bay types WHEN bayTypes is accessed THEN should return bay types from ssdImportStore', () => {
			// GIVEN ssdImportStore has bay types loaded
			
			// WHEN bayTypes is accessed
			const result = bayTypesStore.bayTypes

			// THEN should return bay types from ssdImportStore
			expect(result).toBe(ssdImportStore.bayTypes)
			expect(result.length).toBeGreaterThan(0)
		})
	})

	describe('selectedBayType getter and setter', () => {
		it('GIVEN no selected bay type WHEN selectedBayType is accessed THEN should return null', () => {
			// GIVEN no selected bay type
			ssdImportStore.selectedBayType = null

			// WHEN selectedBayType is accessed
			const result = bayTypesStore.selectedBayType

			// THEN should return null
			expect(result).toBeNull()
		})

		it('GIVEN a bay type UUID WHEN selectedBayType is set THEN should update ssdImportStore', () => {
			// GIVEN a bay type UUID
			const uuid = 'test-bay-uuid'

			// WHEN selectedBayType is set
			bayTypesStore.selectedBayType = uuid

			// THEN should update ssdImportStore
			expect(ssdImportStore.selectedBayType).toBe(uuid)
			expect(bayTypesStore.selectedBayType).toBe(uuid)
		})

		it('GIVEN selectedBayType is set WHEN cleared with null THEN should clear in ssdImportStore', () => {
			// GIVEN selectedBayType is set
			bayTypesStore.selectedBayType = 'test-uuid'

			// WHEN cleared with null
			bayTypesStore.selectedBayType = null

			// THEN should clear in ssdImportStore
			expect(ssdImportStore.selectedBayType).toBeNull()
			expect(bayTypesStore.selectedBayType).toBeNull()
		})
	})

	describe('getBayTypeWithTemplates', () => {
		it('GIVEN valid bay UUID WHEN getBayTypeWithTemplates is called THEN should return bay type with resolved templates', () => {
			// GIVEN valid bay UUID
			const bayType = bayTypesStore.bayTypes[0]
			const bayUuid = bayType.uuid

			// WHEN getBayTypeWithTemplates is called
			const result = bayTypesStore.getBayTypeWithTemplates(bayUuid)

			// THEN should return bay type with resolved templates
			expect(result).toBeDefined()
			expect(result?.uuid).toBe(bayUuid)
			expect(result?.name).toBe(bayType.name)
			expect(result?.conductingEquipmentTemplates).toBeDefined()
			expect(result?.functionTemplates).toBeDefined()
			expect(Array.isArray(result?.conductingEquipmentTemplates)).toBe(true)
			expect(Array.isArray(result?.functionTemplates)).toBe(true)
		})

		it('GIVEN non-existent bay UUID WHEN getBayTypeWithTemplates is called THEN should return null', () => {
			// GIVEN non-existent bay UUID
			const nonExistentUuid = 'non-existent-uuid'

			// WHEN getBayTypeWithTemplates is called
			const result = bayTypesStore.getBayTypeWithTemplates(nonExistentUuid)

			// THEN should return null
			expect(result).toBeNull()
		})

		it('GIVEN bay type with functions WHEN getBayTypeWithTemplates is called THEN should resolve function templates', () => {
			// GIVEN bay type with functions
			const bayType = bayTypesStore.bayTypes.find(
				(b) => b.functions.length > 0
			)
			if (!bayType) {
				throw new Error('Test setup failed: no bay type with functions')
			}

			// WHEN getBayTypeWithTemplates is called
			const result = bayTypesStore.getBayTypeWithTemplates(bayType.uuid)

			// THEN should resolve function templates
			expect(result?.functionTemplates).toBeDefined()
			expect(result!.functionTemplates.length).toBeGreaterThan(0)
			expect(result!.functionTemplates[0]).toHaveProperty('name')
			expect(result!.functionTemplates[0]).toHaveProperty('lnodes')
		})

		it('GIVEN bay type with conducting equipment WHEN getBayTypeWithTemplates is called THEN should resolve conducting equipment templates', () => {
			// GIVEN bay type with conducting equipment
			const bayType = bayTypesStore.bayTypes.find(
				(b) => b.conductingEquipments.length > 0
			)
			if (!bayType) {
				// Skip test if no bay type with conducting equipment exists in mock data
				return
			}

			// WHEN getBayTypeWithTemplates is called
			const result = bayTypesStore.getBayTypeWithTemplates(bayType.uuid)

			// THEN should resolve conducting equipment templates
			expect(result?.conductingEquipmentTemplates).toBeDefined()
			expect(result!.conductingEquipmentTemplates.length).toBeGreaterThan(0)
			expect(result!.conductingEquipmentTemplates[0]).toHaveProperty('name')
			expect(result!.conductingEquipmentTemplates[0]).toHaveProperty('type')
		})

		it('GIVEN bay type with missing template UUIDs WHEN getBayTypeWithTemplates is called THEN should filter out undefined templates', () => {
			// GIVEN bay type with missing template UUIDs
			// Add a bay type with invalid template references
			const invalidBayType = {
				uuid: 'invalid-bay-uuid',
				name: 'Invalid Bay',
				conductingEquipments: [
					{
						uuid: 'ce-uuid',
						templateUuid: 'non-existent-template',
						virtual: false
					}
				],
				functions: [
					{
						uuid: 'func-uuid',
						templateUuid: 'non-existent-func-template'
					}
				]
			}
			ssdImportStore.bayTypes.push(invalidBayType)

			// WHEN getBayTypeWithTemplates is called
			const result = bayTypesStore.getBayTypeWithTemplates(
				invalidBayType.uuid
			)

			// THEN should filter out undefined templates
			expect(result).toBeDefined()
			expect(result?.conductingEquipmentTemplates).toEqual([])
			expect(result?.functionTemplates).toEqual([])
		})

		it('GIVEN bay type with no conducting equipment or functions WHEN getBayTypeWithTemplates is called THEN should return empty arrays', () => {
			// GIVEN bay type with no conducting equipment or functions
			const emptyBayType = {
				uuid: 'empty-bay-uuid',
				name: 'Empty Bay',
				conductingEquipments: [],
				functions: []
			}
			ssdImportStore.bayTypes.push(emptyBayType)

			// WHEN getBayTypeWithTemplates is called
			const result = bayTypesStore.getBayTypeWithTemplates(emptyBayType.uuid)

			// THEN should return empty arrays
			expect(result).toBeDefined()
			expect(result?.conductingEquipmentTemplates).toEqual([])
			expect(result?.functionTemplates).toEqual([])
		})
	})
})
