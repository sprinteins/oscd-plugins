import { describe, it, expect, beforeEach } from 'vitest'
import { equipmentMatchingStore } from './equipment-matching.store.svelte'
import type { ValidationResult } from '@/headless/matching/validation'

describe('equipmentMatchingStore', () => {
	beforeEach(() => {
		// Reset store state
		equipmentMatchingStore.validationResult = null
		equipmentMatchingStore.manualMatches.clear()
		equipmentMatchingStore.isManualMatchingExpanded = false
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

		it('GIVEN validation requires manual matching WHEN setValidationResult is called THEN should expand manual matching UI', () => {
			// GIVEN validation requires manual matching
			const result: ValidationResult = {
				isValid: false,
				errors: ['Ambiguous equipment'],
				requiresManualMatching: true,
				ambiguousTypes: [
					{
						typeCode: 'CBR',
						templateNames: ['Breaker1', 'Breaker2']
					}
				]
			}

			// WHEN setValidationResult is called
			equipmentMatchingStore.setValidationResult(result)

			// THEN should expand manual matching UI
			expect(equipmentMatchingStore.isManualMatchingExpanded).toBe(true)
		})

		it('GIVEN validation does not require manual matching WHEN setValidationResult is called THEN should not expand manual matching UI', () => {
			// GIVEN validation does not require manual matching
			const result: ValidationResult = {
				isValid: true,
				errors: []
			}

			// WHEN setValidationResult is called
			equipmentMatchingStore.setValidationResult(result)

			// THEN should not expand manual matching UI
			expect(equipmentMatchingStore.isManualMatchingExpanded).toBe(false)
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

	describe('setManualMatch', () => {
		it('GIVEN equipment name and template UUID WHEN setManualMatch is called THEN should add match to map', () => {
			// GIVEN equipment name and template UUID
			const equipmentName = 'Breaker1'
			const templateUuid = 'template-uuid-123'

			// WHEN setManualMatch is called
			equipmentMatchingStore.setManualMatch(equipmentName, templateUuid)

			// THEN should add match to map
			expect(
				equipmentMatchingStore.manualMatches.get(equipmentName)
			).toBe(templateUuid)
		})

		it('GIVEN multiple manual matches WHEN setManualMatch is called multiple times THEN should store all matches', () => {
			// GIVEN multiple manual matches
			const matches = [
				{ name: 'Breaker1', uuid: 'uuid1' },
				{ name: 'Breaker2', uuid: 'uuid2' },
				{ name: 'Disconnector1', uuid: 'uuid3' }
			]

			// WHEN setManualMatch is called multiple times
			matches.forEach((m) =>
				equipmentMatchingStore.setManualMatch(m.name, m.uuid)
			)

			// THEN should store all matches
			expect(equipmentMatchingStore.manualMatches.size).toBe(3)
			matches.forEach((m) => {
				expect(equipmentMatchingStore.manualMatches.get(m.name)).toBe(
					m.uuid
				)
			})
		})

		it('GIVEN existing match WHEN setManualMatch is called with same equipment name THEN should update match', () => {
			// GIVEN existing match
			equipmentMatchingStore.setManualMatch('Breaker1', 'old-uuid')

			// WHEN setManualMatch is called with same equipment name
			equipmentMatchingStore.setManualMatch('Breaker1', 'new-uuid')

			// THEN should update match
			expect(equipmentMatchingStore.manualMatches.get('Breaker1')).toBe(
				'new-uuid'
			)
			expect(equipmentMatchingStore.manualMatches.size).toBe(1)
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
			equipmentMatchingStore.isManualMatchingExpanded = true

			// WHEN reset is called
			equipmentMatchingStore.reset()

			// THEN should clear all state
			expect(equipmentMatchingStore.validationResult).toBeNull()
			expect(equipmentMatchingStore.manualMatches.size).toBe(0)
			expect(equipmentMatchingStore.isManualMatchingExpanded).toBe(false)
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
		it('GIVEN validation result and manual matches exist WHEN clearValidationResult is called THEN should clear validation and matches', () => {
			// GIVEN validation result and manual matches exist
			equipmentMatchingStore.validationResult = {
				isValid: true,
				errors: []
			}
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')
			equipmentMatchingStore.isManualMatchingExpanded = true

			// WHEN clearValidationResult is called
			equipmentMatchingStore.clearValidationResult()

			// THEN should clear validation and matches
			expect(equipmentMatchingStore.validationResult).toBeNull()
			expect(equipmentMatchingStore.manualMatches.size).toBe(0)
			expect(equipmentMatchingStore.isManualMatchingExpanded).toBe(false)
		})
	})

	describe('toggleManualMatching', () => {
		it('GIVEN manual matching is collapsed WHEN toggleManualMatching is called THEN should expand', () => {
			// GIVEN manual matching is collapsed
			equipmentMatchingStore.isManualMatchingExpanded = false

			// WHEN toggleManualMatching is called
			equipmentMatchingStore.toggleManualMatching()

			// THEN should expand
			expect(equipmentMatchingStore.isManualMatchingExpanded).toBe(true)
		})

		it('GIVEN manual matching is expanded WHEN toggleManualMatching is called THEN should collapse', () => {
			// GIVEN manual matching is expanded
			equipmentMatchingStore.isManualMatchingExpanded = true

			// WHEN toggleManualMatching is called
			equipmentMatchingStore.toggleManualMatching()

			// THEN should collapse
			expect(equipmentMatchingStore.isManualMatchingExpanded).toBe(false)
		})

		it('GIVEN multiple toggles WHEN toggleManualMatching is called repeatedly THEN should alternate state', () => {
			// GIVEN multiple toggles
			const initialState = equipmentMatchingStore.isManualMatchingExpanded

			// WHEN toggleManualMatching is called repeatedly
			equipmentMatchingStore.toggleManualMatching()
			const firstToggle = equipmentMatchingStore.isManualMatchingExpanded

			equipmentMatchingStore.toggleManualMatching()
			const secondToggle = equipmentMatchingStore.isManualMatchingExpanded

			// THEN should alternate state
			expect(firstToggle).toBe(!initialState)
			expect(secondToggle).toBe(initialState)
		})
	})

	describe('areAllManualMatchesSet', () => {
		it('GIVEN no manual matches and requiredCount is 0 WHEN areAllManualMatchesSet is called THEN should return true', () => {
			// GIVEN no manual matches and requiredCount is 0

			// WHEN areAllManualMatchesSet is called
			const result = equipmentMatchingStore.areAllManualMatchesSet(0)

			// THEN should return true
			expect(result).toBe(true)
		})

		it('GIVEN fewer matches than required WHEN areAllManualMatchesSet is called THEN should return false', () => {
			// GIVEN fewer matches than required
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')
			equipmentMatchingStore.manualMatches.set('eq2', 'template2')

			// WHEN areAllManualMatchesSet is called with requiredCount=3
			const result = equipmentMatchingStore.areAllManualMatchesSet(3)

			// THEN should return false
			expect(result).toBe(false)
		})

		it('GIVEN exact number of required matches WHEN areAllManualMatchesSet is called THEN should return true', () => {
			// GIVEN exact number of required matches
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')
			equipmentMatchingStore.manualMatches.set('eq2', 'template2')
			equipmentMatchingStore.manualMatches.set('eq3', 'template3')

			// WHEN areAllManualMatchesSet is called with requiredCount=3
			const result = equipmentMatchingStore.areAllManualMatchesSet(3)

			// THEN should return true
			expect(result).toBe(true)
		})

		it('GIVEN more matches than required WHEN areAllManualMatchesSet is called THEN should return true', () => {
			// GIVEN more matches than required
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')
			equipmentMatchingStore.manualMatches.set('eq2', 'template2')
			equipmentMatchingStore.manualMatches.set('eq3', 'template3')
			equipmentMatchingStore.manualMatches.set('eq4', 'template4')

			// WHEN areAllManualMatchesSet is called with requiredCount=3
			const result = equipmentMatchingStore.areAllManualMatchesSet(3)

			// THEN should return true
			expect(result).toBe(true)
		})
	})
})
