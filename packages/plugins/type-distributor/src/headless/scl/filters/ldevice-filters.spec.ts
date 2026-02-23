import { describe, it, expect } from 'vitest'
import { filterByLDevice } from './ldevice-filters'
import type { IEDData } from './types'

describe('filterByLDevice', () => {
	const mockIEDs: IEDData[] = [
		{
			name: 'IED_Protection',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP1',
					lNodes: [
						{ lnClass: 'XCBR', lnType: 'XCBR_Type1', lnInst: '1', ldInst: 'LD_Circuit_Breaker' },
						{ lnClass: 'XSWI', lnType: 'XSWI_Type1', lnInst: '1', ldInst: 'LD_Disconnector' }
					]
				},
				{
					element: document.createElement('AccessPoint'),
					name: 'AP2',
					lNodes: [
						{ lnClass: 'MMXU', lnType: 'MMXU_Type1', lnInst: '1', ldInst: 'LD_Measurement' }
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
						{ lnClass: 'CSWI', lnType: 'CSWI_Type1', lnInst: '1', ldInst: 'LD_Control_Unit' },
						{ lnClass: 'CILO', lnType: 'CILO_Type1', lnInst: '1', ldInst: 'LD_Interlock' }
					]
				}
			]
		},
		{
			name: 'IED_NoLDevice',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP_Test',
					lNodes: [
						{ lnClass: 'LLN0', lnType: 'LLN0_Type', lnInst: '', ldInst: undefined }
					]
				}
			]
		}
	]

	it('GIVEN IEDs with matching LDevice names WHEN filtering by LDevice THEN should return IED with matching LNodes only', () => {
		// WHEN filtering by "Breaker"
		const result = filterByLDevice(mockIEDs, 'Breaker')

		// THEN should return IED with only matching LNode
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Protection')
		expect(result[0].accessPoints).toHaveLength(1)
		expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
		expect(result[0].accessPoints[0].lNodes[0].ldInst).toBe('LD_Circuit_Breaker')
	})

	it('GIVEN IED with multiple LNodes in same AccessPoint WHEN filtering matches multiple THEN should return all matching LNodes', () => {
		// WHEN filtering by "LD_" (matches multiple)
		const result = filterByLDevice(mockIEDs, 'LD_')

		// THEN should return IEDs with all matching LNodes
		expect(result).toHaveLength(2)
		expect(result[0].name).toBe('IED_Protection')
		expect(result[0].accessPoints[0].lNodes).toHaveLength(2) // AP1 has 2 matching
		expect(result[0].accessPoints[1].lNodes).toHaveLength(1) // AP2 has 1 matching
	})

	it('GIVEN IED with LNodes in multiple AccessPoints WHEN filtering THEN should preserve parent AccessPoint hierarchy', () => {
		// WHEN filtering by "Measurement"
		const result = filterByLDevice(mockIEDs, 'Measurement')

		// THEN should return IED with matching AccessPoint
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Protection')
		expect(result[0].accessPoints).toHaveLength(1)
		expect(result[0].accessPoints[0].name).toBe('AP2')
		expect(result[0].accessPoints[0].lNodes[0].ldInst).toBe('LD_Measurement')
	})

	it('GIVEN multiple IEDs with matching LDevice names WHEN filtering THEN should return all matching IEDs', () => {
		// WHEN filtering by "Control"
		const result = filterByLDevice(mockIEDs, 'Control')

		// THEN should return IED_Control
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Control')
		expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
		expect(result[0].accessPoints[0].lNodes[0].ldInst).toBe('LD_Control_Unit')
	})

	it('GIVEN IEDs WHEN filtering with case-insensitive term THEN should match correctly', () => {
		// WHEN filtering by "disconnector" (lowercase)
		const result = filterByLDevice(mockIEDs, 'disconnector')

		// THEN should match case-insensitively
		expect(result).toHaveLength(1)
		expect(result[0].accessPoints[0].lNodes[0].ldInst).toBe('LD_Disconnector')
	})

	it('GIVEN IEDs WHEN filtering with non-matching term THEN should return empty array', () => {
		// WHEN filtering by "NonExistent"
		const result = filterByLDevice(mockIEDs, 'NonExistent')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering with empty term THEN should return empty array', () => {
		// WHEN filtering by empty string
		const result = filterByLDevice(mockIEDs, '')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering with whitespace term THEN should trim and return empty', () => {
		// WHEN filtering by whitespace
		const result = filterByLDevice(mockIEDs, '   ')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs with undefined LDevice names WHEN filtering THEN should handle undefined gracefully', () => {
		// WHEN filtering with term that won't match undefined
		const result = filterByLDevice(mockIEDs, 'test')

		// THEN should not match undefined ldInsts
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering THEN should preserve parent IED and AccessPoint hierarchy', () => {
		// GIVEN original elements
		const originalIEDElement = mockIEDs[0].element
		const originalAPElement = mockIEDs[0].accessPoints[0].element

		// WHEN filtering
		const result = filterByLDevice(mockIEDs, 'Breaker')

		// THEN should preserve parent hierarchy
		expect(result[0].name).toBe('IED_Protection')
		expect(result[0].element).toBe(originalIEDElement)
		expect(result[0].accessPoints[0].element).toBe(originalAPElement)
	})

	it('GIVEN AccessPoint with no matching LNodes WHEN filtering THEN should not include that AccessPoint', () => {
		// WHEN filtering by "Breaker" (only in AP1)
		const result = filterByLDevice(mockIEDs, 'Circuit_Breaker')

		// THEN should only include AP1, not AP2
		expect(result).toHaveLength(1)
		expect(result[0].accessPoints).toHaveLength(1)
		expect(result[0].accessPoints[0].name).toBe('AP1')
	})

	it('GIVEN IED with AccessPoint containing only non-matching LNodes WHEN filtering THEN should not include IED', () => {
		// GIVEN IED with only undefined ldInst
		const iedNoMatch = mockIEDs.filter((ied) => ied.name === 'IED_NoLDevice')

		// WHEN filtering
		const result = filterByLDevice(iedNoMatch, 'anything')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})
})
