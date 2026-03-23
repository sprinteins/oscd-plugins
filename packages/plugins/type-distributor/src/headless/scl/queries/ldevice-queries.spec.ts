import { beforeEach, describe, expect, it } from 'vitest'
import {
	queryLDeviceDisplayLabel,
	queryLDevicesFromAccessPoint
} from './ldevice-queries'

describe('queryLDevicesFromAccessPoint', () => {
	describe('basic functionality', () => {
		it('GIVEN access point with single LN WHEN queryLDevicesFromAccessPoint is called THEN should return LDevice with LNode template', () => {
			// GIVEN access point with single LN
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should return one LDevice containing the LNode
			expect(result).toHaveLength(1)
			expect(result[0].ldInst).toBe('LD0')
			expect(result[0].lNodes).toHaveLength(1)
			expect(result[0].lNodes[0]).toEqual({
				lnClass: 'XCBR',
				lnType: 'XCBR_Type1',
				lnInst: '1',
				iedName: undefined,
				ldInst: 'LD0'
			})
		})

		it('GIVEN access point with LN0 WHEN queryLDevicesFromAccessPoint is called THEN should include LN0', () => {
			// GIVEN access point with LN0
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN0 lnClass="LLN0" lnType="LLN0_Type" lnInst=""/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should include LN0 within the LDevice
			expect(result).toHaveLength(1)
			expect(result[0].lNodes[0].lnClass).toBe('LLN0')
			expect(result[0].lNodes[0].lnInst).toBe('')
		})

		it('GIVEN access point with both LN and LN0 WHEN queryLDevicesFromAccessPoint is called THEN should return both under same LDevice', () => {
			// GIVEN access point with both LN and LN0
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN0 lnClass="LLN0" lnType="LLN0_Type" lnInst=""/>
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should return one LDevice containing both nodes
			expect(result).toHaveLength(1)
			expect(result[0].lNodes).toHaveLength(2)
			expect(result[0].lNodes[0].lnClass).toBe('LLN0')
			expect(result[0].lNodes[1].lnClass).toBe('XCBR')
		})
	})

	describe('multiple elements', () => {
		it('GIVEN access point with multiple LDevice elements WHEN queryLDevicesFromAccessPoint is called THEN should return one LDeviceData per LDevice', () => {
			// GIVEN access point with multiple LDevice elements
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</LDevice>
						<LDevice inst="LD1">
							<LN lnClass="XSWI" lnType="XSWI_Type1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should return two LDevices each with their own LNode
			expect(result).toHaveLength(2)
			expect(result[0].ldInst).toBe('LD0')
			expect(result[0].lNodes[0].lnClass).toBe('XCBR')
			expect(result[1].ldInst).toBe('LD1')
			expect(result[1].lNodes[0].lnClass).toBe('XSWI')
		})

		it('GIVEN access point with multiple Server elements WHEN queryLDevicesFromAccessPoint is called THEN should aggregate from all servers', () => {
			// GIVEN access point with multiple Server elements
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</LDevice>
					</Server>
					<Server>
						<LDevice inst="LD1">
							<LN lnClass="XSWI" lnType="XSWI_Type1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should aggregate from all servers, one LDevice each
			expect(result).toHaveLength(2)
			expect(result[0].lNodes[0].lnClass).toBe('XCBR')
			expect(result[1].lNodes[0].lnClass).toBe('XSWI')
		})

		it('GIVEN LDevice with multiple LN elements WHEN queryLDevicesFromAccessPoint is called THEN should group all under same LDeviceData', () => {
			// GIVEN LDevice with multiple LN elements
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="2"/>
							<LN lnClass="XSWI" lnType="XSWI_Type1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should return one LDevice with all three LNodes
			expect(result).toHaveLength(1)
			expect(result[0].ldInst).toBe('LD0')
			expect(result[0].lNodes).toHaveLength(3)
			expect(result[0].lNodes[0].lnInst).toBe('1')
			expect(result[0].lNodes[1].lnInst).toBe('2')
			expect(result[0].lNodes[2].lnClass).toBe('XSWI')
		})
	})

	describe('attribute handling', () => {
		it('GIVEN LNode with missing attributes WHEN queryLDevicesFromAccessPoint is called THEN should use empty strings', () => {
			// GIVEN LNode with missing attributes
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should use empty strings for missing LNode attributes
			expect(result).toHaveLength(1)
			expect(result[0].lNodes[0].lnClass).toBe('')
			expect(result[0].lNodes[0].lnType).toBe('')
			expect(result[0].lNodes[0].lnInst).toBe('')
		})

		it('GIVEN LNode with iedName attribute WHEN queryLDevicesFromAccessPoint is called THEN should capture iedName', () => {
			// GIVEN LNode with iedName attribute
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1" iedName="IED1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should capture iedName on the LNode
			expect(result).toHaveLength(1)
			expect(result[0].lNodes[0].iedName).toBe('IED1')
		})

		it('GIVEN LNode without iedName attribute WHEN queryLDevicesFromAccessPoint is called THEN should have undefined iedName', () => {
			// GIVEN LNode without iedName attribute
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0">
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should have undefined iedName on the LNode
			expect(result).toHaveLength(1)
			expect(result[0].lNodes[0].iedName).toBeUndefined()
		})

		it('GIVEN LDevice without inst attribute WHEN queryLDevicesFromAccessPoint is called THEN should exclude it from results', () => {
			// GIVEN LDevice without inst attribute
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice>
							<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN LDevice without inst is excluded (ldInst would be falsy)
			expect(result).toHaveLength(0)
		})
	})

	describe('edge cases', () => {
		it('GIVEN access point with no Server elements WHEN queryLDevicesFromAccessPoint is called THEN should return empty array', () => {
			// GIVEN access point with no Server elements
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should return empty array
			expect(result).toEqual([])
		})

		it('GIVEN access point with Server but no LDevice WHEN queryLDevicesFromAccessPoint is called THEN should return empty array', () => {
			// GIVEN access point with Server but no LDevice
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server/>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should return empty array
			expect(result).toEqual([])
		})

		it('GIVEN LDevice with no LN or LN0 elements WHEN queryLDevicesFromAccessPoint is called THEN should return empty array', () => {
			// GIVEN LDevice with no LN or LN0 elements
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server>
						<LDevice inst="LD0"/>
					</Server>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLDevicesFromAccessPoint is called
			const result = queryLDevicesFromAccessPoint(accessPoint)

			// THEN should return empty array
			expect(result).toEqual([])
		})
	})
})

describe('queryLDeviceDisplayLabel', () => {
	function makeDoc(innerXml: string): XMLDocument {
		return new DOMParser().parseFromString(
			`<SCL>${innerXml}</SCL>`,
			'application/xml'
		) as XMLDocument
	}

	// UUID: 550e8400-... → 8-char prefix: 550e8400
	const UUID = '550e8400-e29b-41d4-a716-446655440000'
	const PREFIX = '550e8400'

	it('GIVEN Function element matching the UUID prefix WHEN called THEN returns the function name', () => {
		const doc = makeDoc(
			`<Bay><Function name="Protection" uuid="${UUID}"/></Bay>`
		)

		const result = queryLDeviceDisplayLabel(doc, `Protection_${PREFIX}`)

		expect(result).toBe('Protection')
	})

	it('GIVEN Function element with illegal chars in name WHEN called THEN returns the name unchanged', () => {
		const doc = makeDoc(
			`<Bay><Function name="Bay-Protection" uuid="${UUID}"/></Bay>`
		)

		const result = queryLDeviceDisplayLabel(doc, `BayProtection_${PREFIX}`)

		expect(result).toBe('Bay-Protection')
	})

	describe('GIVEN EqFunction matching the UUID prefix inside a ConductingEquipment', () => {
		let doc: XMLDocument

		beforeEach(() => {
			doc = makeDoc(
				`<Bay>
					<ConductingEquipment name="CB-1">
						<EqFunction name="Bay-Protection" uuid="${UUID}"/>
					</ConductingEquipment>
				</Bay>`
			)
		})

		it('WHEN called THEN returns conductingEquipment_functionName', () => {
			const result = queryLDeviceDisplayLabel(
				doc,
				`CB1_BayProtection_${PREFIX}`
			)

			expect(result).toBe('CB-1_Bay-Protection')
		})

		it('WHEN ConductingEquipment has no name attribute THEN returns function name only', () => {
			const docNoName = makeDoc(
				`<Bay>
					<ConductingEquipment>
						<EqFunction name="Bay-Protection" uuid="${UUID}"/>
					</ConductingEquipment>
				</Bay>`
			)

			const result = queryLDeviceDisplayLabel(
				docNoName,
				`BayProtection_${PREFIX}`
			)

			expect(result).toBe('Bay-Protection')
		})
	})

	it('GIVEN LD0 ldInst WHEN called THEN returns undefined', () => {
		const doc = makeDoc('')

		expect(queryLDeviceDisplayLabel(doc, 'LD0')).toBeUndefined()
	})

	it('GIVEN LD0_APname ldInst WHEN called THEN returns undefined', () => {
		const doc = makeDoc('')

		expect(queryLDeviceDisplayLabel(doc, 'LD0_S1-AP')).toBeUndefined()
	})

	it('GIVEN ldInst whose prefix matches nothing in the doc WHEN called THEN returns undefined', () => {
		const doc = makeDoc(
			`<Bay><Function name="Other" uuid="aaaabbbb-0000-0000-0000-000000000000"/></Bay>`
		)

		const result = queryLDeviceDisplayLabel(doc, `Protection_${PREFIX}`)

		expect(result).toBeUndefined()
	})

	it('GIVEN invalid ldInst format (no underscore, no UUID suffix) WHEN called THEN returns undefined without throwing', () => {
		const doc = makeDoc('')

		expect(() => queryLDeviceDisplayLabel(doc, 'BadFormat')).not.toThrow()
		expect(queryLDeviceDisplayLabel(doc, 'BadFormat')).toBeUndefined()
	})
})

describe('queryLDevicesFromAccessPoint with doc', () => {
	const UUID = '550e8400-e29b-41d4-a716-446655440000'
	const PREFIX = '550e8400'

	it('GIVEN doc with matching Function WHEN queryLDevicesFromAccessPoint is called THEN LDeviceData includes displayLabel', () => {
		// GIVEN
		const parser = new DOMParser()
		const apDoc = parser.parseFromString(
			`<AccessPoint name="AP1">
				<Server>
					<LDevice inst="Bay-Protection_${PREFIX}">
						<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
					</LDevice>
				</Server>
			</AccessPoint>`,
			'application/xml'
		)
		const scdDoc = parser.parseFromString(
			`<SCL><Bay><Function name="Bay-Protection" uuid="${UUID}"/></Bay></SCL>`,
			'application/xml'
		) as XMLDocument

		// WHEN
		const result = queryLDevicesFromAccessPoint(
			apDoc.documentElement,
			scdDoc
		)

		// THEN
		expect(result[0].displayLabel).toBe('Bay-Protection')
	})

	it('GIVEN doc with no matching Function WHEN queryLDevicesFromAccessPoint is called THEN displayLabel is undefined', () => {
		// GIVEN
		const parser = new DOMParser()
		const apDoc = parser.parseFromString(
			`<AccessPoint name="AP1">
				<Server>
					<LDevice inst="Protection_${PREFIX}">
						<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
					</LDevice>
				</Server>
			</AccessPoint>`,
			'application/xml'
		)
		const scdDoc = parser.parseFromString(
			'<SCL/>',
			'application/xml'
		) as XMLDocument

		// WHEN
		const result = queryLDevicesFromAccessPoint(
			apDoc.documentElement,
			scdDoc
		)

		// THEN
		expect(result[0].displayLabel).toBeUndefined()
	})

	it('GIVEN no doc argument WHEN queryLDevicesFromAccessPoint is called THEN displayLabel is undefined', () => {
		// GIVEN
		const parser = new DOMParser()
		const apDoc = parser.parseFromString(
			`<AccessPoint name="AP1">
				<Server>
					<LDevice inst="Protection_${PREFIX}">
						<LN lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
					</LDevice>
				</Server>
			</AccessPoint>`,
			'application/xml'
		)

		// WHEN
		const result = queryLDevicesFromAccessPoint(apDoc.documentElement)

		// THEN
		expect(result[0].displayLabel).toBeUndefined()
	})
})
