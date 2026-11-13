import { render, screen, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import CategorySelector from './category-selector.svelte'

describe('GIVEN the available type categories', () => {
	let user: ReturnType<typeof userEvent.setup>

	beforeEach(() => {
		user = userEvent.setup()
		render(CategorySelector, {
			labels: ['LN Type', 'DO Type', 'DA Type', 'Enum Type'],
			selected: [],
			testid: 'categories'
		})
	})

	it('WHEN rendered THEN it displays each category', () => {
		for (const label of ['LN Type', 'DO Type', 'DA Type', 'Enum Type']) {
			expect(
				screen.getByTestId(`categories_${label}`).textContent
			).toContain(label)
		}
	})

	it('WHEN categories are selected and deselected THEN each selection is independent', async () => {
		const lnType = screen.getByTestId('categories_LN Type')
		const doType = screen.getByTestId('categories_DO Type')

		await user.click(screen.getByText('LN Type'))
		await user.click(screen.getByText('DO Type'))

		await waitFor(() => {
			expect(lnType.classList.contains('mdc-chip--selected')).toBe(true)
			expect(doType.classList.contains('mdc-chip--selected')).toBe(true)
		})

		await user.click(screen.getByText('LN Type'))

		await waitFor(() => {
			expect(lnType.classList.contains('mdc-chip--selected')).toBe(false)
			expect(doType.classList.contains('mdc-chip--selected')).toBe(true)
		})
	})
})

it('GIVEN a preselected category WHEN rendered THEN its chip is selected', async () => {
	render(CategorySelector, {
		labels: ['LN Type', 'DO Type'],
		selected: ['DO Type']
	})

	await waitFor(() => {
		expect(
			screen
				.getByText('DO Type')
				.closest('.mdc-chip')
				?.classList.contains('mdc-chip--selected')
		).toBe(true)
	})
	expect(
		screen
			.getByText('LN Type')
			.closest('.mdc-chip')
			?.classList.contains('mdc-chip--selected')
	).toBe(false)
})
