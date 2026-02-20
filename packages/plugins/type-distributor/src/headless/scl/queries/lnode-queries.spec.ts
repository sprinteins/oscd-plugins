import { describe, it, expect } from 'vitest'
import { queryLNodesFromAccessPoint } from './lnode-queries'

describe('queryLNodesFromAccessPoint', () => {
	describe('basic functionality', () => {
		it('GIVEN access point with single LN WHEN queryLNodesFromAccessPoint is called THEN should return LNode template', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should return LNode template
			expect(result).toHaveLength(1)
			expect(result[0]).toEqual({
				lnClass: 'XCBR',
				lnType: 'XCBR_Type1',
				lnInst: '1',
				iedName: undefined,
				lDeviceName: 'LD0'
			})
		})

		it('GIVEN access point with LN0 WHEN queryLNodesFromAccessPoint is called THEN should include LN0', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should include LN0
			expect(result).toHaveLength(1)
			expect(result[0].lnClass).toBe('LLN0')
			expect(result[0].lnInst).toBe('')
		})

		it('GIVEN access point with both LN and LN0 WHEN queryLNodesFromAccessPoint is called THEN should return both', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should return both
			expect(result).toHaveLength(2)
			expect(result[0].lnClass).toBe('LLN0')
			expect(result[1].lnClass).toBe('XCBR')
		})
	})

	describe('multiple elements', () => {
		it('GIVEN access point with multiple LDevice elements WHEN queryLNodesFromAccessPoint is called THEN should aggregate all LNodes', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should aggregate all LNodes
			expect(result).toHaveLength(2)
			expect(result[0].lDeviceName).toBe('LD0')
			expect(result[0].lnClass).toBe('XCBR')
			expect(result[1].lDeviceName).toBe('LD1')
			expect(result[1].lnClass).toBe('XSWI')
		})

		it('GIVEN access point with multiple Server elements WHEN queryLNodesFromAccessPoint is called THEN should aggregate from all servers', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should aggregate from all servers
			expect(result).toHaveLength(2)
			expect(result[0].lnClass).toBe('XCBR')
			expect(result[1].lnClass).toBe('XSWI')
		})

		it('GIVEN LDevice with multiple LN elements WHEN queryLNodesFromAccessPoint is called THEN should return all with same lDeviceName', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should return all with same lDeviceName
			expect(result).toHaveLength(3)
			expect(result.every((ln) => ln.lDeviceName === 'LD0')).toBe(true)
			expect(result[0].lnInst).toBe('1')
			expect(result[1].lnInst).toBe('2')
			expect(result[2].lnClass).toBe('XSWI')
		})
	})

	describe('attribute handling', () => {
		it('GIVEN LNode with missing attributes WHEN queryLNodesFromAccessPoint is called THEN should use empty strings', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should use empty strings
			expect(result).toHaveLength(1)
			expect(result[0].lnClass).toBe('')
			expect(result[0].lnType).toBe('')
			expect(result[0].lnInst).toBe('')
		})

		it('GIVEN LNode with iedName attribute WHEN queryLNodesFromAccessPoint is called THEN should capture iedName', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should capture iedName
			expect(result).toHaveLength(1)
			expect(result[0].iedName).toBe('IED1')
		})

		it('GIVEN LNode without iedName attribute WHEN queryLNodesFromAccessPoint is called THEN should have undefined iedName', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should have undefined iedName
			expect(result).toHaveLength(1)
			expect(result[0].iedName).toBeUndefined()
		})

		it('GIVEN LDevice without inst attribute WHEN queryLNodesFromAccessPoint is called THEN should have undefined lDeviceName', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should have undefined lDeviceName
			expect(result).toHaveLength(1)
			expect(result[0].lDeviceName).toBeUndefined()
		})
	})

	describe('edge cases', () => {
		it('GIVEN access point with no Server elements WHEN queryLNodesFromAccessPoint is called THEN should return empty array', () => {
			// GIVEN access point with no Server elements
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should return empty array
			expect(result).toEqual([])
		})

		it('GIVEN access point with Server but no LDevice WHEN queryLNodesFromAccessPoint is called THEN should return empty array', () => {
			// GIVEN access point with Server but no LDevice
			const parser = new DOMParser()
			const doc = parser.parseFromString(
				`<AccessPoint name="AP1">
					<Server/>
				</AccessPoint>`,
				'application/xml'
			)
			const accessPoint = doc.documentElement

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should return empty array
			expect(result).toEqual([])
		})

		it('GIVEN LDevice with no LN or LN0 elements WHEN queryLNodesFromAccessPoint is called THEN should return empty array', () => {
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

			// WHEN queryLNodesFromAccessPoint is called
			const result = queryLNodesFromAccessPoint(accessPoint)

			// THEN should return empty array
			expect(result).toEqual([])
		})
	})
})
