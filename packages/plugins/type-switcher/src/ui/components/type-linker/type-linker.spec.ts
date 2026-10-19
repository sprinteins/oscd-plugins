import { fireEvent, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EventDetailRelink, EventDetailTypeLinkerSelect } from './events'
import TypeLinker from './type-linker.svelte'

describe('GIVEN duplicate types', () => {
	const items = [{ label: 'Type A' }, { label: 'Type B' }]
	let selectDetails: EventDetailTypeLinkerSelect[]
	let relinkDetails: EventDetailRelink[]

	beforeEach(() => {
		selectDetails = []
		relinkDetails = []
		render(TypeLinker, {
			items,
			handleSelect: (detail) => selectDetails.push(detail),
			handleRelink: (detail) => relinkDetails.push(detail)
		})
	})

	it('WHEN no source or target is selected THEN switching is disabled', async () => {
		const switchButton = screen.getByRole('button', { name: 'Switch' })
		expect(switchButton.hasAttribute('disabled')).toBe(true)
		await fireEvent.click(switchButton)
		expect(relinkDetails).toEqual([])
	})

	it('WHEN a source type is selected THEN its index is reported', async () => {
		const source = screen.getByLabelText('Type A')

		await fireEvent.click(source)
		expect(selectDetails.at(-1)).toEqual({ indexes: [0] })

		await fireEvent.click(source)
		expect(selectDetails.at(-1)).toEqual({ indexes: [] })
	})

	it('WHEN all source types are selected and cleared THEN each selection is reported', async () => {
		const selectAll = screen.getByLabelText('Select All')

		await fireEvent.click(selectAll)
		expect(selectDetails.at(-1)).toEqual({ indexes: [0, 1] })

		await fireEvent.click(selectAll)
		expect(selectDetails.at(-1)).toEqual({ indexes: [] })
	})

	it('WHEN a source and target are selected THEN switching reports their indexes', async () => {
		await fireEvent.click(screen.getByLabelText('Type A'))
		await fireEvent.click(screen.getByRole('combobox'))
		await fireEvent.click(
			await screen.findByRole('option', { name: 'Type B' })
		)

		const switchButton = screen.getByRole('button', { name: 'Switch' })
		expect(switchButton.hasAttribute('disabled')).toBe(false)
		await fireEvent.click(switchButton)

		expect(relinkDetails.at(-1)).toEqual({
			sourceIndexes: [0],
			targetIndex: 1
		})
	})
})

describe('GIVEN no duplicate types', () => {
	it('WHEN the type linker renders THEN it shows no source types and disables switching', () => {
		render(TypeLinker, {
			handleSelect: () => {},
			handleRelink: () => {}
		})

		expect(screen.queryByLabelText('Type A')).toBeNull()
		expect(
			screen
				.getByRole('button', { name: 'Switch' })
				.hasAttribute('disabled')
		).toBe(true)
	})
})
