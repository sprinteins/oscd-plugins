import { render, screen, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CardItem } from './card-item'
import GroupCardList from './group-card-list.svelte'

describe('GIVEN groups of duplicate types', () => {
	const itemSets: CardItem[] = [
		{ icon: 'lNIcon', items: ['A', 'B', 'C', 'D'] },
		{ icon: 'dOIcon', items: ['E', 'F'] }
	]
	let onSelect: ReturnType<typeof vi.fn<(index: number) => void>>
	let user: ReturnType<typeof userEvent.setup>

	beforeEach(() => {
		onSelect = vi.fn()
		user = userEvent.setup()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('WHEN rendered THEN each card previews its types and shows the total', () => {
		render(GroupCardList, { itemSets, onclick: onSelect })

		const card = screen.getByTestId('card_0')
		expect(
			within(card)
				.getAllByRole('listitem')
				.map((item) => item.textContent)
		).toEqual(['A', 'B', 'C'])
		expect(within(card).getByText('4')).toBeTruthy()
		expect(card.getAttribute('title')).toBe('A\nB\nC\nD')
	})

	it('WHEN a card is clicked THEN it reports its index and reflects the controlled selection', async () => {
		const result = render(GroupCardList, {
			itemSets,
			onclick: onSelect,
			selectedIndex: 0
		})
		const first = screen.getByTestId('card_0')
		const second = screen.getByTestId('card_1')

		await user.click(second)

		expect(onSelect).toHaveBeenCalledExactlyOnceWith(1)
		expect(first.classList.contains('shadow')).toBe(true)
		expect(second.classList.contains('shadow')).toBe(false)

		await result.rerender({ selectedIndex: 1 })

		expect(first.classList.contains('shadow')).toBe(false)
		expect(second.classList.contains('shadow')).toBe(true)
	})
})

it('GIVEN no duplicate groups WHEN rendered THEN no cards are shown', () => {
	render(GroupCardList, { onclick: () => {} })

	expect(screen.queryAllByTestId(/^card_/)).toHaveLength(0)
})
