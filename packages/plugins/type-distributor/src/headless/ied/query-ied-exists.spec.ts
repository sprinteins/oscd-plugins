import { describe, it, expect } from 'vitest'
import { queryIedExists } from './query-ied-exists'

describe('queryIedExists', () => {
	function createDocument(xml: string): XMLDocument {
		return new DOMParser().parseFromString(xml, 'application/xml')
	}

	describe('basic functionality', () => {
		it('GIVEN existing IED WHEN queryIedExists is called THEN should return true', () => {
			// GIVEN existing IED
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1" />
				</SCL>
			`)

			// WHEN queryIedExists is called
			const result = queryIedExists(doc, 'IED1')

			// THEN should return true
			expect(result).toBe(true)
		})

		it('GIVEN non-existent IED WHEN queryIedExists is called THEN should return false', () => {
			// GIVEN non-existent IED
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1" />
				</SCL>
			`)

			// WHEN queryIedExists is called
			const result = queryIedExists(doc, 'NonExistentIED')

			// THEN should return false
			expect(result).toBe(false)
		})
	})

	describe('edge cases', () => {
		it('GIVEN null xmlDocument WHEN queryIedExists is called THEN should return false', () => {
			// GIVEN null xmlDocument
			// WHEN queryIedExists is called
			const result = queryIedExists(null, 'IED1')

			// THEN should return false
			expect(result).toBe(false)
		})

		it('GIVEN undefined xmlDocument WHEN queryIedExists is called THEN should return false', () => {
			// GIVEN undefined xmlDocument
			// WHEN queryIedExists is called
			const result = queryIedExists(undefined, 'IED1')

			// THEN should return false
			expect(result).toBe(false)
		})

		it('GIVEN empty document WHEN queryIedExists is called THEN should return false', () => {
			// GIVEN empty document
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				</SCL>
			`)

			// WHEN queryIedExists is called
			const result = queryIedExists(doc, 'IED1')

			// THEN should return false
			expect(result).toBe(false)
		})
	})

	describe('multiple IEDs', () => {
		it('GIVEN multiple IEDs WHEN queryIedExists is called with existing name THEN should return true', () => {
			// GIVEN multiple IEDs
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1" />
					<IED name="IED2" />
					<IED name="IED3" />
				</SCL>
			`)

			// WHEN queryIedExists is called with existing name
			const result = queryIedExists(doc, 'IED2')

			// THEN should return true
			expect(result).toBe(true)
		})
	})
})
