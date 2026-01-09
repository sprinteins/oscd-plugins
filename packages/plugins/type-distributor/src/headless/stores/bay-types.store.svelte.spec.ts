import { describe, it, expect, beforeEach } from 'vitest'
import { bayTypesStore } from './bay-types.store.svelte'
import { ssdImportStore } from './ssd-import.store.svelte'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'
import { resetSSDImportStore } from '@/tests/resetSSDImportStore.helper'

describe('bayTypesStore', () => {
	let doc: XMLDocument

	beforeEach(() => {
		resetSSDImportStore()

		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
		
		ssdImportStore.loadedSSDDocument = doc
		ssdImportStore.loadFromSSD()
	})

	describe('bayTypes getter', () => {
		it('should return bay types from ssd import store', () => {
			const bayTypes = bayTypesStore.bayTypes

			expect(bayTypes).toHaveLength(3)
			expect(bayTypes).toBe(ssdImportStore.bayTypes)
		})

		it('should reflect changes in ssd import store', () => {
			expect(bayTypesStore.bayTypes).toHaveLength(3)

			ssdImportStore.bayTypes = []
			expect(bayTypesStore.bayTypes).toHaveLength(0)
		})
	})

	describe('selectedBayType getter/setter', () => {
		it('should get selected bay type from ssd import store', () => {
			ssdImportStore.selectedBayType = 'test-uuid'
			expect(bayTypesStore.selectedBayType).toBe('test-uuid')
		})

		it('should set selected bay type in ssd import store', () => {
			bayTypesStore.selectedBayType = 'new-uuid'
			expect(ssdImportStore.selectedBayType).toBe('new-uuid')
		})

		it('should handle null selection', () => {
			bayTypesStore.selectedBayType = 'test-uuid'
			expect(bayTypesStore.selectedBayType).toBe('test-uuid')

			bayTypesStore.selectedBayType = null
			expect(bayTypesStore.selectedBayType).toBeNull()
		})
	})

	describe('getBayTypeWithTemplates', () => {
		it('should return bay type with resolved templates', () => {
			const firstBayUuid = ssdImportStore.bayTypes[0].uuid
			const bayTypeWithTemplates = bayTypesStore.getBayTypeWithTemplates(firstBayUuid)

			expect(bayTypeWithTemplates).toBeDefined()
			expect(bayTypeWithTemplates?.uuid).toBe(firstBayUuid)
			expect(bayTypeWithTemplates?.name).toBe('Bay_1')
		})

		it('should return null for non-existent bay UUID', () => {
			const bayTypeWithTemplates = bayTypesStore.getBayTypeWithTemplates('non-existent-uuid')
			expect(bayTypeWithTemplates).toBeNull()
		})

		it('should resolve function templates', () => {
			const firstBayUuid = ssdImportStore.bayTypes[0].uuid
			const bayTypeWithTemplates = bayTypesStore.getBayTypeWithTemplates(firstBayUuid)

			expect(bayTypeWithTemplates?.functionTemplates).toBeDefined()
			expect(Array.isArray(bayTypeWithTemplates?.functionTemplates)).toBe(true)
		})

		it('should include original bay type properties', () => {
			const firstBayUuid = ssdImportStore.bayTypes[0].uuid
			const bayTypeWithTemplates = bayTypesStore.getBayTypeWithTemplates(firstBayUuid)

			expect(bayTypeWithTemplates?.uuid).toBe(firstBayUuid)
			expect(bayTypeWithTemplates?.name).toBe('Bay_1')
			expect(bayTypeWithTemplates?.conductingEquipments).toBeDefined()
			expect(bayTypeWithTemplates?.functions).toBeDefined()
		})

		it('should resolve conducting equipment templates correctly', () => {
			const firstBayUuid = ssdImportStore.bayTypes[0].uuid
			const bayTypeWithTemplates = bayTypesStore.getBayTypeWithTemplates(firstBayUuid)

			expect(bayTypeWithTemplates?.conductingEquipmentTemplates).toBeDefined()
			expect(Array.isArray(bayTypeWithTemplates?.conductingEquipmentTemplates)).toBe(true)
		})

		it('should filter out undefined templates', () => {
			// Create a bay with invalid template references
			const parser = new DOMParser()
			const customDoc = parser.parseFromString(
				`<?xml version="1.0"?>
				<SCL>
					<Substation name="TEMPLATE">
						<VoltageLevel name="TEMPLATE">
							<Bay name="TEMPLATE">
								<Function name="ValidFunc" uuid="valid-func-uuid">
									<LNode lnType="TestType" />
								</Function>
							</Bay>
							<Bay name="TestBay" uuid="test-bay-uuid">
								<Function uuid="func-uuid" templateUuid="valid-func-uuid" />
								<Function uuid="func-uuid-2" templateUuid="invalid-uuid" />
								<ConductingEquipment uuid="ce-uuid" templateUuid="invalid-ce-uuid" />
							</Bay>
						</VoltageLevel>
					</Substation>
				</SCL>`,
				'application/xml'
			)

			ssdImportStore.loadedSSDDocument = customDoc
			ssdImportStore.loadFromSSD()

			const bayTypeWithTemplates = bayTypesStore.getBayTypeWithTemplates('test-bay-uuid')

			const functionTemplates = bayTypeWithTemplates?.functionTemplates
			expect(functionTemplates).toHaveLength(1)
			if (!functionTemplates?.[0]) return
			expect(functionTemplates?.[0].name).toBe('ValidFunc')

			expect(bayTypeWithTemplates?.conductingEquipmentTemplates).toHaveLength(0)
		})
	})
})
