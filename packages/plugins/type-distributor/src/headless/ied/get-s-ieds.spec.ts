import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getSIEDs } from './get-s-ieds'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		host: null
	}
}))
const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')

describe('getSIEDs', () => {
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
		const result = getSIEDs('Bay1')

		const iedNames = result.map((ied) => ied.getAttribute('name'))
		expect(iedNames).toContain('IED1')
		expect(iedNames).toContain('IED4')
	})

	it('should return ieds assigned to a selected Bay', () => {
		const result = getSIEDs('Bay1')

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

		const result = getSIEDs('Bay1')

		expect(result).toEqual([])
	})

	it('should not return ieds assigned to a not selected Bay', () => {
		const result = getSIEDs('Bay1')

		const iedNames = result.map((ied) => ied.getAttribute('name'))
		expect(iedNames).not.toContain('IED3')
	})

	it('should return empty array when xmlDocument is undefined', () => {
		pluginGlobalStore.xmlDocument = undefined

		const result = getSIEDs('Bay1')

		expect(result).toEqual([])
	})

	it('should return all unassigned IEDs and selected bay IEDs together', () => {
		const result = getSIEDs('Bay2')

		const iedNames = result.map((ied) => ied.getAttribute('name'))
		expect(iedNames).toContain('IED1')
		expect(iedNames).toContain('IED3')
		expect(iedNames).toContain('IED4')
		expect(iedNames).not.toContain('IED2')
		expect(result.length).toBe(3)
	})
})
