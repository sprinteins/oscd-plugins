import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ssdImportStore } from './ssd-import.store.svelte'
import { resetSSDImportStore } from '@/headless/test-helpers'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

describe('ssdImportStore', () => {
	let doc: XMLDocument

	beforeEach(() => {
		resetSSDImportStore()

		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
	})

	describe('loadFromSSD', () => {
		it('should load and parse SSD document', () => {
			ssdImportStore.loadFromSSD(doc, 'test.ssd')

			expect(ssdImportStore.bayTypes.length).toBeGreaterThan(0)
			expect(ssdImportStore.functionTemplates.length).toBeGreaterThan(0)
			expect(ssdImportStore.lnodeTypes.length).toBeGreaterThan(0)
			expect(ssdImportStore.doTypes.length).toBeGreaterThan(0)
		})

		it('should populate bay types after loading', () => {
			ssdImportStore.loadFromSSD(doc, 'test.ssd')

			expect(ssdImportStore.bayTypes).toHaveLength(3)
			expect(ssdImportStore.bayTypes[0].name).toBe('Bay_1')
			expect(ssdImportStore.bayTypes[1].name).toBe('Bay_2')
			expect(ssdImportStore.bayTypes[2].name).toBe('Bay_3')
		})

		it('should populate function templates after loading', () => {
			ssdImportStore.loadFromSSD(doc, 'test.ssd')

			expect(ssdImportStore.functionTemplates).toHaveLength(3)
			expect(ssdImportStore.functionTemplates[0].name).toBe('Func_1')
			expect(ssdImportStore.functionTemplates[1].name).toBe('Func_2')
			expect(ssdImportStore.functionTemplates[2].name).toBe('Func_3')
		})

		it('should populate conducting equipment templates after loading', () => {
			ssdImportStore.loadFromSSD(doc, 'test.ssd')

			expect(ssdImportStore.conductingEquipmentTemplates).toHaveLength(1)
			expect(ssdImportStore.conductingEquipmentTemplates[0].name).toBe(
				'Power Cable_1'
			)
		})

		it('should populate data type templates after loading', () => {
			ssdImportStore.loadFromSSD(doc, 'test.ssd')

			expect(ssdImportStore.lnodeTypes.length).toBeGreaterThan(0)
			expect(ssdImportStore.doTypes.length).toBeGreaterThan(0)
			expect(ssdImportStore.daTypes.length).toBeGreaterThan(0)
			expect(ssdImportStore.enumTypes.length).toBeGreaterThan(0)
		})

		it('should set filename and loaded document', () => {
			ssdImportStore.loadFromSSD(doc, 'myfile.ssd')

			expect(ssdImportStore.currentFilename).toBe('myfile.ssd')
			expect(ssdImportStore.loadedSSDDocument).toBe(doc)
		})
	})

	describe('getConductingEquipmentTemplate', () => {
		beforeEach(() => {
			ssdImportStore.loadFromSSD(doc, 'test.ssd')
		})

		it('should find conducting equipment template by UUID', () => {
			const template = ssdImportStore.getConductingEquipmentTemplate(
				'601bc79d-f425-4229-800d-7ea0b7c6421d'
			)

			expect(template).toBeDefined()
			expect(template?.name).toBe('Power Cable_1')
			expect(template?.type).toBe('CAB')
		})

		it('should return undefined for non-existent UUID', () => {
			const template =
				ssdImportStore.getConductingEquipmentTemplate(
					'non-existent-uuid'
				)

			expect(template).toBeUndefined()
		})
	})

	describe('getFunctionTemplate', () => {
		beforeEach(() => {
			ssdImportStore.loadFromSSD(doc, 'test.ssd')
		})

		it('should find function template by UUID', () => {
			const template = ssdImportStore.getFunctionTemplate(
				'0e552aee-9656-4f5b-befd-005a74a6f9c6'
			)

			expect(template).toBeDefined()
			expect(template?.name).toBe('Func_1')
			expect(template?.lnodes).toHaveLength(1)
		})

		it('should return undefined for non-existent UUID', () => {
			const template =
				ssdImportStore.getFunctionTemplate('non-existent-uuid')

			expect(template).toBeUndefined()
		})

		it('should find function template with multiple LNodes', () => {
			const template = ssdImportStore.getFunctionTemplate(
				'af05ef82-fac1-42ed-8c47-57d117e7083e'
			)

			expect(template).toBeDefined()
			expect(template?.name).toBe('Func_2')
			expect(template?.lnodes).toHaveLength(2)
		})
	})

	describe('state management', () => {
		it('should track current filename', () => {
			expect(ssdImportStore.currentFilename).toBeNull()
			ssdImportStore.currentFilename = 'test.ssd'
			expect(ssdImportStore.currentFilename).toBe('test.ssd')
		})

		it('should track selected bay type', () => {
			expect(ssdImportStore.selectedBayType).toBeNull()
			ssdImportStore.selectedBayType = 'test-uuid'
			expect(ssdImportStore.selectedBayType).toBe('test-uuid')
		})

		it('should store loaded document', () => {
			expect(ssdImportStore.loadedSSDDocument).toBeNull()
			ssdImportStore.loadedSSDDocument = doc
			expect(ssdImportStore.loadedSSDDocument).toBe(doc)
		})
	})

	describe('integration test', () => {
		it('should handle complete workflow', () => {
			// 1. Load and parse document
			ssdImportStore.loadFromSSD(doc, 'test.ssd')

			// 3. Verify all data is loaded
			expect(ssdImportStore.bayTypes.length).toBe(3)
			expect(ssdImportStore.functionTemplates.length).toBe(3)
			expect(ssdImportStore.conductingEquipmentTemplates.length).toBe(1)
			expect(ssdImportStore.lnodeTypes.length).toBeGreaterThan(0)

			// 3. Select a bay type
			const firstBayUuid = ssdImportStore.bayTypes[0].uuid
			ssdImportStore.selectedBayType = firstBayUuid

			// 4. Verify selection
			expect(ssdImportStore.selectedBayType).toBe(firstBayUuid)

			// 5. Retrieve templates
			const funcTemplateUuid =
				ssdImportStore.bayTypes[0].functions[0]?.templateUuid
			if (funcTemplateUuid) {
				const funcTemplate =
					ssdImportStore.getFunctionTemplate(funcTemplateUuid)
				expect(funcTemplate).toBeDefined()
				expect(funcTemplate?.name).toBe('Func_2')
			}
		})
	})
})
