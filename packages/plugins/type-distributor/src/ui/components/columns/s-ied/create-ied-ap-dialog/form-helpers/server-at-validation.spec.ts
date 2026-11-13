import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	collectServerAtTargets,
	validateServerAtTargets
} from './server-at-validation'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		host: null
	}
}))

describe('GIVEN an IED with existing Server hosts', () => {
	let xmlDocument: XMLDocument

	beforeEach(() => {
		xmlDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="IED1">
					<AccessPoint name="AP1"><Server /></AccessPoint>
					<AccessPoint name="Alias"><ServerAt apName="AP1" /></AccessPoint>
				</IED>
			</SCL>`,
			'application/xml'
		)
	})

	it('WHEN collecting targets with pending hosts THEN returns only existing and pending Server hosts', () => {
		expect(
			collectServerAtTargets(
				{ name: 'IED1', description: '', isNew: false },
				[
					{ name: 'PendingHost', description: '' },
					{
						name: 'PendingAlias',
						description: '',
						serverAtApName: 'AP1'
					},
					{ name: 'AP1', description: '' }
				],
				xmlDocument
			)
		).toEqual(['AP1', 'PendingHost'])
	})

	it('WHEN validating an alias before its pending host THEN returns an unavailable-target error', () => {
		expect(
			validateServerAtTargets(
				{ name: ' IED1 ', description: '', isNew: false },
				[
					{
						name: 'Alias',
						description: '',
						serverAtApName: 'PendingHost'
					},
					{ name: 'PendingHost', description: '' }
				],
				xmlDocument
			)
		).toEqual([
			'ServerAt target "PendingHost" for Access Point "Alias" is not a server-hosting Access Point in IED "IED1".'
		])
	})

	it('WHEN validating a new IED with a host before its alias THEN accepts the target', () => {
		expect(
			validateServerAtTargets(
				{ name: 'NewIED', description: '', isNew: true },
				[
					{ name: 'Host', description: '' },
					{ name: 'Alias', description: '', serverAtApName: 'Host' }
				],
				xmlDocument
			)
		).toEqual([])
	})
})
