// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { ConnectionTypeDirection } from '../../../../headless/services/ied-detail-view'
import PublisherSubscriberAccordion from './publisher-subscriber-accordion.svelte'

afterEach(() => {
	cleanup()
})

it('GIVEN a publisher accordion WHEN opened and closed THEN its content visibility follows its expanded state', async () => {
	const user = userEvent.setup()
	render(PublisherSubscriberAccordion, {
		serviceType: 'GOOSE',
		serviceLabel: 'GCB',
		color: '--color-message-goose',
		connectionDirection: ConnectionTypeDirection.OUTGOING,
		affectedIEDObjects: []
	})

	const trigger = screen.getByRole('button', { name: 'GOOSE - GCB' })
	expect(trigger.getAttribute('aria-expanded')).toBe('false')

	await user.click(trigger)
	expect(trigger.getAttribute('aria-expanded')).toBe('true')
	expect(
		screen
			.getByText('No items found')
			.closest('[data-state]')
			?.getAttribute('data-state')
	).toBe('open')

	await user.click(trigger)
	expect(trigger.getAttribute('aria-expanded')).toBe('false')
	expect(
		screen
			.getByText('No items found')
			.closest('[data-state]')
			?.getAttribute('data-state')
	).toBe('closed')
})
