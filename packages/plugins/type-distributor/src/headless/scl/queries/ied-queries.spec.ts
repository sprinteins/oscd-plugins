import { describe, it, expect, beforeEach, vi } from 'vitest'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { queryAccessPointsFromIed, queryIEDs, queryIedExists } from './ied-queries'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		host: null
	}
}))

describe('queryIEDs', () => {
	let mockDocument: Document

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="IED1"></IED>
				<IED name="IED2"></IED>
				<IED name="IED3"></IED>
				<IED name="IED4"></IED>
				<Substation name="Sub1">
					<VoltageLevel name="VL1">
						<Bay name="Bay1">
							<LNode iedName="IED2" />
						</Bay>
						<Bay name="Bay2">
							<LNode iedName="IED3" />
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		pluginGlobalStore.xmlDocument = mockDocument
	})

	it('should return ieds not assigned to a Bay', () => {
		const result = queryIEDs('Bay1')

		const iedNames = result.map((ied) => ied.getAttribute('name'))
		expect(iedNames).toContain('IED1')
		expect(iedNames).toContain('IED4')
	})

	it('should return ieds assigned to a selected Bay', () => {
		const result = queryIEDs('Bay1')

		const iedNames = result.map((ied) => ied.getAttribute('name'))
		expect(iedNames).toContain('IED2')
		expect(result.length).toBeGreaterThan(0)
	})

	it('should return empty array if no IEDs found', () => {
		const emptyDoc = new DOMParser().parseFromString(
			'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>',
			'application/xml'
		)
		pluginGlobalStore.xmlDocument = emptyDoc

		const result = queryIEDs('')

		expect(result).toEqual([])
	})

	it('should not return ieds assigned to a not selected Bay', () => {
		const result = queryIEDs('Bay1')

		const iedNames = result.map((ied) => ied.getAttribute('name'))
		expect(iedNames).not.toContain('IED3')
	})

	it('should return empty array when xmlDocument is undefined', () => {
		pluginGlobalStore.xmlDocument = undefined

		const result = queryIEDs('Bay1')

		expect(result).toEqual([])
	})

	it('should return all unassigned IEDs and selected bay IEDs together', () => {
		const result = queryIEDs('Bay2')

		const iedNames = result.map((ied) => ied.getAttribute('name'))
		expect(iedNames).toContain('IED1')
		expect(iedNames).toContain('IED3')
		expect(iedNames).toContain('IED4')
		expect(iedNames).not.toContain('IED2')
		expect(result.length).toBe(3)
	})

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
})
