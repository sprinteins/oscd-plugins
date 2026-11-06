import { beforeEach, describe, expect, it } from 'vitest'
import { filterIedDataBySearch } from './search-filters'
import type { IEDData } from './types'

describe('GIVEN IED data with searchable descendants', () => {
	let ieds: IEDData[]

	beforeEach(() => {
		ieds = [
			{
				name: 'ProtectionIED',
				element: document.createElement('IED'),
				accessPoints: [
					{
						element: document.createElement('AccessPoint'),
						name: 'MainAP',
						serverAt: null,
						lDevices: [
							{
								ldInst: 'ProtectionDevice',
								lns: [
									{
										lnClass: 'XCBR',
										lnType: 'BreakerType',
										inst: '1',
										ldInst: 'ProtectionDevice'
									}
								]
							}
						]
					}
				]
			}
		]
	})

	it('WHEN search type is IED THEN filters by IED name', () => {
		expect(filterIedDataBySearch(ieds, 'IED', 'protection')).toHaveLength(1)
		expect(filterIedDataBySearch(ieds, 'IED', 'missing')).toEqual([])
	})

	it('WHEN search type is AccessPoint THEN filters by AccessPoint name', () => {
		expect(
			filterIedDataBySearch(ieds, 'AccessPoint', 'MainAP')[0].accessPoints
		).toHaveLength(1)
	})

	it('WHEN search type is LDevice THEN filters by LDevice name', () => {
		expect(
			filterIedDataBySearch(ieds, 'LDevice', 'ProtectionDevice')[0]
				.accessPoints
		).toHaveLength(1)
	})

	it('WHEN search type is LN/LN0 THEN filters by LN name', () => {
		expect(
			filterIedDataBySearch(ieds, 'LN/LN0', 'XCBR')[0].accessPoints
		).toHaveLength(1)
	})

	it('WHEN search term is empty THEN returns all IED data', () => {
		expect(filterIedDataBySearch(ieds, 'IED', '')).toEqual(ieds)
	})
})
