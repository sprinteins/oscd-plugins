import { describe, expect, it } from 'vitest'
import { filterByLN } from './ln-filters'
import type { IEDData } from './types'

describe('filterByLN', () => {
	const mockIEDs: IEDData[] = [
		{
			name: 'IED_Protection',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP1',
					lDevices: [
						{
							ldInst: 'LD0',
							lns: [
								{
									lnClass: 'XCBR',
									lnType: 'XCBR_Type1',
									inst: '1',
									ldInst: 'LD0'
								},
								{
									lnClass: 'XSWI',
									lnType: 'XSWI_Type1',
									inst: '2',
									ldInst: 'LD0'
								}
							]
						},
						{
							ldInst: 'LD1',
							lns: [
								{
									lnClass: 'CSWI',
									lnType: 'CSWI_Type1',
									inst: '1',
									ldInst: 'LD1'
								}
							]
						}
					]
				},
				{
					element: document.createElement('AccessPoint'),
					name: 'AP2',
					lDevices: [
						{
							ldInst: 'LD_Meas',
							lns: [
								{
									lnClass: 'MMXU',
									lnType: 'MMXU_Measurement',
									inst: '1',
									ldInst: 'LD_Meas'
								}
							]
						}
					]
				}
			]
		},
		{
			name: 'IED_Control',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP_Main',
					lDevices: [
						{
							ldInst: 'LD_Control',
							lns: [
								{
									lnClass: 'CSWI',
									lnType: 'ControlSwitch_Type',
									inst: '10',
									ldInst: 'LD_Control'
								}
							]
						},
						{
							ldInst: 'LD_Interlock',
							lns: [
								{
									lnClass: 'CILO',
									lnType: 'CILO_Type1',
									inst: '1',
									ldInst: 'LD_Interlock'
								}
							]
						}
					]
				}
			]
		}
	]

	describe('filtering by lnClass', () => {
		it('GIVEN IEDs with matching lnClass WHEN filtering by lnClass THEN should return matching LNs only', () => {
			// WHEN filtering by "XCBR"
			const result = filterByLN(mockIEDs, 'XCBR')

			// THEN should return IED with only matching LN
			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('IED_Protection')
			expect(result[0].accessPoints).toHaveLength(1)
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs).toHaveLength(1)
			expect(allLNs[0].lnClass).toBe('XCBR')
		})

		it('GIVEN IEDs with multiple matching lnClass WHEN filtering THEN should return all matching LNs', () => {
			// WHEN filtering by "CSWI" (exists in both IEDs)
			const result = filterByLN(mockIEDs, 'CSWI')

			// THEN should return both IEDs with matching LNs
			expect(result).toHaveLength(2)
			expect(result[0].name).toBe('IED_Protection')
			const protection = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(protection).toHaveLength(1)
			expect(protection[0].lnClass).toBe('CSWI')
			expect(result[1].name).toBe('IED_Control')
			const control = result[1].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(control).toHaveLength(1)
			expect(control[0].lnClass).toBe('CSWI')
		})

		it('GIVEN IEDs WHEN filtering with partial lnClass match THEN should return matching LNs', () => {
			// WHEN filtering by "XS" (matches XSWI)
			const result = filterByLN(mockIEDs, 'XS')

			// THEN should match XSWI
			expect(result).toHaveLength(1)
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs).toHaveLength(1)
			expect(allLNs[0].lnClass).toBe('XSWI')
		})
	})

	describe('filtering by lnType', () => {
		it('GIVEN IEDs with matching lnType WHEN filtering by lnType THEN should return matching LNs', () => {
			// WHEN filtering by "XCBR_Type1"
			const result = filterByLN(mockIEDs, 'XCBR_Type1')

			// THEN should return matching LN
			expect(result).toHaveLength(1)
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs).toHaveLength(1)
			expect(allLNs[0].lnType).toBe('XCBR_Type1')
		})

		it('GIVEN IEDs WHEN filtering with partial lnType match THEN should return matching LNs', () => {
			// WHEN filtering by "Measurement"
			const result = filterByLN(mockIEDs, 'Measurement')

			// THEN should match MMXU_Measurement
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints).toHaveLength(1)
			expect(result[0].accessPoints[0].name).toBe('AP2')
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs[0].lnType).toBe('MMXU_Measurement')
		})

		it('GIVEN IEDs WHEN filtering by "Type1" THEN should match multiple LNs with Type1', () => {
			// WHEN filtering by "Type1"
			const result = filterByLN(mockIEDs, 'Type1')

			// THEN should match multiple LNs
			expect(result).toHaveLength(2)
			expect(result[0].name).toBe('IED_Protection')
			// Should have AP1 with XCBR, XSWI, CSWI
			const ap1LNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(ap1LNs.length).toBeGreaterThanOrEqual(2)
		})
	})

	describe('filtering by inst', () => {
		it('GIVEN IEDs with matching inst WHEN filtering by inst THEN should return matching LNs', () => {
			// WHEN filtering by "10"
			const result = filterByLN(mockIEDs, '10')

			// THEN should return LN with inst "10"
			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('IED_Control')
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs).toHaveLength(1)
			expect(allLNs[0].inst).toBe('10')
		})

		it('GIVEN IEDs with multiple LNs having matching inst WHEN filtering THEN should return all matches', () => {
			// WHEN filtering by "1"
			const result = filterByLN(mockIEDs, '1')

			// THEN should return multiple LNs with inst containing "1"
			expect(result).toHaveLength(2)
			// IED_Protection should have multiple matches across its access points
			const protectionLNs = result[0].accessPoints.flatMap((ap) =>
				ap.lDevices.flatMap((ld) => ld.lns)
			)
			expect(protectionLNs.length).toBeGreaterThanOrEqual(3)
		})
	})

	describe('case-insensitive matching', () => {
		it('GIVEN IEDs WHEN filtering with lowercase term THEN should match case-insensitively', () => {
			// WHEN filtering by "xcbr" (lowercase)
			const result = filterByLN(mockIEDs, 'xcbr')

			// THEN should match XCBR
			expect(result).toHaveLength(1)
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs[0].lnClass).toBe('XCBR')
		})

		it('GIVEN IEDs WHEN filtering with mixed case term THEN should match case-insensitively', () => {
			// WHEN filtering by "CoNtRoL" (mixed case)
			const result = filterByLN(mockIEDs, 'CoNtRoL')

			// THEN should match ControlSwitch_Type
			expect(result).toHaveLength(1)
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs[0].lnType).toContain('Control')
		})
	})

	describe('edge cases', () => {
		it('GIVEN IEDs WHEN filtering with non-matching term THEN should return empty array', () => {
			// WHEN filtering by "NonExistent"
			const result = filterByLN(mockIEDs, 'NonExistent')

			// THEN should return empty array
			expect(result).toHaveLength(0)
		})

		it('GIVEN IEDs WHEN filtering with empty term THEN should return empty array', () => {
			// WHEN filtering by empty string
			const result = filterByLN(mockIEDs, '')

			// THEN should return empty array
			expect(result).toHaveLength(0)
		})

		it('GIVEN IEDs WHEN filtering with whitespace term THEN should trim and return empty', () => {
			// WHEN filtering by whitespace
			const result = filterByLN(mockIEDs, '   ')

			// THEN should return empty array
			expect(result).toHaveLength(0)
		})

		it('GIVEN IEDs WHEN filtering with term containing whitespace THEN should trim and match', () => {
			// WHEN filtering by " XCBR " (with spaces)
			const result = filterByLN(mockIEDs, '  XCBR  ')

			// THEN should trim and match
			expect(result).toHaveLength(1)
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs[0].lnClass).toBe('XCBR')
		})
	})

	describe('hierarchy preservation', () => {
		it('GIVEN IEDs WHEN filtering THEN should preserve parent IED hierarchy', () => {
			// GIVEN original element
			const originalElement = mockIEDs[0].element

			// WHEN filtering
			const result = filterByLN(mockIEDs, 'XCBR')

			// THEN should preserve parent IED
			expect(result[0].name).toBe('IED_Protection')
			expect(result[0].element).toBe(originalElement)
		})

		it('GIVEN IED with multiple AccessPoints WHEN filtering matches only one THEN should include only matching AccessPoint', () => {
			// WHEN filtering by "MMXU" (only in AP2)
			const result = filterByLN(mockIEDs, 'MMXU')

			// THEN should only include AP2
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints).toHaveLength(1)
			expect(result[0].accessPoints[0].name).toBe('AP2')
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs[0].lnClass).toBe('MMXU')
		})

		it('GIVEN AccessPoint with mixed LNs WHEN filtering THEN should only include matching LNs', () => {
			// WHEN filtering by "2" (only XSWI has inst "2")
			const result = filterByLN(mockIEDs, '2')

			// THEN should only include matching LN from AP1
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].name).toBe('AP1')
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs).toHaveLength(1)
			expect(allLNs[0].lnClass).toBe('XSWI')
			expect(allLNs[0].inst).toBe('2')
		})
	})

	describe('multiple field matching', () => {
		it('GIVEN IEDs WHEN term matches multiple fields THEN should return LN', () => {
			// WHEN filtering by "1" (matches both lnType and inst)
			const result = filterByLN(mockIEDs, '1')

			// THEN should match LNs where either field contains "1"
			expect(result.length).toBeGreaterThanOrEqual(1)
		})

		it('GIVEN IEDs WHEN term matches lnClass but not lnType or inst THEN should return LN', () => {
			// WHEN filtering by "CILO"
			const result = filterByLN(mockIEDs, 'CILO')

			// THEN should match CILO lnClass
			expect(result).toHaveLength(1)
			const allLNs = result[0].accessPoints[0].lDevices.flatMap(
				(ld) => ld.lns
			)
			expect(allLNs[0].lnClass).toBe('CILO')
		})
	})
})
