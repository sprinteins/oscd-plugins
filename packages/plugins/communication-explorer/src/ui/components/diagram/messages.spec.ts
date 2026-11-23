// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte'
import { afterEach, describe, expect, it } from 'vitest'
import Message from './message.svelte'
import type { IEDConnection } from './nodes'

const connection: IEDConnection = {
	id: 'relevant-connection',
	sources: [],
	targets: [],
	isRelevant: true,
	sections: [
		{
			id: 'connection',
			startPoint: { x: 0, y: 0 },
			endPoint: { x: 0, y: 200 },
			bendPoints: []
		}
	]
}

afterEach(() => {
	cleanup()
})

describe('GIVEN a connection', () => {
	it('WHEN selected THEN it exposes the selected class', () => {
		render(Message, {
			edge: connection,
			isSelected: true,
			testid: 'connection'
		})

		expect(screen.getByTestId('connection').classList).toContain('selected')
	})

	it('WHEN not selected THEN it does not expose the selected class', () => {
		render(Message, {
			edge: connection,
			isSelected: false,
			testid: 'connection'
		})

		expect(screen.getByTestId('connection').classList).not.toContain(
			'selected'
		)
	})

	it('WHEN animation is enabled without a selection THEN animation layers do not render', () => {
		const { container } = render(Message, {
			edge: connection,
			playAnimation: true,
			testid: 'connection'
		})

		expect(container.querySelector('.path-animation')).toBeNull()
		expect(container.querySelector('.path-animation-border')).toBeNull()
	})

	it('WHEN animation is enabled for a selected connection THEN animation layers render', () => {
		const { container } = render(Message, {
			edge: connection,
			isSelected: true,
			playAnimation: true,
			testid: 'connection'
		})

		expect(container.querySelector('.path-animation')).toBeTruthy()
		expect(container.querySelector('.path-animation-border')).toBeTruthy()
	})

	it('WHEN animation is disabled THEN animation layers do not render', () => {
		const { container } = render(Message, {
			edge: connection,
			playAnimation: false,
			testid: 'connection'
		})

		expect(container.querySelector('.path-animation')).toBeNull()
		expect(container.querySelector('.path-animation-border')).toBeNull()
	})
})
