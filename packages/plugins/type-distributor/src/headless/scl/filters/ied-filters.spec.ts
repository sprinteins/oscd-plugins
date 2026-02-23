import { describe, it, expect } from 'vitest'
import { filterByIED } from './ied-filters'
import type { IEDData } from './types'

describe('filterByIED', () => {
	const mockIEDs: IEDData[] = [
		{
			name: 'IED_Bay1_Protection',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP1',
					lNodes: [
						{ lnClass: 'XCBR', lnType: 'XCBR_Type1', lnInst: '1', ldInst: 'LD0' }
					]
				}
			]
		},
		{
			name: 'IED_Bay2_Control',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP1',
					lNodes: [
						{ lnClass: 'CSWI', lnType: 'CSWI_Type1', lnInst: '1', ldInst: 'LD0' }
					]
				}
			]
		},
		{
			name: 'IED_Substation_Measurement',
			element: document.createElement('IED'),
			accessPoints: []
		}
	]

	it('GIVEN IEDs with matching names WHEN filtering by IED name THEN should return matching IEDs with all accessPoints', () => {
		// WHEN filtering by "Bay1"
		const result = filterByIED(mockIEDs, 'Bay1')

		// THEN should return only matching IED with all accessPoints intact
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Bay1_Protection')
		expect(result[0].accessPoints).toHaveLength(1)
		expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
	})

	it('GIVEN IEDs with partial matching names WHEN filtering with lowercase term THEN should match case-insensitively', () => {
		// WHEN filtering by "control"
		const result = filterByIED(mockIEDs, 'control')

		// THEN should return matching IED
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Bay2_Control')
	})

	it('GIVEN IEDs WHEN filtering with term matching multiple IEDs THEN should return all matches', () => {
		// WHEN filtering by "IED_Bay"
		const result = filterByIED(mockIEDs, 'IED_Bay')

		// THEN should return both Bay IEDs
		expect(result).toHaveLength(2)
		expect(result[0].name).toBe('IED_Bay1_Protection')
		expect(result[1].name).toBe('IED_Bay2_Control')
	})

	it('GIVEN IEDs WHEN filtering with non-matching term THEN should return empty array', () => {
		// WHEN filtering by "nonexistent"
		const result = filterByIED(mockIEDs, 'nonexistent')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering with empty term THEN should return empty array', () => {
		// WHEN filtering by empty string
		const result = filterByIED(mockIEDs, '')

		// THEN should return empty array (normalized to empty)
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering with whitespace-only term THEN should return empty array', () => {
		// WHEN filtering by whitespace
		const result = filterByIED(mockIEDs, '   ')

		// THEN should return empty array (trimmed to empty)
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering with term containing whitespace THEN should trim and match', () => {
		// WHEN filtering by " Bay1 " (with spaces)
		const result = filterByIED(mockIEDs, '  Bay1  ')

		// THEN should trim and match
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Bay1_Protection')
	})

	it('GIVEN IEDs WHEN filtering THEN should preserve original elements', () => {
		// GIVEN original elements
		const originalElement = mockIEDs[0].element

		// WHEN filtering
		const result = filterByIED(mockIEDs, 'Bay1')

		// THEN should preserve original element reference
		expect(result[0].element).toBe(originalElement)
	})
})
