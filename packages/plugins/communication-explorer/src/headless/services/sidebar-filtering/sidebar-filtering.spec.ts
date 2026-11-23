import { describe, expect, it } from 'vitest'
import {
	filterSidebarSearchOptions,
	findSidebarIEDsByBay,
	isConnectionDirectionDisabled,
	resolveSidebarSearchOption
} from '.'

describe('GIVEN sidebar search options', () => {
	const ieds = [{ label: 'IED_A' }, { label: 'Relay 1' }]
	const bays = ['Bay A', 'Relay 1']

	it('WHEN the query is empty THEN all options remain visible', () => {
		expect(filterSidebarSearchOptions(ieds, bays, '')).toEqual({
			ieds,
			bays
		})
	})

	it('WHEN the query differs in case THEN matching IED and bay options remain visible', () => {
		expect(filterSidebarSearchOptions(ieds, bays, 'relay')).toEqual({
			ieds: [{ label: 'Relay 1' }],
			bays: ['Relay 1']
		})
	})

	it('WHEN a selected label is both an IED and a bay THEN the bay is resolved first', () => {
		expect(resolveSidebarSearchOption(ieds, bays, 'Relay 1')).toEqual({
			kind: 'bay',
			value: 'Relay 1'
		})
	})

	it('WHEN a selected label matches an IED only THEN the IED is returned', () => {
		expect(resolveSidebarSearchOption(ieds, bays, 'IED_A')).toEqual({
			kind: 'ied',
			value: { label: 'IED_A' }
		})
	})

	it('WHEN a selected label has no match THEN no option is returned', () => {
		expect(
			resolveSidebarSearchOption(ieds, bays, 'Missing')
		).toBeUndefined()
	})

	it('WHEN a bay is selected THEN all IEDs in that bay are returned', () => {
		const nodes = [
			{ label: 'IED_A', bays: new Set(['Bay A']) },
			{ label: 'IED_B', bays: new Set(['Bay A', 'Bay B']) },
			{ label: 'IED_C', bays: new Set(['Bay B']) }
		]

		expect(findSidebarIEDsByBay(nodes, 'Bay A')).toEqual(nodes.slice(0, 2))
	})
})

describe('GIVEN the connection direction filter', () => {
	it('WHEN IED filtering is disabled THEN the direction filter is disabled', () => {
		expect(
			isConnectionDirectionDisabled(
				{
					selectedIEDs: [{ label: 'IED_A' }],
					selectedConnection: undefined
				},
				true
			)
		).toBe(true)
	})

	it('WHEN no IED or connection is selected THEN the direction filter is disabled', () => {
		expect(
			isConnectionDirectionDisabled(
				{
					selectedIEDs: [],
					selectedConnection: undefined
				},
				false
			)
		).toBe(true)
	})

	it('WHEN an IED is selected THEN the direction filter is enabled', () => {
		expect(
			isConnectionDirectionDisabled(
				{
					selectedIEDs: [{ label: 'IED_A' }],
					selectedConnection: undefined
				},
				false
			)
		).toBe(false)
	})
})
