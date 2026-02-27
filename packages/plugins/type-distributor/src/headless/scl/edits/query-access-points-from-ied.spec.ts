import { describe, it, expect } from 'vitest'
import { queryAccessPointsFromIed } from './query-access-points-from-ied'

describe('queryAccessPointsFromIed', () => {
	function createDocument(xml: string): XMLDocument {
		return new DOMParser().parseFromString(xml, 'application/xml')
	}

	describe('basic functionality', () => {
		it('GIVEN IED with access points WHEN queryAccessPointsFromIed is called THEN should return access point names', () => {
			// GIVEN IED with access points
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1">
						<AccessPoint name="AP1" />
						<AccessPoint name="AP2" />
					</IED>
				</SCL>
			`)

			// WHEN queryAccessPointsFromIed is called
			const result = queryAccessPointsFromIed(doc, 'IED1')

			// THEN should return access point names
			expect(result).toEqual(['AP1', 'AP2'])
		})

		it('GIVEN IED without access points WHEN queryAccessPointsFromIed is called THEN should return empty array', () => {
			// GIVEN IED without access points
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1"></IED>
				</SCL>
			`)

			// WHEN queryAccessPointsFromIed is called
			const result = queryAccessPointsFromIed(doc, 'IED1')

			// THEN should return empty array
			expect(result).toEqual([])
		})

		it('GIVEN non-existent IED name WHEN queryAccessPointsFromIed is called THEN should return empty array', () => {
			// GIVEN non-existent IED name
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1">
						<AccessPoint name="AP1" />
					</IED>
				</SCL>
			`)

			// WHEN queryAccessPointsFromIed is called
			const result = queryAccessPointsFromIed(doc, 'NonExistentIED')

			// THEN should return empty array
			expect(result).toEqual([])
		})
	})

	describe('edge cases', () => {
		it('GIVEN null xmlDocument WHEN queryAccessPointsFromIed is called THEN should return empty array', () => {
			// GIVEN null xmlDocument
			// WHEN queryAccessPointsFromIed is called
			const result = queryAccessPointsFromIed(null, 'IED1')

			// THEN should return empty array
			expect(result).toEqual([])
		})

		it('GIVEN undefined xmlDocument WHEN queryAccessPointsFromIed is called THEN should return empty array', () => {
			// GIVEN undefined xmlDocument
			// WHEN queryAccessPointsFromIed is called
			const result = queryAccessPointsFromIed(undefined, 'IED1')

			// THEN should return empty array
			expect(result).toEqual([])
		})

		it('GIVEN access point without name attribute WHEN queryAccessPointsFromIed is called THEN should filter it out', () => {
			// GIVEN access point without name attribute
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1">
						<AccessPoint name="AP1" />
						<AccessPoint />
						<AccessPoint name="AP2" />
					</IED>
				</SCL>
			`)

			// WHEN queryAccessPointsFromIed is called
			const result = queryAccessPointsFromIed(doc, 'IED1')

			// THEN should filter it out
			expect(result).toEqual(['AP1', 'AP2'])
		})
	})

	describe('multiple IEDs', () => {
		it('GIVEN multiple IEDs WHEN queryAccessPointsFromIed is called THEN should only return access points from specified IED', () => {
			// GIVEN multiple IEDs
			const doc = createDocument(`
				<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1">
						<AccessPoint name="AP1" />
					</IED>
					<IED name="IED2">
						<AccessPoint name="AP2" />
						<AccessPoint name="AP3" />
					</IED>
				</SCL>
			`)

			// WHEN queryAccessPointsFromIed is called
			const result = queryAccessPointsFromIed(doc, 'IED1')

			// THEN should only return access points from specified IED
			expect(result).toEqual(['AP1'])
		})
	})
})
