import { render, screen, within } from '@testing-library/svelte'
import { expect, it } from 'vitest'
import GroupCard from './group-card.svelte'

it('GIVEN a group without items or an icon WHEN rendered THEN it shows an empty preview and a zero count', () => {
	const { container } = render(GroupCard, { icon: undefined })

	expect(
		within(screen.getByRole('list')).queryAllByRole('listitem')
	).toHaveLength(0)
	expect(screen.getByText('0')).toBeTruthy()
	expect(container.querySelector('svg')).toBeNull()
})
