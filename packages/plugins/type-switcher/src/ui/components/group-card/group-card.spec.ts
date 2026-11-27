import { render, screen, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import GroupCard from './group-card.svelte'

it('GIVEN a group without items or an icon WHEN rendered THEN it shows an empty preview and a zero count', () => {
	const { container } = render(GroupCard, {
		dataTestid: 'empty-card',
		icon: undefined,
		items: [],
		onclick: () => {},
		selected: false
	})

	expect(
		within(screen.getByRole('list')).queryAllByRole('listitem')
	).toHaveLength(0)
	expect(screen.getByText('0')).toBeTruthy()
	expect(container.querySelector('svg')).toBeNull()
})

it('GIVEN a duplicate group WHEN it is focused and activated with the keyboard THEN it is selected', async () => {
	const user = userEvent.setup()
	const onClick = vi.fn()
	render(GroupCard, {
		icon: 'LN',
		items: ['Type A', 'Type B'],
		onclick: onClick,
		dataTestid: 'duplicate-card',
		selected: false
	})
	const card = screen.getByRole('button')
	card.focus()

	await user.keyboard('{Enter}')

	expect(document.activeElement).toBe(card)
	expect(onClick).toHaveBeenCalledOnce()
})
