import { fireEvent, render, screen } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GroupCard } from '../group-card'
import type { CardItem } from './card-item'
import GroupCardList from './group-card-list.svelte'

describe('GIVEN a list of groups', () => {
	let itemSets: CardItem[]

	beforeEach(() => {
		itemSets = [
			{ icon: 'lNIcon', items: ['phaseA', 'phaseB', 'phaseC'] },
			{ icon: 'dAIcon', items: ['phaseA', 'phaseB'] },
			{ items: [] }
		]
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('WHEN a group card is clicked THEN its index is reported', async () => {
		const onClick = vi.fn()
		render(GroupCardList, { itemSets, onclick: onClick })

		await fireEvent.click(screen.getByTestId('card_0'))

		expect(onClick).toHaveBeenCalledWith(0)
	})

	it('WHEN a selected group index is provided THEN its card is styled as selected', () => {
		render(GroupCardList, {
			itemSets,
			onclick: vi.fn(),
			selectedIndex: 1
		})

		expect(
			screen
				.getByTestId('card_1')
				.classList.contains('border-[var(--mdc-theme-primary)]')
		).toBe(true)
	})
})

describe('GIVEN a group card without optional props', () => {
	it('WHEN rendered THEN default item and selection values are used', () => {
		const { container } = render(GroupCard, { icon: undefined })

		expect(
			container.firstElementChild?.classList.contains(
				'border-transparent'
			)
		).toBe(true)
	})
})
