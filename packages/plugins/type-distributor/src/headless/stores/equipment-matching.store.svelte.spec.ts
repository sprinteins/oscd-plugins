import { describe, it, expect, beforeEach } from 'vitest'
import { equipmentMatchingStore } from './equipment-matching.store.svelte'
import type { ValidationResult } from '@/headless/matching/validation'

describe('equipmentMatchingStore', () => {
	beforeEach(() => {
		// Reset store state
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
		it('GIVEN validation result and manual matches exist WHEN clearValidationResult is called THEN should clear validation and matches', () => {
			// GIVEN validation result and manual matches exist
			equipmentMatchingStore.validationResult = {
				isValid: true,
				errors: []
			}
			equipmentMatchingStore.manualMatches.set('eq1', 'template1')

			// WHEN clearValidationResult is called
			equipmentMatchingStore.clearValidationResult()

			// THEN should clear validation and matches
			expect(equipmentMatchingStore.validationResult).toBeNull()
			expect(equipmentMatchingStore.manualMatches.size).toBe(0)
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
})
