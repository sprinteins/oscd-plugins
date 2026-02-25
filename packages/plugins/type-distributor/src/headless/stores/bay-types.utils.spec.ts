import { describe, it, expect, beforeEach } from 'vitest'
import {
	getBayTypeWithTemplates,
	getAllLNodesWithParent
} from './bay-types.utils'
import { ssdImportStore } from './ssd-import.store.svelte'
import { resetSSDImportStore } from '@/headless/test-helpers'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'
import type { BayTypeWithTemplates } from '../common-types'

describe('bay-types.utils', () => {
	let doc: XMLDocument

	beforeEach(() => {
		resetSSDImportStore()

		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
		ssdImportStore.loadFromSSD(doc, 'test.ssd')
	})

	describe('getBayTypeWithTemplates', () => {
		it('GIVEN valid bay UUID WHEN called THEN should return bay type with resolved templates', () => {
			// GIVEN
			const bayType = ssdImportStore.bayTypes[0]
			const bayUuid = bayType.uuid

			// WHEN
			const result = getBayTypeWithTemplates(bayUuid)

			// THEN
			expect(result).toBeDefined()
			expect(result?.uuid).toBe(bayUuid)
			expect(result?.name).toBe(bayType.name)
			expect(Array.isArray(result?.conductingEquipmentTemplates)).toBe(
				true
			)
			expect(Array.isArray(result?.functionTemplates)).toBe(true)
		})

		it('GIVEN non-existent bay UUID WHEN called THEN should return null', () => {
			// GIVEN
			const nonExistentUuid = 'non-existent-uuid'

			// WHEN
			const result = getBayTypeWithTemplates(nonExistentUuid)

			// THEN
			expect(result).toBeNull()
		})

		it('GIVEN bay type with functions WHEN called THEN should resolve function templates', () => {
			// GIVEN
			const bayType = ssdImportStore.bayTypes.find(
				(b) => b.functions.length > 0
			)
			if (!bayType)
				throw new Error('Test setup failed: no bay type with functions')

			// WHEN
			const result = getBayTypeWithTemplates(bayType.uuid)

			if (!result)
				throw new Error(
					'Test setup failed: getBayTypeWithTemplates returned null'
				)

			// THEN
			expect(result.functionTemplates.length).toBeGreaterThan(0)
			expect(result.functionTemplates[0]).toHaveProperty('name')
			expect(result.functionTemplates[0]).toHaveProperty('lnodes')
		})

		it('GIVEN bay type with conducting equipment WHEN called THEN should resolve CE templates', () => {
			// GIVEN
			const bayType = ssdImportStore.bayTypes.find(
				(b) => b.conductingEquipments.length > 0
			)
			if (!bayType) return // skip if mock data has none

			// WHEN
			const result = getBayTypeWithTemplates(bayType.uuid)

			if (!result)
				throw new Error(
					'Test setup failed: getBayTypeWithTemplates returned null'
				)

			// THEN
			expect(result.conductingEquipmentTemplates.length).toBeGreaterThan(
				0
			)
			expect(result.conductingEquipmentTemplates[0]).toHaveProperty(
				'name'
			)
			expect(result.conductingEquipmentTemplates[0]).toHaveProperty(
				'type'
			)
		})

		it('GIVEN bay type with missing template UUIDs WHEN called THEN should filter out undefined templates', () => {
			// GIVEN
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

			// WHEN
			const result = getBayTypeWithTemplates(invalidBayType.uuid)

			if (!result)
				throw new Error(
					'Test setup failed: getBayTypeWithTemplates returned null'
				)

			// THEN
			expect(result).toBeDefined()
			expect(result.conductingEquipmentTemplates).toEqual([])
			expect(result.functionTemplates).toEqual([])
		})

		it('GIVEN bay type with no conducting equipment or functions WHEN called THEN should return empty arrays', () => {
			// GIVEN
			const emptyBayType = {
				uuid: 'empty-bay-uuid',
				name: 'Empty Bay',
				conductingEquipments: [],
				functions: []
			}
			ssdImportStore.bayTypes.push(emptyBayType)

			// WHEN
			const result = getBayTypeWithTemplates(emptyBayType.uuid)

			if (!result)
				throw new Error(
					'Test setup failed: getBayTypeWithTemplates returned null'
				)

			// THEN
			expect(result).toBeDefined()
			expect(result.conductingEquipmentTemplates).toEqual([])
			expect(result.functionTemplates).toEqual([])
		})

		it('GIVEN a new SSD loaded WHEN getBayTypeWithTemplates is called THEN cache is invalidated automatically', () => {
			// GIVEN first load
			const firstBayType = ssdImportStore.bayTypes[0]
			const firstResult = getBayTypeWithTemplates(firstBayType.uuid)
			expect(firstResult).toBeDefined()

			// WHEN a new SSD is loaded (creates a new bayTypes reference)
			const doc2 = new DOMParser().parseFromString(
				ssdMockA,
				'application/xml'
			)
			ssdImportStore.loadFromSSD(doc2, 'test2.ssd')

			// THEN cache is re-populated from the new data, not stale
			const newBayType = ssdImportStore.bayTypes[0]
			const newResult = getBayTypeWithTemplates(newBayType.uuid)
			expect(newResult).toBeDefined()
			expect(newResult?.uuid).toBe(newBayType.uuid)
		})
	})

	describe('getAllLNodesWithParent', () => {
		it('GIVEN bay type with functions WHEN called THEN should flatten all lnodes with parent UUIDs', () => {
			// GIVEN
			const bayType = ssdImportStore.bayTypes.find(
				(b) => b.functions.length > 0
			)
			if (!bayType)
				throw new Error('Test setup failed: no bay type with functions')
			const bayTypeWithTemplates = getBayTypeWithTemplates(bayType.uuid)
			if (!bayTypeWithTemplates)
				throw new Error(
					'Test setup failed: getBayTypeWithTemplates returned null'
				)

			// WHEN
			const result = getAllLNodesWithParent(bayTypeWithTemplates)

			// THEN
			expect(Array.isArray(result)).toBe(true)
			for (const item of result) {
				expect(item).toHaveProperty('parentUuid')
				expect(item).toHaveProperty('lnode')
			}
		})

		it('GIVEN bay type with no lnodes WHEN called THEN should return empty array', () => {
			// GIVEN
			const emptyBayType = {
				uuid: 'e',
				name: 'E',
				conductingEquipments: [],
				functions: []
			}
			ssdImportStore.bayTypes.push(emptyBayType)
			const bayTypeWithTemplates = getBayTypeWithTemplates(
				emptyBayType.uuid
			)
			if (!bayTypeWithTemplates)
				throw new Error(
					'Test setup failed: getBayTypeWithTemplates returned null'
				)

			// WHEN
			const result = getAllLNodesWithParent(bayTypeWithTemplates)

			// THEN
			expect(result).toEqual([])
		})

		it('GIVEN a constructed BayTypeWithTemplates WHEN called THEN should return lnodes from CE and functions', () => {
			// GIVEN
			const fake: BayTypeWithTemplates = {
				uuid: 'fake',
				name: 'fake',
				conductingEquipments: [
					{ uuid: 'inst-ce', templateUuid: 't-ce', virtual: false }
				],
				functions: [{ uuid: 'inst-f', templateUuid: 't-f' }],
				conductingEquipmentTemplates: [
					{
						uuid: 't-ce',
						name: '',
						type: '',
						terminals: [],
						eqFunctions: [
							{
								uuid: 'eq-1',
								name: 'eq1',
								lnodes: [
									{
										lnClass: 'LLN0',
										lnType: 'T1',
										lnInst: '1'
									}
								]
							}
						]
					}
				],
				functionTemplates: [
					{
						uuid: 't-f',
						name: '',
						lnodes: [{ lnClass: 'LLN0', lnType: 'T2', lnInst: '1' }]
					}
				],
				conductingEquipmentTemplateMap: new Map([
					[
						't-ce',
						{
							uuid: 't-ce',
							name: '',
							type: '',
							terminals: [],
							eqFunctions: [
								{
									uuid: 'eq-1',
									name: 'eq1',
									lnodes: [
										{
											lnClass: 'LLN0',
											lnType: 'T1',
											lnInst: '1'
										}
									]
								}
							]
						}
					]
				]),
				functionTemplateMap: new Map([
					[
						't-f',
						{
							uuid: 't-f',
							name: '',
							lnodes: [
								{ lnClass: 'LLN0', lnType: 'T2', lnInst: '1' }
							]
						}
					]
				])
			}

			// WHEN
			const result = getAllLNodesWithParent(fake)

			// THEN
			expect(result.length).toBe(2)
			expect(result).toEqual(
				expect.arrayContaining([
					{
						parentUuid: 'inst-ce',
						lnode: { lnClass: 'LLN0', lnType: 'T1', lnInst: '1' }
					},
					{
						parentUuid: 'inst-f',
						lnode: { lnClass: 'LLN0', lnType: 'T2', lnInst: '1' }
					}
				])
			)
		})

		it('GIVEN CE template without eqFunctions WHEN called THEN should not throw and return only function lnodes', () => {
			// GIVEN
			const fake: BayTypeWithTemplates = {
				uuid: 'fake2',
				name: 'fake2',
				conductingEquipments: [
					{ uuid: 'inst-ce', templateUuid: 't-ce', virtual: false }
				],
				functions: [{ uuid: 'inst-f', templateUuid: 't-f' }],
				conductingEquipmentTemplates: [
					{
						uuid: 't-ce',
						name: '',
						type: '',
						terminals: [],
						eqFunctions: []
					}
				],
				functionTemplates: [
					{
						uuid: 't-f',
						name: '',
						lnodes: [{ lnClass: 'LLN0', lnType: 'T2', lnInst: '1' }]
					}
				],
				conductingEquipmentTemplateMap: new Map([
					[
						't-ce',
						{
							uuid: 't-ce',
							name: '',
							type: '',
							terminals: [],
							eqFunctions: []
						}
					]
				]),
				functionTemplateMap: new Map([
					[
						't-f',
						{
							uuid: 't-f',
							name: '',
							lnodes: [
								{ lnClass: 'LLN0', lnType: 'T2', lnInst: '1' }
							]
						}
					]
				])
			}

			// WHEN
			const result = getAllLNodesWithParent(fake)

			// THEN
			expect(result).toEqual([
				{
					parentUuid: 'inst-f',
					lnode: { lnClass: 'LLN0', lnType: 'T2', lnInst: '1' }
				}
			])
		})
	})

	describe('caching behavior', () => {
		it('GIVEN valid bay UUID WHEN called twice THEN should return the same cached object instance', () => {
			// GIVEN
			const bayType = ssdImportStore.bayTypes[0]
			const bayUuid = bayType.uuid

			// WHEN
			const first = getBayTypeWithTemplates(bayUuid)
			const second = getBayTypeWithTemplates(bayUuid)

			// THEN
			expect(first).toBeDefined()
			expect(first).toBe(second)
		})

		it('GIVEN cached result WHEN bayTypes array reference changes THEN cache is invalidated', () => {
			// GIVEN
			const bayType = ssdImportStore.bayTypes[0]
			const bayUuid = bayType.uuid

			const first = getBayTypeWithTemplates(bayUuid)
			expect(first).toBeDefined()

			// WHEN: replace the array with a new reference (same contents)
			ssdImportStore.bayTypes = [...ssdImportStore.bayTypes]

			const after = getBayTypeWithTemplates(bayUuid)

			// THEN: should be a new object (cache cleared)
			expect(after).toBeDefined()
			expect(after).not.toBe(first)
		})
	})
})
