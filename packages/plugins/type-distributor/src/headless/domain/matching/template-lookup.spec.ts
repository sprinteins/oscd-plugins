import { describe, expect, it } from 'vitest'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import {
	getConductingEquipmentTemplate,
	getFunctionTemplate
} from './template-lookup'

const ceTemplate1: ConductingEquipmentTemplate = {
	uuid: 'ce-uuid-1',
	name: 'Breaker',
	type: 'CBR',
	terminals: [],
	eqFunctions: []
}

const ceTemplate2: ConductingEquipmentTemplate = {
	uuid: 'ce-uuid-2',
	name: 'Switch',
	type: 'DIS',
	terminals: [],
	eqFunctions: []
}

const funcTemplate1: FunctionTemplate = {
	uuid: 'fn-uuid-1',
	name: 'CBFunction',
	lnodes: []
}

const funcTemplate2: FunctionTemplate = {
	uuid: 'fn-uuid-2',
	name: 'ProtectionFunction',
	lnodes: []
}

describe('getConductingEquipmentTemplate', () => {
	describe('GIVEN a list of conducting equipment templates', () => {
		it('WHEN a matching uuid is provided THEN it returns the correct template', () => {
			const result = getConductingEquipmentTemplate(
				[ceTemplate1, ceTemplate2],
				'ce-uuid-2'
			)
			expect(result).toBe(ceTemplate2)
		})

		it('WHEN no template matches the uuid THEN it returns undefined', () => {
			const result = getConductingEquipmentTemplate(
				[ceTemplate1, ceTemplate2],
				'non-existent'
			)
			expect(result).toBeUndefined()
		})

		it('WHEN the list is empty THEN it returns undefined', () => {
			const result = getConductingEquipmentTemplate([], 'ce-uuid-1')
			expect(result).toBeUndefined()
		})

		it('WHEN multiple templates exist THEN it returns the first match', () => {
			const duplicate: ConductingEquipmentTemplate = {
				...ceTemplate1,
				name: 'DuplicateBreaker'
			}
			const result = getConductingEquipmentTemplate(
				[ceTemplate1, duplicate],
				'ce-uuid-1'
			)
			expect(result).toBe(ceTemplate1)
		})
	})
})

describe('getFunctionTemplate', () => {
	describe('GIVEN a list of function templates', () => {
		it('WHEN a matching uuid is provided THEN it returns the correct template', () => {
			const result = getFunctionTemplate(
				[funcTemplate1, funcTemplate2],
				'fn-uuid-1'
			)
			expect(result).toBe(funcTemplate1)
		})

		it('WHEN no template matches the uuid THEN it returns undefined', () => {
			const result = getFunctionTemplate(
				[funcTemplate1, funcTemplate2],
				'non-existent'
			)
			expect(result).toBeUndefined()
		})

		it('WHEN the list is empty THEN it returns undefined', () => {
			const result = getFunctionTemplate([], 'fn-uuid-1')
			expect(result).toBeUndefined()
		})
	})
})
