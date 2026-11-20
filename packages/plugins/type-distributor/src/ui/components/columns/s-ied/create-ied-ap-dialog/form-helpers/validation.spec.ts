import { describe, expect, it, vi } from 'vitest'
import { validateSubmission } from './validation'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		host: null
	}
}))

describe('validateSubmission', () => {
	it('GIVEN ServerAt points to an unavailable server AP WHEN validating THEN returns a visible error', () => {
		const xmlDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="IED1">
					<AccessPoint name="AP1"><Server /></AccessPoint>
				</IED>
			</SCL>`,
			'application/xml'
		)

		const result = validateSubmission({
			ied: { name: 'IED1', description: '', isNew: false },
			accessPoints: [
				{
					name: 'AP2',
					description: '',
					serverAtApName: 'MissingAP'
				}
			],
			xmlDocument,
			ssdDocument: null
		})

		expect(result?.errors).toContain(
			'ServerAt target "MissingAP" for Access Point "AP2" is not a server-hosting Access Point in IED "IED1".'
		)
	})

	it('GIVEN invalid ServerAt and duplicate AP names WHEN validating THEN returns both errors', () => {
		const xmlDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="IED1">
					<AccessPoint name="AP1"><Server /></AccessPoint>
				</IED>
			</SCL>`,
			'application/xml'
		)

		const result = validateSubmission({
			ied: { name: 'IED1', description: '', isNew: false },
			accessPoints: [
				{
					name: 'AP1',
					description: '',
					serverAtApName: 'MissingAP'
				}
			],
			xmlDocument,
			ssdDocument: null
		})

		expect(result?.errors).toContain(
			'ServerAt target "MissingAP" for Access Point "AP1" is not a server-hosting Access Point in IED "IED1".'
		)
		expect(
			result?.properties?.ap?.items?.[0]?.properties?.name?.errors
		).toContain('Access Point "AP1" already exists in IED "IED1"')
	})
})
