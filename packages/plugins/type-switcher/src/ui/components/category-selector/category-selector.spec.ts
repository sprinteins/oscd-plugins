import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import CategorySelector from './category-selector.svelte'

describe('GIVEN a category selector', () => {
	const categories = ['LN Type', 'DO Type', 'DA Type', 'Enum Type']

	it('WHEN a category is selected THEN all categories render and the selection is reflected', async () => {
		render(CategorySelector, {
			testid: 'category-selector',
			labels: categories,
			selected: []
		})

		for (const category of categories) {
			expect(
				screen.getByTestId(`category-selector_${category}`)
			).toBeTruthy()
		}

		const category = screen.getByTestId('category-selector_LN Type')
		await fireEvent.click(category)

		expect(category.classList.contains('mdc-chip--selected')).toBe(true)

		await fireEvent.click(category)

		expect(category.classList.contains('mdc-chip--selected')).toBe(false)
	})

	it('WHEN no categories are available THEN no category chips render', () => {
		render(CategorySelector, { labels: [] })

		expect(screen.queryByTestId('category-selector_LN Type')).toBeNull()
	})
})
