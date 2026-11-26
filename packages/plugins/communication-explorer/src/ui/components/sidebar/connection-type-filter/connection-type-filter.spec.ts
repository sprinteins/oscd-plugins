// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { get } from 'svelte/store'
import { afterEach, describe, expect, it } from 'vitest'
import {
	filterState,
	type SelectedFilter
} from '../../../../stores/_store-view-filter'
import ConnectionTypeFilter from './connection-type-filter.svelte'

afterEach(() => {
	cleanup()
})

describe('GIVEN connection direction filters', () => {
	it('WHEN filters are rendered THEN each button exposes its pressed state', () => {
		render(ConnectionTypeFilter, {
			isFilterIncomingActive: true,
			isFilterOutgoingActive: false
		})

		expect(
			screen
				.getByRole('button', { name: 'Published' })
				.getAttribute('aria-pressed')
		).toBe('true')
		expect(
			screen
				.getByRole('button', { name: 'Subscribed' })
				.getAttribute('aria-pressed')
		).toBe('false')
	})

	it('WHEN the subscribed filter is activated THEN the store keeps outgoing connections only', async () => {
		const user = userEvent.setup()
		filterState.set({
			...get(filterState),
			incomingConnections: true,
			outgoingConnections: true,
			incomingMessageFilterActive: false,
			outgoingMessageFilterActive: false
		} satisfies SelectedFilter)
		render(ConnectionTypeFilter, {
			isFilterIncomingActive: false,
			isFilterOutgoingActive: false
		})

		await user.click(screen.getByRole('button', { name: 'Subscribed' }))

		expect(get(filterState)).toMatchObject({
			incomingConnections: false,
			outgoingConnections: true,
			incomingMessageFilterActive: false,
			outgoingMessageFilterActive: true
		})
	})
})
