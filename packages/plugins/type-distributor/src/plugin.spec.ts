import { describe, it, expect, beforeEach } from 'vitest'
import { ssdImportStore } from '@/headless/stores'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

describe('Type Distributor Plugin', () => {
	describe('Integration Tests', () => {
		let doc: XMLDocument

		beforeEach(() => {
			// Reset store state
			ssdImportStore.currentFilename = ''
			ssdImportStore.loadedSSDDocument = undefined
			ssdImportStore.bayTypes = []
			ssdImportStore.functionTemplates = []
			ssdImportStore.conductingEquipmentTemplates = []
			ssdImportStore.lnodeTypes = []
			ssdImportStore.doTypes = []
			ssdImportStore.daTypes = []
			ssdImportStore.enumTypes = []
			ssdImportStore.selectedBayType = null

			// Parse mock document
			const parser = new DOMParser()
			doc = parser.parseFromString(ssdMockA, 'application/xml')

			// Load and parse SSD document
			ssdImportStore.loadedSSDDocument = doc
			ssdImportStore.loadFromSSD()
		})

		it('should load and parse SSD document successfully', () => {
			expect(ssdImportStore.bayTypes).toHaveLength(3)
			expect(ssdImportStore.functionTemplates).toHaveLength(3)
			expect(ssdImportStore.conductingEquipmentTemplates).toHaveLength(1)
			expect(ssdImportStore.lnodeTypes.length).toBeGreaterThan(0)
			expect(ssdImportStore.doTypes.length).toBeGreaterThan(0)
		})

		it('should correctly link bay types to function templates', () => {
			const bay1 = ssdImportStore.bayTypes.find((b) => b.name === 'Bay_1')
			expect(bay1).toBeDefined()
			expect(bay1?.functions).toHaveLength(1)

			const funcTemplateUuid = bay1?.functions[0].templateUuid
			expect(funcTemplateUuid).toBe(
				'af05ef82-fac1-42ed-8c47-57d117e7083e'
			)

			if (!funcTemplateUuid)
				throw new Error('Expected function template UUID to be defined')
			const funcTemplate =
				ssdImportStore.getFunctionTemplate(funcTemplateUuid)
			expect(funcTemplate).toBeDefined()
			expect(funcTemplate?.name).toBe('Func_2')
			expect(funcTemplate?.lnodes).toHaveLength(2)
		})

		it('should resolve LNode types for function templates', () => {
			// Get Func_2 which has LNodes with types
			const func2 = ssdImportStore.getFunctionTemplate(
				'af05ef82-fac1-42ed-8c47-57d117e7083e'
			)
			expect(func2).toBeDefined()
			expect(func2?.lnodes[0].lnType).toBe('Dummy.LLN0.two')
			expect(func2?.lnodes[1].lnType).toBe('Dummy.XCBR1')

			// Verify these LNodeTypes exist in data type templates
			const lln0Type = ssdImportStore.lnodeTypes.find(
				(ln) => ln.id === 'Dummy.LLN0.two'
			)
			expect(lln0Type).toBeDefined()
			expect(lln0Type?.lnClass).toBe('LLN0')

			const xcbrType = ssdImportStore.lnodeTypes.find(
				(ln) => ln.id === 'Dummy.XCBR1'
			)
			expect(xcbrType).toBeDefined()
			expect(xcbrType?.lnClass).toBe('XCBR')
		})

		it('should handle complete workflow from load to template resolution', () => {
			// 1. Set filename (document already loaded in beforeEach)
			ssdImportStore.currentFilename = 'test.ssd'

			// 2. Select a bay type
			const bay2 = ssdImportStore.bayTypes.find((b) => b.name === 'Bay_2')
			expect(bay2).toBeDefined()
			if (!bay2) throw new Error('Expected Bay_2 to be defined')
			ssdImportStore.selectedBayType = bay2.uuid

			// 3. Get function template for this bay
			const funcTemplateUuid = bay2?.functions[0].templateUuid
			if (!funcTemplateUuid)
				throw new Error('Expected function template UUID to be defined')
			const funcTemplate =
				ssdImportStore.getFunctionTemplate(funcTemplateUuid)

			expect(funcTemplate).toBeDefined()
			expect(funcTemplate?.name).toBe('Func_2')

			// 4. Verify LNode data is accessible
			const firstLNode = funcTemplate?.lnodes[0]
			expect(firstLNode).toBeDefined()
			expect(firstLNode?.lnType).toBe('Dummy.LLN0.two')

			// 5. Find corresponding LNodeType
			const lnodeType = ssdImportStore.lnodeTypes.find(
				(ln) => ln.id === firstLNode?.lnType
			)
			expect(lnodeType).toBeDefined()
			expect(lnodeType?.dataObjects.length).toBeGreaterThan(0)

			// 6. Verify data object structure
			const modDO = lnodeType?.dataObjects.find((d) => d.name === 'Mod')
			expect(modDO).toBeDefined()
			expect(modDO?.type).toBe('Dummy.LLN0.Mod')

			// 7. Find corresponding DOType
			const doType = ssdImportStore.doTypes.find(
				(d) => d.id === modDO?.type
			)
			expect(doType).toBeDefined()
			expect(doType?.cdc).toBe('ENC')
			expect(doType?.dataAttributes.length).toBeGreaterThan(0)
		})

		it('should handle multiple bays referencing same template', () => {
			// Both Bay_1 and Bay_2 reference the same function template
			const bay1 = ssdImportStore.bayTypes.find((b) => b.name === 'Bay_1')
			const bay2 = ssdImportStore.bayTypes.find((b) => b.name === 'Bay_2')

			expect(bay1?.functions[0].templateUuid).toBe(
				bay2?.functions[0].templateUuid
			)

			const sharedTemplateUuid = bay1?.functions[0].templateUuid
			if (!sharedTemplateUuid)
				throw new Error(
					'Expected shared function template UUID to be defined'
				)
			const sharedTemplate =
				ssdImportStore.getFunctionTemplate(sharedTemplateUuid)

			expect(sharedTemplate).toBeDefined()
			expect(sharedTemplate?.name).toBe('Func_2')
			expect(sharedTemplate?.lnodes).toHaveLength(2)
		})
	})

	describe('Data Type Template Validation', () => {
		beforeEach(() => {
			// Reset store state
			ssdImportStore.currentFilename = ''
			ssdImportStore.loadedSSDDocument = undefined
			ssdImportStore.bayTypes = []
			ssdImportStore.functionTemplates = []
			ssdImportStore.conductingEquipmentTemplates = []
			ssdImportStore.lnodeTypes = []
			ssdImportStore.doTypes = []
			ssdImportStore.daTypes = []
			ssdImportStore.enumTypes = []
			ssdImportStore.selectedBayType = null

			// Parse mock document
			const parser = new DOMParser()
			const doc = parser.parseFromString(ssdMockA, 'application/xml')

			// Load and parse SSD document
			ssdImportStore.loadedSSDDocument = doc
			ssdImportStore.loadFromSSD()
		})

		it('should contain expected LNodeTypes from mock', () => {
			const expectedTypes = [
				'Dummy.LLN0',
				'Dummy.XCBR1',
				'Dummy.CSWI',
				'Dummy.LPHD1'
			]

			for (const typeId of expectedTypes) {
				const lnodeType = ssdImportStore.lnodeTypes.find(
					(ln) => ln.id === typeId
				)
				expect(lnodeType).toBeDefined()
			}
		})

		it('should contain expected DOTypes from mock', () => {
			const expectedDOTypes = ['DummySAV', 'Dummy.SPS', 'Dummy.LLN0.Mod']

			for (const typeId of expectedDOTypes) {
				const doType = ssdImportStore.doTypes.find(
					(d) => d.id === typeId
				)
				expect(doType).toBeDefined()
			}
		})

		it('should contain expected EnumTypes from mock', () => {
			const expectedEnums = [
				'Dummy_ctlModel',
				'Dummy_Beh',
				'Dummy_Health'
			]

			for (const typeId of expectedEnums) {
				const enumType = ssdImportStore.enumTypes.find(
					(e) => e.id === typeId
				)
				expect(enumType).toBeDefined()
			}
		})
	})
})
