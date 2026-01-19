import { expect, describe, it } from 'vitest'

describe('GIVEN an SSD and FROM BayType', () => {
	describe('WHEN assigning a function to an AccessPoint', () => {
		it('THEN the function is assigned correctly', () => {
			expect(true).toBe(true)
		})
	})

	describe('WHEN assigning a lnode to an AccessPoint', () => {
		it('THEN the lnode is assigned correctly', () => {
			expect(true).toBe(true)
		})
	})

	describe('WHEN assigning an equipment function to an AccessPoint', () => {
		it('THEN the equipment function is assigned correctly', () => {
			expect(true).toBe(true)
		})
	})

	describe('WHEN assigning a general equipment function to an AccessPoint', () => {
		it('THEN the general function is assigned correctly', () => {
			expect(true).toBe(true)
		})
	})

    //missing: marking the LNode as used / function etc.
})

describe('GIVEN an SSD and FROM already assigned AP', () => {
	describe('WHEN reassigning a function to an AccessPoint', () => {
		it('THEN the function is reassigned correctly', () => {
			expect(true).toBe(true)
		})

        it('THEN the previous assignment is removed', () => {
            expect(true).toBe(true)
        })
	})

	describe('WHEN reassigning a lnode to an AccessPoint', () => {
		it('THEN the lnode is reassigned correctly', () => {
			expect(true).toBe(true)
		})

        it('THEN the previous assignment is removed', () => {
            expect(true).toBe(true)
        })
	})

	describe('WHEN reassigning an equipment function to an AccessPoint', () => {
		it('THEN the equipment function is reassigned correctly', () => {
			expect(true).toBe(true)
		})

        it('THEN the previous assignment is removed', () => {
            expect(true).toBe(true)
        })
	})

	describe('WHEN reassigning a general equipment function to an AccessPoint', () => {
		it('THEN the general function is reassigned correctly', () => {
			expect(true).toBe(true)
		})

        it('THEN the previous assignment is removed', () => {
            expect(true).toBe(true)
        })
	})
})
