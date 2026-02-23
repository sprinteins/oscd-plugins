import { describe, it, expect } from 'vitest'
import { filterByAccessPoint } from './access-point-filters'
import type { IEDData } from './types'

describe('filterByAccessPoint', () => {
	const mockIEDs: IEDData[] = [
		{
			name: 'IED_Protection',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP_Primary',
					lNodes: [
						{
							lnClass: 'XCBR',
							lnType: 'XCBR_Type1',
							lnInst: '1',
							ldInst: 'LD0'
						}
					]
				},
				{
					element: document.createElement('AccessPoint'),
					name: 'AP_Secondary',
					lNodes: [
						{
							lnClass: 'XSWI',
							lnType: 'XSWI_Type1',
							lnInst: '1',
							ldInst: 'LD1'
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
					lNodes: [
						{
							lnClass: 'CSWI',
							lnType: 'CSWI_Type1',
							lnInst: '1',
							ldInst: 'LD0'
						}
					]
				}
			]
		},
		{
			name: 'IED_NoMatching',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP_NonMatch',
					lNodes: []
				}
			]
		}
	]

	it('GIVEN IEDs with matching AccessPoint WHEN filtering by AccessPoint name THEN should return IED with only matching AccessPoints', () => {
		// WHEN filtering by "Primary"
		const result = filterByAccessPoint(mockIEDs, 'Primary')

		// THEN should return only IED with matching AccessPoint
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Protection')
		expect(result[0].accessPoints).toHaveLength(1)
		expect(result[0].accessPoints[0].name).toBe('AP_Primary')
		expect(result[0].accessPoints[0].lNodes).toHaveLength(1)
	})

	it('GIVEN IED with multiple AccessPoints WHEN filtering matches multiple THEN should return IED with all matching AccessPoints', () => {
		// WHEN filtering by "AP_" (matches multiple)
		const result = filterByAccessPoint(mockIEDs, 'AP_')

		// THEN should return all IEDs with matching AccessPoints
		expect(result).toHaveLength(3)
		expect(result[0].accessPoints).toHaveLength(2) // IED_Protection has 2 matching
		expect(result[1].accessPoints).toHaveLength(1) // IED_Control has 1 matching
	})

	it('GIVEN multiple IEDs with matching AccessPoint names WHEN filtering THEN should return all matching IEDs', () => {
		// WHEN filtering by "Main"
		const result = filterByAccessPoint(mockIEDs, 'Main')

		// THEN should return IED with Main AccessPoint
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('IED_Control')
		expect(result[0].accessPoints[0].name).toBe('AP_Main')
	})

	it('GIVEN IEDs WHEN filtering with case-insensitive term THEN should match correctly', () => {
		// WHEN filtering by "secondary" (lowercase)
		const result = filterByAccessPoint(mockIEDs, 'secondary')

		// THEN should match case-insensitively
		expect(result).toHaveLength(1)
		expect(result[0].accessPoints[0].name).toBe('AP_Secondary')
	})

	it('GIVEN IEDs WHEN filtering with non-matching term THEN should return empty array', () => {
		// WHEN filtering by "DoesNotExist"
		const result = filterByAccessPoint(mockIEDs, 'DoesNotExist')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering with empty term THEN should return empty array', () => {
		// WHEN filtering by empty string
		const result = filterByAccessPoint(mockIEDs, '')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering with whitespace term THEN should trim and return empty', () => {
		// WHEN filtering by whitespace
		const result = filterByAccessPoint(mockIEDs, '   ')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs with null AccessPoint names WHEN filtering THEN should handle null gracefully', () => {
		// GIVEN IED with null AccessPoint name
		const iedWithNullAP: IEDData[] = [
			{
				name: 'IED_WithNull',
				element: document.createElement('IED'),
				accessPoints: [
					{
						element: document.createElement('AccessPoint'),
						name: null,
						lNodes: []
					}
				]
			}
		]

		// WHEN filtering
		const result = filterByAccessPoint(iedWithNullAP, 'test')

		// THEN should return empty array (no match)
		expect(result).toHaveLength(0)
	})

	it('GIVEN IEDs WHEN filtering THEN should preserve parent IED hierarchy', () => {
		// GIVEN original IED element
		const originalElement = mockIEDs[0].element

		// WHEN filtering
		const result = filterByAccessPoint(mockIEDs, 'Primary')

		// THEN should preserve parent IED
		expect(result[0].name).toBe('IED_Protection')
		expect(result[0].element).toBe(originalElement)
	})

	it('GIVEN IED with no AccessPoints WHEN filtering THEN should not include IED', () => {
		// GIVEN IED with empty accessPoints
		const iedWithoutAPs: IEDData[] = [
			{
				name: 'IED_Empty',
				element: document.createElement('IED'),
				accessPoints: []
			}
		]

		// WHEN filtering
		const result = filterByAccessPoint(iedWithoutAPs, 'anything')

		// THEN should return empty array
		expect(result).toHaveLength(0)
	})
})
