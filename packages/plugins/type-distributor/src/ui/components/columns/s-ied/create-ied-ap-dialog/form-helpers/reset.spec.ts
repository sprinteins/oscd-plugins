import { beforeEach, describe, expect, it } from 'vitest'
import {
	createInitialAccessPoint,
	createInitialAccessPoints,
	createInitialIedData,
	removePendingAccessPoint
} from './reset'
import type { AccessPointData } from './types'

it('GIVEN a new form WHEN initialized THEN starts with an empty IED and one empty AccessPoint', () => {
	expect(createInitialIedData()).toEqual({
		name: '',
		description: '',
		isNew: true
	})
	expect(createInitialAccessPoints()).toEqual([
		{ name: '', description: '', serverAtApName: '' }
	])
})

describe('GIVEN pending hosts and ServerAt AccessPoints', () => {
	let confirmedAps: AccessPointData[]
	let activeAp: AccessPointData

	beforeEach(() => {
		confirmedAps = [
			{ name: 'Host', description: '' },
			{ name: 'Shared1', description: '', serverAtApName: 'Host' },
			{ name: 'Shared2', description: '', serverAtApName: 'Host' },
			{ name: 'OtherHost', description: '' },
			{
				name: 'OtherShared',
				description: '',
				serverAtApName: 'OtherHost'
			}
		]
		activeAp = { name: 'Draft', description: 'Keep' }
	})

	it('WHEN removing a host THEN removes all its dependents and preserves unrelated entries and active input', () => {
		const result = removePendingAccessPoint(confirmedAps, activeAp, 'Host')
		expect(result).toEqual([...confirmedAps.slice(3), activeAp])
		expect(result.at(-1)).toBe(activeAp)
		expect(confirmedAps).toHaveLength(5)
	})

	it('WHEN removing a host used by the active entry THEN resets active input and keeps an editable entry', () => {
		activeAp.serverAtApName = 'Host'
		expect(
			removePendingAccessPoint(confirmedAps, activeAp, 'Host')
		).toEqual([...confirmedAps.slice(3), createInitialAccessPoint()])
		expect(activeAp.name).toBe('Draft')
	})

	it('WHEN removing a ServerAt entry THEN preserves its host and sibling references', () => {
		expect(
			removePendingAccessPoint(confirmedAps, activeAp, 'Shared1')
		).toEqual([confirmedAps[0], ...confirmedAps.slice(2), activeAp])
	})

	it('WHEN removing the last host and its active dependent THEN leaves one empty entry', () => {
		activeAp.serverAtApName = 'Host'
		expect(
			removePendingAccessPoint(confirmedAps.slice(0, 3), activeAp, 'Host')
		).toEqual(createInitialAccessPoints())
	})

	it('WHEN removing an unknown name THEN preserves all entries', () => {
		expect(
			removePendingAccessPoint(confirmedAps, activeAp, 'Missing')
		).toEqual([...confirmedAps, activeAp])
	})
})
