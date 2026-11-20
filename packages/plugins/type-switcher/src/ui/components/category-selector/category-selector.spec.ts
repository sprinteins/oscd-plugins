import { render, screen } from '@testing-library/svelte'
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
		const lnType = screen.getByRole('button', { name: 'LN Type' })
		const doType = screen.getByRole('button', { name: 'DO Type' })

		await user.click(lnType)
		await user.click(doType)

		expect(lnType.getAttribute('aria-pressed')).toBe('true')
		expect(doType.getAttribute('aria-pressed')).toBe('true')

		await user.click(lnType)

		expect(lnType.getAttribute('aria-pressed')).toBe('false')
		expect(doType.getAttribute('aria-pressed')).toBe('true')
	})

	it('WHEN a category receives keyboard input THEN focus is retained and it toggles', async () => {
		const lnType = screen.getByRole('button', { name: 'LN Type' })
		lnType.focus()

		await user.keyboard('{Enter}')

		expect(document.activeElement).toBe(lnType)
		expect(lnType.getAttribute('aria-pressed')).toBe('true')

		await user.keyboard(' ')

		expect(document.activeElement).toBe(lnType)
		expect(lnType.getAttribute('aria-pressed')).toBe('false')
	})
})

it('GIVEN a preselected category WHEN rendered THEN its chip is selected', () => {
	render(CategorySelector, {
		labels: ['LN Type', 'DO Type'],
		selected: ['DO Type'],
		testid: 'categories'
	})

	expect(
		screen
			.getByRole('button', { name: 'DO Type' })
			.getAttribute('aria-pressed')
	).toBe('true')
	expect(
		screen
			.getByRole('button', { name: 'LN Type' })
			.getAttribute('aria-pressed')
	).toBe('false')
})
