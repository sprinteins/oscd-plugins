import { describe, it, expect } from 'vitest'
import type { LNodeType } from '@/headless/common-types'
import { createLD0Element, createLD0LNodeTemplates } from './ldevice-element'

const DOC = new DOMParser().parseFromString(
	'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"/>',
	'application/xml'
) as XMLDocument

function makeLNodeType(lnClass: string, id = `${lnClass}Type`): LNodeType {
	return { id, lnClass, dataObjects: [] } as LNodeType
}

describe('createLD0LNodeTemplates', () => {
	it('GIVEN empty lnodeTypes WHEN called THEN returns empty array', () => {
		expect(createLD0LNodeTemplates([])).toEqual([])
	})

	describe('GIVEN lnodeTypes starting with "L"', () => {
		it('WHEN called THEN maps lnType to the type id', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LPHD')])

			expect(result[0].lnType).toBe('LPHDType')
		})

		it('WHEN lnClass is LLN0 THEN lnInst is empty string', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LLN0')])

			expect(result[0].lnInst).toBe('')
		})

		it('WHEN lnClass is not LLN0 THEN lnInst is "1"', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LPHD')])

			expect(result[0].lnInst).toBe('1')
		})
	})

	describe('GIVEN LGOS and LSVS lnodeTypes', () => {
		it('WHEN called THEN excludes LGOS', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LGOS')])

			expect(result).toHaveLength(0)
		})

		it('WHEN called THEN excludes LSVS', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LSVS')])

			expect(result).toHaveLength(0)
		})

		it('WHEN mixed with LPHD THEN only LPHD is included', () => {
			const result = createLD0LNodeTemplates([
				makeLNodeType('LPHD'),
				makeLNodeType('LGOS'),
				makeLNodeType('LSVS')
			])

			expect(result).toHaveLength(1)
			expect(result[0].lnClass).toBe('LPHD')
		})
	})

	describe('GIVEN duplicate lnodeTypes for the same class', () => {
		it('WHEN called THEN keeps only the first type for that class', () => {
			const result = createLD0LNodeTemplates([
				makeLNodeType('LPHD', 'LPHDFirst'),
				makeLNodeType('LPHD', 'LPHDSecond')
			])

			expect(result).toHaveLength(1)
			expect(result[0].lnType).toBe('LPHDFirst')
		})
	})

	describe('GIVEN LLN0 mixed with other classes', () => {
		it('WHEN called THEN LLN0 is first in the result', () => {
			const result = createLD0LNodeTemplates([
				makeLNodeType('LPHD'),
				makeLNodeType('LLN0')
			])

			expect(result[0].lnClass).toBe('LLN0')
		})
	})
})

describe('createLD0Element', () => {
	it('GIVEN any lnodeTypes WHEN called THEN creates LDevice with inst="LD0" and ldName="LD0"', () => {
		const ld0 = createLD0Element(DOC, [])

		expect(ld0.getAttribute('inst')).toBe('LD0')
		expect(ld0.getAttribute('ldName')).toBe('LD0')
	})

	it('GIVEN empty lnodeTypes WHEN called THEN LDevice has no children', () => {
		const ld0 = createLD0Element(DOC, [])

		expect(ld0.children).toHaveLength(0)
	})

	describe('GIVEN LLN0 lnodeType', () => {
		it('WHEN called THEN creates LN0 child with correct attributes', () => {
			const ld0 = createLD0Element(DOC, [makeLNodeType('LLN0')])

			const ln0 = ld0.querySelector(
				'LN0[lnClass="LLN0"][lnType="LLN0Type"]'
			)
			expect(ln0).not.toBeNull()
			expect(ln0?.getAttribute('lnInst')).toBe('')
		})

		it('WHEN called THEN does not create an LN element', () => {
			const ld0 = createLD0Element(DOC, [makeLNodeType('LLN0')])

			expect(ld0.querySelector('LN')).toBeNull()
		})
	})

	describe('GIVEN LPHD lnodeType', () => {
		it('WHEN called THEN creates LN child with correct attributes', () => {
			const ld0 = createLD0Element(DOC, [makeLNodeType('LPHD')])

			const ln = ld0.querySelector(
				'LN[lnClass="LPHD"][lnType="LPHDType"][lnInst="1"]'
			)
			expect(ln).not.toBeNull()
		})

		it('WHEN called THEN does not create an LN0 element', () => {
			const ld0 = createLD0Element(DOC, [makeLNodeType('LPHD')])

			expect(ld0.querySelector('LN0')).toBeNull()
		})
	})

	it('GIVEN LGOS lnodeType WHEN called THEN does not create any child', () => {
		const ld0 = createLD0Element(DOC, [makeLNodeType('LGOS')])

		expect(ld0.children).toHaveLength(0)
	})
})
