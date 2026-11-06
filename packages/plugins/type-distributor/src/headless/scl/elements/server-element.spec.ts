import { describe, expect, it } from 'vitest'
import {
	queryServer,
	queryServerAtAccessPointsFromHost
} from './server-element'

describe('queryServer', () => {
	it('GIVEN an AccessPoint with a Server WHEN queried THEN returns its Server', () => {
		const doc = new DOMParser().parseFromString(
			'<IED><AccessPoint name="AP1"><Server /></AccessPoint></IED>',
			'application/xml'
		)
		const accessPoint = doc.querySelector('AccessPoint') as Element
		const server = accessPoint.querySelector('Server')

		expect(queryServer(accessPoint)).toBe(server)
	})

	it('GIVEN an AccessPoint with ServerAt WHEN queried THEN returns referenced Server', () => {
		const doc = new DOMParser().parseFromString(
			'<IED><AccessPoint name="AP1"><ServerAt apName="AP2" /></AccessPoint><AccessPoint name="AP2"><Server /></AccessPoint></IED>',
			'application/xml'
		)
		const accessPoint = doc.querySelector(
			'AccessPoint[name="AP1"]'
		) as Element
		const server = doc.querySelector('Server')

		expect(queryServer(accessPoint)).toBe(server)
	})

	it('GIVEN a ServerAt chain WHEN queried THEN returns final Server', () => {
		const doc = new DOMParser().parseFromString(
			'<IED><AccessPoint name="AP1"><ServerAt apName="AP2" /></AccessPoint><AccessPoint name="AP2"><ServerAt apName="AP3" /></AccessPoint><AccessPoint name="AP3"><Server /></AccessPoint></IED>',
			'application/xml'
		)
		const accessPoint = doc.querySelector(
			'AccessPoint[name="AP1"]'
		) as Element
		const server = doc.querySelector('Server')

		expect(queryServer(accessPoint)).toBe(server)
	})

	it('GIVEN a missing ServerAt target WHEN queried THEN returns null', () => {
		const doc = new DOMParser().parseFromString(
			'<IED><AccessPoint name="AP1"><ServerAt apName="Missing" /></AccessPoint></IED>',
			'application/xml'
		)
		const accessPoint = doc.querySelector('AccessPoint') as Element

		expect(queryServer(accessPoint)).toBeNull()
	})

	it('GIVEN a cyclic ServerAt reference WHEN queried THEN returns null', () => {
		const doc = new DOMParser().parseFromString(
			'<IED><AccessPoint name="AP1"><ServerAt apName="AP2" /></AccessPoint><AccessPoint name="AP2"><ServerAt apName="AP1" /></AccessPoint></IED>',
			'application/xml'
		)
		const accessPoint = doc.querySelector(
			'AccessPoint[name="AP1"]'
		) as Element

		expect(queryServer(accessPoint)).toBeNull()
	})

	it('GIVEN an AccessPoint without Server or ServerAt WHEN queried THEN returns null', () => {
		const doc = new DOMParser().parseFromString(
			'<IED><AccessPoint name="AP1" /></IED>',
			'application/xml'
		)
		const accessPoint = doc.querySelector('AccessPoint') as Element

		expect(queryServer(accessPoint)).toBeNull()
	})
})

describe('queryServerAtAccessPointsFromHost', () => {
	it('GIVEN sibling AccessPoints reference the host WHEN querying dependents THEN returns only direct ServerAt references', () => {
		const doc = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="IED1">
					<AccessPoint name="AP1"><Server /></AccessPoint>
					<AccessPoint name="AP2"><ServerAt apName="AP1" /></AccessPoint>
					<AccessPoint name="AP3"><ServerAt apName="AP1" /></AccessPoint>
					<AccessPoint name="AP4"><ServerAt apName="Other" /></AccessPoint>
					<Other><ServerAt apName="AP1" /></Other>
				</IED>
			</SCL>`,
			'application/xml'
		)
		const host = doc.querySelector('AccessPoint[name="AP1"]')
		if (!host) throw new Error('Host AccessPoint fixture was not created')

		expect(queryServerAtAccessPointsFromHost(host)).toEqual([
			doc.querySelector('AccessPoint[name="AP2"]'),
			doc.querySelector('AccessPoint[name="AP3"]')
		])
	})

	it('GIVEN an unparented or unnamed AccessPoint WHEN querying dependents THEN returns no references', () => {
		const unparentedHost = document.createElement('AccessPoint')
		const unnamedHost = document.createElement('AccessPoint')
		document.createElement('IED').appendChild(unnamedHost)

		expect(queryServerAtAccessPointsFromHost(unparentedHost)).toEqual([])
		expect(queryServerAtAccessPointsFromHost(unnamedHost)).toEqual([])
	})
})
