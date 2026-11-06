import { beforeEach, describe, expect, it } from 'vitest'
import {
	filterAccessPointGroupsByAccessPoint,
	filterByAccessPoint,
	groupAccessPointsByServer
} from './access-point-filters'
import { filterByLDevice } from './ldevice-filters'
import { filterByLN } from './ln-filters'
import type { IEDData } from './types'

describe('GIVEN access points with multiple LDevices and LNs', () => {
	let ied: IEDData

	beforeEach(() => {
		const lDevices = [
			{
				ldInst: 'Protection',
				lns: [
					{
						lnClass: 'XCBR',
						lnType: 'Breaker',
						inst: '1',
						ldInst: 'Protection'
					},
					{
						lnClass: 'CSWI',
						lnType: 'Switch',
						inst: '2',
						ldInst: 'Protection'
					}
				]
			},
			{
				ldInst: 'Control',
				lns: [
					{
						lnClass: 'CSWI',
						lnType: 'Switch',
						inst: '1',
						ldInst: 'Control'
					}
				]
			}
		]
		ied = {
			name: 'IED',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'Host',
					lDevices
				},
				{
					element: document.createElement('AccessPoint'),
					name: 'Alias',
					lDevices,
					serverAtApName: 'Host'
				},
				{
					element: document.createElement('AccessPoint'),
					name: 'Unresolved',
					lDevices,
					serverAtApName: 'Missing'
				}
			]
		}
	})

	it('GIVEN LDevice filter WHEN grouping THEN host keeps only filtered lDevices', () => {
		const matchingAccessPoints = filterByLDevice([ied], 'Protection')[0]
			.accessPoints
		const groups = filterAccessPointGroupsByAccessPoint(
			groupAccessPointsByServer(ied.accessPoints),
			matchingAccessPoints
		)

		expect(groups[0]).toEqual({
			type: 'host',
			host: {
				...ied.accessPoints[0],
				lDevices: [ied.accessPoints[0].lDevices[0]]
			},
			serverAtAccessPoints: [matchingAccessPoints[1]]
		})
		expect(ied.accessPoints[0].lDevices).toHaveLength(2)
	})

	it('GIVEN LN filter WHEN grouping THEN host keeps only matching LDevices and LNs', () => {
		const matchingAccessPoints = filterByLN([ied], 'XCBR')[0].accessPoints
		const groups = filterAccessPointGroupsByAccessPoint(
			groupAccessPointsByServer(ied.accessPoints),
			matchingAccessPoints
		)

		expect(groups[0]).toEqual({
			type: 'host',
			host: {
				...ied.accessPoints[0],
				lDevices: [
					{
						...ied.accessPoints[0].lDevices[0],
						lns: [ied.accessPoints[0].lDevices[0].lns[0]]
					}
				]
			},
			serverAtAccessPoints: [matchingAccessPoints[1]]
		})
		expect(ied.accessPoints[0].lDevices[0].lns).toHaveLength(2)
	})

	it('WHEN only a filtered alias matches THEN keeps its filtered data and original host context', () => {
		const alias = filterByLN([ied], 'XCBR')[0].accessPoints[1]

		expect(
			filterAccessPointGroupsByAccessPoint(
				groupAccessPointsByServer(ied.accessPoints),
				[alias]
			)
		).toEqual([
			{
				type: 'host',
				host: ied.accessPoints[0],
				serverAtAccessPoints: [alias]
			}
		])
	})

	it('WHEN an unresolved ServerAt matches THEN keeps its filtered data', () => {
		const unresolved = filterByLN([ied], 'XCBR')[0].accessPoints[2]

		expect(
			filterAccessPointGroupsByAccessPoint(
				groupAccessPointsByServer(ied.accessPoints),
				[unresolved]
			)
		).toEqual([{ type: 'unresolved-server-at', accessPoint: unresolved }])
	})
})

describe('filterByAccessPoint', () => {
	const mockIEDs: IEDData[] = [
		{
			name: 'IED_Protection',
			element: document.createElement('IED'),
			accessPoints: [
				{
					element: document.createElement('AccessPoint'),
					name: 'AP_Primary',
					lDevices: [
						{
							ldInst: 'LD0',
							lns: [
								{
									lnClass: 'XCBR',
									lnType: 'XCBR_Type1',
									inst: '1',
									ldInst: 'LD0'
								}
							]
						}
					]
				},
				{
					element: document.createElement('AccessPoint'),
					name: 'AP_Secondary',
					lDevices: [
						{
							ldInst: 'LD1',
							lns: [
								{
									lnClass: 'XSWI',
									lnType: 'XSWI_Type1',
									inst: '1',
									ldInst: 'LD1'
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
							ldInst: 'LD0',
							lns: [
								{
									lnClass: 'CSWI',
									lnType: 'CSWI_Type1',
									inst: '1',
									ldInst: 'LD0'
								}
							]
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
					lDevices: []
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
		expect(result[0].accessPoints[0].lDevices).toHaveLength(1)
	})

	describe('groupAccessPointsByServer', () => {
		it('GIVEN host AccessPoints and valid ServerAt references WHEN grouping THEN returns aliases beside their host', () => {
			const host = {
				element: document.createElement('AccessPoint'),
				name: 'AP1',
				lDevices: []
			}
			const alias = {
				element: document.createElement('AccessPoint'),
				name: 'AP2',
				lDevices: [],
				serverAtApName: 'AP1'
			}
			const otherHost = {
				element: document.createElement('AccessPoint'),
				name: 'AP3',
				lDevices: []
			}

			expect(groupAccessPointsByServer([host, alias, otherHost])).toEqual(
				[
					{ type: 'host', host, serverAtAccessPoints: [alias] },
					{ type: 'host', host: otherHost, serverAtAccessPoints: [] }
				]
			)
		})

		it('GIVEN a ServerAt without a matching host WHEN grouping THEN keeps it visible as unresolved', () => {
			const unresolved = {
				element: document.createElement('AccessPoint'),
				name: 'AP2',
				lDevices: [],
				serverAtApName: 'MissingAP'
			}

			expect(groupAccessPointsByServer([unresolved])).toEqual([
				{ type: 'unresolved-server-at', accessPoint: unresolved }
			])
		})
	})

	describe('filterAccessPointGroupsByAccessPoint', () => {
		it('GIVEN a host group with multiple aliases WHEN only one alias matches THEN hides non-matching aliases', () => {
			const host = {
				element: document.createElement('AccessPoint'),
				name: 'AP1',
				lDevices: []
			}
			const matchingAlias = {
				element: document.createElement('AccessPoint'),
				name: 'AP2',
				lDevices: [],
				serverAtApName: 'AP1'
			}
			const nonMatchingAlias = {
				element: document.createElement('AccessPoint'),
				name: 'AP3',
				lDevices: [],
				serverAtApName: 'AP1'
			}
			const groups = groupAccessPointsByServer([
				host,
				matchingAlias,
				nonMatchingAlias
			])

			expect(
				filterAccessPointGroupsByAccessPoint(groups, [matchingAlias])
			).toEqual([
				{
					type: 'host',
					host,
					serverAtAccessPoints: [matchingAlias]
				}
			])
		})

		it('GIVEN a matching host with aliases WHEN filtering groups THEN keeps the host and only matching aliases', () => {
			const host = {
				element: document.createElement('AccessPoint'),
				name: 'AP1',
				lDevices: []
			}
			const alias = {
				element: document.createElement('AccessPoint'),
				name: 'AP2',
				lDevices: [],
				serverAtApName: 'AP1'
			}
			const groups = groupAccessPointsByServer([host, alias])

			expect(
				filterAccessPointGroupsByAccessPoint(groups, [host])
			).toEqual([{ type: 'host', host, serverAtAccessPoints: [] }])
		})

		it('GIVEN groups without matching AccessPoints WHEN filtering groups THEN removes the groups', () => {
			const host = {
				element: document.createElement('AccessPoint'),
				name: 'AP1',
				lDevices: []
			}
			const alias = {
				element: document.createElement('AccessPoint'),
				name: 'AP2',
				lDevices: [],
				serverAtApName: 'MissingAP'
			}

			expect(
				filterAccessPointGroupsByAccessPoint(
					groupAccessPointsByServer([host, alias]),
					[]
				)
			).toEqual([])
		})

		it('GIVEN an unresolved ServerAt WHEN filtering groups THEN keeps it only when it matches', () => {
			const unresolved = {
				element: document.createElement('AccessPoint'),
				name: 'AP2',
				lDevices: [],
				serverAtApName: 'MissingAP'
			}
			const groups = groupAccessPointsByServer([unresolved])

			expect(
				filterAccessPointGroupsByAccessPoint(groups, [unresolved])
			).toEqual([
				{ type: 'unresolved-server-at', accessPoint: unresolved }
			])
			expect(filterAccessPointGroupsByAccessPoint(groups, [])).toEqual([])
		})
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
						lDevices: []
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
