import { describe, expect, it } from 'vitest'
import { queryLNInLDevice } from './ied-ln-element'

describe('queryLNInLDevice', () => {
	it('GIVEN LNs with identical attributes except prefix WHEN queried THEN returns the matching LN', () => {
		const doc = new DOMParser().parseFromString(
			`<LDevice>
				<LN lnClass="XCBR" lnType="XCBR_Type1" inst="1"/>
				<LN lnClass="XCBR" lnType="XCBR_Type1" inst="1" prefix="remote"/>
			</LDevice>`,
			'application/xml'
		)
		const lDevice = doc.documentElement
		const prefixedLN = lDevice.children[1]

		expect(
			queryLNInLDevice(lDevice, {
				lnClass: 'XCBR',
				lnType: 'XCBR_Type1',
				inst: '1',
				prefix: 'remote',
				ldInst: 'LD0'
			})
		).toBe(prefixedLN)
	})

	it('GIVEN an LN without a prefix WHEN queried without a prefix THEN returns the LN', () => {
		const doc = new DOMParser().parseFromString(
			'<LDevice><LN lnClass="XCBR" lnType="XCBR_Type1" inst="1"/></LDevice>',
			'application/xml'
		)
		const lDevice = doc.documentElement
		const ln = lDevice.firstElementChild

		expect(
			queryLNInLDevice(lDevice, {
				lnClass: 'XCBR',
				lnType: 'XCBR_Type1',
				inst: '1',
				ldInst: 'LD0'
			})
		).toBe(ln)
	})
})
