import { cleanup, render, screen } from '@testing-library/svelte'
import { afterEach, expect, it } from 'vitest'
import Layout from './layout.svelte'

afterEach(() => {
	cleanup()
})

it('GIVEN plugin startup with no selected data object WHEN the layout renders THEN it asks the user to select one', () => {
	render(Layout)

	expect(
		screen.getByText('Please select a data object in the left sidebar.')
	).toBeTruthy()
})
