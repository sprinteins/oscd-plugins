import { describe, it, expect } from 'vitest'
import { filterByLNode } from './lnode-filters'
import type { IEDData } from './types'

describe('filterByLNode', () => {
	const mockIEDs: IEDData[] = [
		{
			name: 'IED_Protection',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP1',
					lNodes: [
						{ lnClass: 'XCBR', lnType: 'XCBR_Type1', lnInst: '1', ldInst: 'LD0' },
						{ lnClass: 'XSWI', lnType: 'XSWI_Type1', lnInst: '2', ldInst: 'LD0' },
						{ lnClass: 'CSWI', lnType: 'CSWI_Type1', lnInst: '1', ldInst: 'LD1' }
					]
				},
				{
					element: document.createElement('AccessPoint'),
					name: 'AP2',
					lNodes: [
						{ lnClass: 'MMXU', lnType: 'MMXU_Measurement', lnInst: '1', ldInst: 'LD_Meas' }
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
					lNodes: [
						{ lnClass: 'CSWI', lnType: 'ControlSwitch_Type', lnInst: '10', ldInst: 'LD_Control' },
						{ lnClass: 'CILO', lnType: 'CILO_Type1', lnInst: '1', ldInst: 'LD_Interlock' }
					]
				}
			]
		}
	]

	describe('filtering by lnClass', () => {
		it('GIVEN IEDs with matching lnClass WHEN filtering by lnClass THEN should return matching LNodes only', () => {
			// WHEN filtering by "XCBR"
			const result = filterByLNode(mockIEDs, 'XCBR')

			// THEN should return IED with only matching LNode
			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('IED_Protection')
			expect(result[0].accessPoints).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('XCBR')
		})

		it('GIVEN IEDs with multiple matching lnClass WHEN filtering THEN should return all matching LNodes', () => {
			// WHEN filtering by "CSWI" (exists in both IEDs)
			const result = filterByLNode(mockIEDs, 'CSWI')

			// THEN should return both IEDs with matching LNodes
			expect(result).toHaveLength(2)
			expect(result[0].name).toBe('IED_Protection')
			expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('CSWI')
			expect(result[1].name).toBe('IED_Control')
			expect(result[1].accessPoints[0].lNodes).toHaveLength(1)
			expect(result[1].accessPoints[0].lNodes[0].lnClass).toBe('CSWI')
		})

		it('GIVEN IEDs WHEN filtering with partial lnClass match THEN should return matching LNodes', () => {
			// WHEN filtering by "XS" (matches XSWI)
			const result = filterByLNode(mockIEDs, 'XS')

			// THEN should match XSWI
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('XSWI')
		})
	})

	describe('filtering by lnType', () => {
		it('GIVEN IEDs with matching lnType WHEN filtering by lnType THEN should return matching LNodes', () => {
			// WHEN filtering by "XCBR_Type1"
			const result = filterByLNode(mockIEDs, 'XCBR_Type1')

			// THEN should return matching LNode
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnType).toBe('XCBR_Type1')
		})

		it('GIVEN IEDs WHEN filtering with partial lnType match THEN should return matching LNodes', () => {
			// WHEN filtering by "Measurement"
			const result = filterByLNode(mockIEDs, 'Measurement')

			// THEN should match MMXU_Measurement
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints).toHaveLength(1)
			expect(result[0].accessPoints[0].name).toBe('AP2')
			expect(result[0].accessPoints[0].lNodes[0].lnType).toBe('MMXU_Measurement')
		})

		it('GIVEN IEDs WHEN filtering by "Type1" THEN should match multiple LNodes with Type1', () => {
			// WHEN filtering by "Type1"
			const result = filterByLNode(mockIEDs, 'Type1')

			// THEN should match multiple LNodes
			expect(result).toHaveLength(2)
			expect(result[0].name).toBe('IED_Protection')
			// Should have AP1 with XCBR, XSWI, CSWI
			expect(result[0].accessPoints[0].lNodes.length).toBeGreaterThanOrEqual(2)
		})
	})

	describe('filtering by lnInst', () => {
		it('GIVEN IEDs with matching lnInst WHEN filtering by lnInst THEN should return matching LNodes', () => {
			// WHEN filtering by "10"
			const result = filterByLNode(mockIEDs, '10')

			// THEN should return LNode with inst "10"
			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('IED_Control')
			expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnInst).toBe('10')
		})

		it('GIVEN IEDs with multiple LNodes having matching inst WHEN filtering THEN should return all matches', () => {
			// WHEN filtering by "1"
			const result = filterByLNode(mockIEDs, '1')

			// THEN should return multiple LNodes with inst containing "1"
			expect(result).toHaveLength(2)
			// IED_Protection should have multiple matches
			const protectionLNodes = result[0].accessPoints[0].lNodes.length + result[0].accessPoints[1].lNodes.length
			expect(protectionLNodes).toBeGreaterThanOrEqual(3)
		})
	})

	describe('case-insensitive matching', () => {
		it('GIVEN IEDs WHEN filtering with lowercase term THEN should match case-insensitively', () => {
			// WHEN filtering by "xcbr" (lowercase)
			const result = filterByLNode(mockIEDs, 'xcbr')

			// THEN should match XCBR
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('XCBR')
		})

		it('GIVEN IEDs WHEN filtering with mixed case term THEN should match case-insensitively', () => {
			// WHEN filtering by "CoNtRoL" (mixed case)
			const result = filterByLNode(mockIEDs, 'CoNtRoL')

			// THEN should match ControlSwitch_Type
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnType).toContain('Control')
		})
	})

	describe('edge cases', () => {
		it('GIVEN IEDs WHEN filtering with non-matching term THEN should return empty array', () => {
			// WHEN filtering by "NonExistent"
			const result = filterByLNode(mockIEDs, 'NonExistent')

			// THEN should return empty array
			expect(result).toHaveLength(0)
		})

		it('GIVEN IEDs WHEN filtering with empty term THEN should return empty array', () => {
			// WHEN filtering by empty string
			const result = filterByLNode(mockIEDs, '')

			// THEN should return empty array
			expect(result).toHaveLength(0)
		})

		it('GIVEN IEDs WHEN filtering with whitespace term THEN should trim and return empty', () => {
			// WHEN filtering by whitespace
			const result = filterByLNode(mockIEDs, '   ')

			// THEN should return empty array
			expect(result).toHaveLength(0)
		})

		it('GIVEN IEDs WHEN filtering with term containing whitespace THEN should trim and match', () => {
			// WHEN filtering by " XCBR " (with spaces)
			const result = filterByLNode(mockIEDs, '  XCBR  ')

			// THEN should trim and match
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('XCBR')
		})
	})

	describe('hierarchy preservation', () => {
		it('GIVEN IEDs WHEN filtering THEN should preserve parent IED hierarchy', () => {
			// GIVEN original element
			const originalElement = mockIEDs[0].element

			// WHEN filtering
			const result = filterByLNode(mockIEDs, 'XCBR')

			// THEN should preserve parent IED
			expect(result[0].name).toBe('IED_Protection')
			expect(result[0].element).toBe(originalElement)
		})

		it('GIVEN IED with multiple AccessPoints WHEN filtering matches only one THEN should include only matching AccessPoint', () => {
			// WHEN filtering by "MMXU" (only in AP2)
			const result = filterByLNode(mockIEDs, 'MMXU')

			// THEN should only include AP2
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints).toHaveLength(1)
			expect(result[0].accessPoints[0].name).toBe('AP2')
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('MMXU')
		})

		it('GIVEN AccessPoint with mixed LNodes WHEN filtering THEN should only include matching LNodes', () => {
			// WHEN filtering by "2" (only XSWI has inst "2")
			const result = filterByLNode(mockIEDs, '2')

			// THEN should only include matching LNode from AP1
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].name).toBe('AP1')
			expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('XSWI')
			expect(result[0].accessPoints[0].lNodes[0].lnInst).toBe('2')
		})
	})

	describe('multiple field matching', () => {
		it('GIVEN IEDs WHEN term matches multiple fields THEN should return LNode', () => {
			// WHEN filtering by "1" (matches both lnType and lnInst)
			const result = filterByLNode(mockIEDs, '1')

			// THEN should match LNodes where either field contains "1"
			expect(result.length).toBeGreaterThanOrEqual(1)
		})

		it('GIVEN IEDs WHEN term matches lnClass but not lnType or lnInst THEN should return LNode', () => {
			// WHEN filtering by "CILO"
			const result = filterByLNode(mockIEDs, 'CILO')

			// THEN should match CILO lnClass
			expect(result).toHaveLength(1)
			expect(result[0].accessPoints[0].lNodes[0].lnClass).toBe('CILO')
		})
	})
})
