// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/svelte'
import { get } from 'svelte/store'
import { afterEach, describe, expect, it } from 'vitest'
import { filterState } from '../../../../stores/_store-view-filter'
import { setTargetMessageType } from './message-type-filter'
import MessageTypeFilter from './message-type-filter.svelte'

afterEach(() => {
	cleanup()
})

describe('GIVEN a message type filter', () => {
	it('WHEN a filter is disabled THEN its accessible checkbox is disabled', () => {
		render(MessageTypeFilter, {
			filterDisabled: true,
			selectedMessageTypes: []
		})

		expect(screen.getByRole('checkbox', { name: 'MMS' })).toHaveProperty(
			'disabled',
			true
		)
	})

	it('WHEN a filter is enabled THEN its accessible checkbox is enabled', () => {
		render(MessageTypeFilter, {
			filterDisabled: false,
			selectedMessageTypes: ['MMS']
		})

		expect(screen.getByRole('checkbox', { name: 'MMS' })).toHaveProperty(
			'disabled',
			false
		)
		expect(
			screen
				.getByRole('checkbox', { name: 'MMS' })
				.getAttribute('data-state')
		).toBe('checked')
	})

	it('WHEN a checked message type is cleared THEN the filter store removes that type', () => {
		filterState.update((state) => ({
			...state,
			selectedMessageTypes: ['MMS', 'GOOSE']
		}))

		setTargetMessageType('MMS', false)

		expect(get(filterState).selectedMessageTypes).toEqual(['GOOSE'])
	})
})
