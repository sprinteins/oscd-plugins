import { describe, it, expect, beforeEach } from 'vitest'
import { flushSync } from 'svelte'
import { equipmentMatchingStore } from './equipment-matching.store.svelte'
import { ssdImportStore } from './ssd-import.store.svelte'
import { resetSSDImportStore } from '@/headless/test-helpers'
import type { ValidationResult } from '@/headless/matching/validation'
import type { ConductingEquipmentTemplate } from '@/headless/common-types'

const createTemplate = (
	uuid: string,
	type: string,
	name = `Template_${uuid}`
): ConductingEquipmentTemplate => ({
	uuid,
	type,
	name,
	terminals: [],
	eqFunctions: []
})

describe('equipmentMatchingStore', () => {
	beforeEach(() => {
		resetSSDImportStore()
		equipmentMatchingStore.validationResult = null
		equipmentMatchingStore.manualMatches.clear()
	})

	describe('setValidationResult', () => {
		it('GIVEN a validation result WHEN setValidationResult is called THEN should set validation result', () => {
			// GIVEN a validation result
			const result: ValidationResult = {
				isValid: true,
				errors: []
			}

			// WHEN setValidationResult is called
			equipmentMatchingStore.setValidationResult(result)

			// THEN should set validation result
			expect(equipmentMatchingStore.validationResult).toStrictEqual(
				result
			)
		})

		it('GIVEN clearMatches is true WHEN setValidationResult is called THEN should clear existing manual matches', () => {
			// GIVEN clearMatches is true
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')
			const result: ValidationResult = {
				isValid: true,
				errors: []
			}

			// WHEN setValidationResult is called with clearMatches=true
			equipmentMatchingStore.setValidationResult(result, true)

			// THEN should clear existing manual matches
			expect(equipmentMatchingStore.manualMatches.size).toBe(0)
		})

		it('GIVEN clearMatches is false WHEN setValidationResult is called THEN should preserve existing manual matches', () => {
			// GIVEN clearMatches is false
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')
			equipmentMatchingStore.manualMatches.set('eq2', 'template2')
			const result: ValidationResult = {
				isValid: true,
				errors: []
			}

			// WHEN setValidationResult is called with clearMatches=false
			equipmentMatchingStore.setValidationResult(result, false)

			// THEN should preserve existing manual matches
			expect(equipmentMatchingStore.manualMatches.size).toBe(2)
			expect(equipmentMatchingStore.manualMatches.get('eq1')).toBe(
				'template1'
			)
			expect(equipmentMatchingStore.manualMatches.get('eq2')).toBe(
				'template2'
			)
		})
	})

	describe('reset', () => {
		it('GIVEN store has state WHEN reset is called THEN should clear all state', () => {
			// GIVEN store has state
			equipmentMatchingStore.validationResult = {
				isValid: false,
				errors: ['Error']
			}
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')

			// WHEN reset is called
			equipmentMatchingStore.reset()

			// THEN should clear all state
			expect(equipmentMatchingStore.validationResult).toBeNull()
			expect(equipmentMatchingStore.manualMatches.size).toBe(0)
		})
	})

	describe('clearManualMatches', () => {
		it('GIVEN manual matches exist WHEN clearManualMatches is called THEN should clear manual matches', () => {
			// GIVEN manual matches exist
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')
			equipmentMatchingStore.manualMatches.set('eq2', 'template2')

			// WHEN clearManualMatches is called
			equipmentMatchingStore.clearManualMatches()

			// THEN should clear manual matches
			expect(equipmentMatchingStore.manualMatches.size).toBe(0)
		})

		it('GIVEN validation result exists WHEN clearManualMatches is called THEN should preserve validation result', () => {
			// GIVEN validation result exists
			const result: ValidationResult = {
				isValid: true,
				errors: []
			}
			equipmentMatchingStore.validationResult = result
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')

			// WHEN clearManualMatches is called
			equipmentMatchingStore.clearManualMatches()

			// THEN should preserve validation result
			expect(equipmentMatchingStore.validationResult).toStrictEqual(
				result
			)
		})
	})

	describe('clearValidationResult', () => {
		it('GIVEN validation result and manual matches exist WHEN clearValidationResult is called THEN should clear only the validation result and preserve manual matches', () => {
			// GIVEN validation result and manual matches exist
			equipmentMatchingStore.validationResult = {
				isValid: true,
				errors: []
			}
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')

			// WHEN clearValidationResult is called
			equipmentMatchingStore.clearValidationResult()

			// THEN should clear only the validation result; manual matches are preserved
			expect(equipmentMatchingStore.validationResult).toBeNull()
			expect(equipmentMatchingStore.manualMatches.size).toBe(1)
		})
	})

	describe('setMatch', () => {
		it('GIVEN a non-empty uuid WHEN setMatch is called THEN should add the match', () => {
			// GIVEN
			const name = 'Breaker1'
			const uuid = 'template-uuid-abc'

			// WHEN
			equipmentMatchingStore.setMatch(name, uuid)

			// THEN
			expect(equipmentMatchingStore.manualMatches.get(name)).toBe(uuid)
		})

		it('GIVEN an existing match WHEN setMatch is called with an empty string THEN should remove the match', () => {
			// GIVEN
			equipmentMatchingStore.manualMatches.set('Breaker1', 'some-uuid')

			// WHEN
			equipmentMatchingStore.setMatch('Breaker1', '')

			// THEN
			expect(equipmentMatchingStore.manualMatches.has('Breaker1')).toBe(
				false
			)
		})

		it('GIVEN an existing match WHEN setMatch is called with a new uuid THEN should update the match', () => {
			// GIVEN
			equipmentMatchingStore.manualMatches.set('Breaker1', 'old-uuid')

			// WHEN
			equipmentMatchingStore.setMatch('Breaker1', 'new-uuid')

			// THEN
			expect(equipmentMatchingStore.manualMatches.get('Breaker1')).toBe(
				'new-uuid'
			)
		})
	})

	describe('selectedTemplateCounts', () => {
		it('GIVEN no manual matches WHEN selectedTemplateCounts is accessed THEN should return empty map', () => {
			// GIVEN no manual matches (cleared in beforeEach)

			// WHEN / THEN
			expect(equipmentMatchingStore.selectedTemplateCounts.size).toBe(0)
		})

		it('GIVEN multiple matches pointing to the same template WHEN selectedTemplateCounts is accessed THEN should count occurrences correctly', () => {
			// GIVEN
			equipmentMatchingStore.setMatch('eq1', 'template-uuid-1')
			equipmentMatchingStore.setMatch('eq2', 'template-uuid-1')
			equipmentMatchingStore.setMatch('eq3', 'template-uuid-2')
			flushSync()

			// WHEN
			const counts = equipmentMatchingStore.selectedTemplateCounts

			// THEN
			expect(counts.get('template-uuid-1')).toBe(2)
			expect(counts.get('template-uuid-2')).toBe(1)
		})

		it('GIVEN each equipment mapped to a unique template WHEN selectedTemplateCounts is accessed THEN each count should be 1', () => {
			// GIVEN
			equipmentMatchingStore.setMatch('eq1', 'tmpl-A')
			equipmentMatchingStore.setMatch('eq2', 'tmpl-B')
			flushSync()

			// WHEN
			const counts = equipmentMatchingStore.selectedTemplateCounts

			// THEN
			expect(counts.get('tmpl-A')).toBe(1)
			expect(counts.get('tmpl-B')).toBe(1)
		})
	})

	describe('templatesByType', () => {
		it('GIVEN no selected bay type WHEN templatesByType is accessed THEN should return empty map', () => {
			// GIVEN
			ssdImportStore.selectedBayType = null

			// WHEN / THEN
			expect(equipmentMatchingStore.templatesByType.size).toBe(0)
		})

		it('GIVEN selected bay type that does not exist in bayTypes WHEN templatesByType is accessed THEN should return empty map', () => {
			// GIVEN
			ssdImportStore.selectedBayType = 'non-existent-uuid'
			ssdImportStore.bayTypes = []

			// WHEN / THEN
			expect(equipmentMatchingStore.templatesByType.size).toBe(0)
		})

		it('GIVEN a selected bay type with templates of different types WHEN templatesByType is accessed THEN should group each template under its type', () => {
			// GIVEN
			const tmplCBR = createTemplate('tmpl-1', 'CBR')
			const tmplDIS = createTemplate('tmpl-2', 'DIS')

			ssdImportStore.conductingEquipmentTemplates = [tmplCBR, tmplDIS]
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{
							uuid: 'ce-1',
							templateUuid: 'tmpl-1',
							virtual: false
						},
						{ uuid: 'ce-2', templateUuid: 'tmpl-2', virtual: false }
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'

			// WHEN
			const byType = equipmentMatchingStore.templatesByType

			// THEN
			expect(byType.get('CBR')).toEqual([tmplCBR])
			expect(byType.get('DIS')).toEqual([tmplDIS])
		})

		it('GIVEN a bay type with two conducting equipments of the same template type WHEN templatesByType is accessed THEN should list both templates under that type', () => {
			// GIVEN
			const tmpl1 = createTemplate('tmpl-1', 'CBR', 'Breaker1')
			const tmpl2 = createTemplate('tmpl-2', 'CBR', 'Breaker2')

			ssdImportStore.conductingEquipmentTemplates = [tmpl1, tmpl2]
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{
							uuid: 'ce-1',
							templateUuid: 'tmpl-1',
							virtual: false
						},
						{ uuid: 'ce-2', templateUuid: 'tmpl-2', virtual: false }
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'

			// WHEN
			const byType = equipmentMatchingStore.templatesByType

			// THEN
			expect(byType.get('CBR')).toHaveLength(2)
			expect(byType.get('CBR')).toEqual(
				expect.arrayContaining([tmpl1, tmpl2])
			)
		})

		it('GIVEN a conducting equipment with an unknown template uuid WHEN templatesByType is accessed THEN should skip that entry', () => {
			// GIVEN
			ssdImportStore.conductingEquipmentTemplates = []
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{
							uuid: 'ce-1',
							templateUuid: 'unknown-tmpl',
							virtual: false
						}
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'

			// WHEN / THEN
			expect(equipmentMatchingStore.templatesByType.size).toBe(0)
		})
	})

	describe('requiredTemplateCounts', () => {
		it('GIVEN no selected bay type WHEN requiredTemplateCounts is accessed THEN should return empty map', () => {
			// GIVEN
			ssdImportStore.selectedBayType = null

			// WHEN / THEN
			expect(equipmentMatchingStore.requiredTemplateCounts.size).toBe(0)
		})

		it('GIVEN a bay type with multiple conducting equipments sharing a template WHEN requiredTemplateCounts is accessed THEN should sum the counts', () => {
			// GIVEN
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{
							uuid: 'ce-1',
							templateUuid: 'tmpl-A',
							virtual: false
						},
						{
							uuid: 'ce-2',
							templateUuid: 'tmpl-A',
							virtual: false
						},
						{ uuid: 'ce-3', templateUuid: 'tmpl-B', virtual: false }
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'

			// WHEN
			const counts = equipmentMatchingStore.requiredTemplateCounts

			// THEN
			expect(counts.get('tmpl-A')).toBe(2)
			expect(counts.get('tmpl-B')).toBe(1)
		})

		it('GIVEN a selected bay type that does not exist in bayTypes WHEN requiredTemplateCounts is accessed THEN should return empty map', () => {
			// GIVEN
			ssdImportStore.bayTypes = []
			ssdImportStore.selectedBayType = 'ghost-bay'

			// WHEN / THEN
			expect(equipmentMatchingStore.requiredTemplateCounts.size).toBe(0)
		})
	})

	describe('templateCountMismatch', () => {
		describe('GIVEN a bay type with two templates of the same type', () => {
			beforeEach(() => {
				const tmpl1 = createTemplate('tmpl-1', 'CBR', 'Breaker1')
				const tmpl2 = createTemplate('tmpl-2', 'CBR', 'Breaker2')

				ssdImportStore.conductingEquipmentTemplates = [tmpl1, tmpl2]
				ssdImportStore.bayTypes = [
					{
						uuid: 'bay-1',
						name: 'BayType1',
						conductingEquipments: [
							{
								uuid: 'ce-1',
								templateUuid: 'tmpl-1',
								virtual: false
							},
							{
								uuid: 'ce-2',
								templateUuid: 'tmpl-2',
								virtual: false
							}
						],
						functions: []
					}
				]
				ssdImportStore.selectedBayType = 'bay-1'
				flushSync()
			})

			it('WHEN no manual matches are set THEN should report mismatches for both templates', () => {
				// WHEN no manual matches (cleared in beforeEach)

				// THEN
				const mismatches = equipmentMatchingStore.templateCountMismatch
				expect(mismatches).toHaveLength(2)
				const uuids = mismatches.map((m) => m.templateUuid)
				expect(uuids).toContain('tmpl-1')
				expect(uuids).toContain('tmpl-2')
				expect(
					mismatches.find((m) => m.templateUuid === 'tmpl-1')
				).toMatchObject({ required: 1, selected: 0 })
			})

			it('WHEN manual matches satisfy all required counts THEN should report no mismatches', () => {
				// WHEN
				equipmentMatchingStore.setMatch('eq-A', 'tmpl-1')
				equipmentMatchingStore.setMatch('eq-B', 'tmpl-2')
				flushSync()

				// THEN
				expect(
					equipmentMatchingStore.templateCountMismatch
				).toHaveLength(0)
			})

			it('WHEN only one of two ambiguous templates is matched correctly THEN should report mismatch for the unmatched template', () => {
				// WHEN only tmpl-1 is satisfied
				equipmentMatchingStore.setMatch('eq-A', 'tmpl-1')
				flushSync()

				// THEN tmpl-2 is still missing
				const mismatches = equipmentMatchingStore.templateCountMismatch
				expect(mismatches).toHaveLength(1)
				expect(mismatches[0].templateUuid).toBe('tmpl-2')
				expect(mismatches[0]).toMatchObject({
					required: 1,
					selected: 0
				})
			})
		})

		it('GIVEN a bay type where each type has only one template WHEN templateCountMismatch is accessed THEN should report no mismatches (no ambiguity)', () => {
			// GIVEN – unique types, no ambiguity
			const tmplCBR = createTemplate('tmpl-1', 'CBR')
			const tmplDIS = createTemplate('tmpl-2', 'DIS')

			ssdImportStore.conductingEquipmentTemplates = [tmplCBR, tmplDIS]
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{
							uuid: 'ce-1',
							templateUuid: 'tmpl-1',
							virtual: false
						},
						{ uuid: 'ce-2', templateUuid: 'tmpl-2', virtual: false }
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'

			// WHEN no manual matches

			// THEN – no mismatches because each type is unambiguous
			expect(equipmentMatchingStore.templateCountMismatch).toHaveLength(0)
		})

		it('GIVEN no selected bay type WHEN templateCountMismatch is accessed THEN should return empty array', () => {
			// GIVEN
			ssdImportStore.selectedBayType = null

			// WHEN / THEN
			expect(equipmentMatchingStore.templateCountMismatch).toHaveLength(0)
		})
	})

	describe('templateCountsValid', () => {
		it('GIVEN no ambiguous templates WHEN templateCountsValid is accessed THEN should be true', () => {
			// GIVEN – unique type per template
			ssdImportStore.conductingEquipmentTemplates = [
				createTemplate('tmpl-1', 'CBR')
			]
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{ uuid: 'ce-1', templateUuid: 'tmpl-1', virtual: false }
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'

			// WHEN / THEN
			expect(equipmentMatchingStore.templateCountsValid).toBe(true)
		})

		it('GIVEN ambiguous templates with unsatisfied counts WHEN templateCountsValid is accessed THEN should be false', () => {
			// GIVEN – two templates of same type, neither matched
			ssdImportStore.conductingEquipmentTemplates = [
				createTemplate('tmpl-1', 'CBR'),
				createTemplate('tmpl-2', 'CBR')
			]
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{
							uuid: 'ce-1',
							templateUuid: 'tmpl-1',
							virtual: false
						},
						{ uuid: 'ce-2', templateUuid: 'tmpl-2', virtual: false }
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'

			// WHEN / THEN
			expect(equipmentMatchingStore.templateCountsValid).toBe(false)
		})

		it('GIVEN ambiguous templates with all counts satisfied WHEN templateCountsValid is accessed THEN should be true', () => {
			// GIVEN
			ssdImportStore.conductingEquipmentTemplates = [
				createTemplate('tmpl-1', 'CBR'),
				createTemplate('tmpl-2', 'CBR')
			]
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-1',
					name: 'BayType1',
					conductingEquipments: [
						{
							uuid: 'ce-1',
							templateUuid: 'tmpl-1',
							virtual: false
						},
						{ uuid: 'ce-2', templateUuid: 'tmpl-2', virtual: false }
					],
					functions: []
				}
			]
			ssdImportStore.selectedBayType = 'bay-1'
			equipmentMatchingStore.setMatch('eq-A', 'tmpl-1')
			equipmentMatchingStore.setMatch('eq-B', 'tmpl-2')
			flushSync()

			// WHEN / THEN
			expect(equipmentMatchingStore.templateCountsValid).toBe(true)
		})
	})
})
