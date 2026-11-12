import { fireEvent, render, screen, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { EventDetailRelink, EventDetailTypeLinkerSelect } from './events'
import TypeLinker from './type-linker.svelte'

describe('GIVEN a group of duplicate types', () => {
	let onSelect: ReturnType<
		typeof vi.fn<(detail: EventDetailTypeLinkerSelect) => void>
	>
	let onRelink: ReturnType<typeof vi.fn<(detail: EventDetailRelink) => void>>
	let user: ReturnType<typeof userEvent.setup>

	beforeEach(() => {
		onSelect = vi.fn()
		onRelink = vi.fn()
		user = userEvent.setup()
		render(TypeLinker, {
			items: [
				{ label: 'Type A' },
				{ label: 'Type B' },
				{ label: 'Type C' }
			],
			handleSelect: onSelect,
			handleRelink: onRelink
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('WHEN individual sources are selected and deselected THEN it reports their indexes', async () => {
		await user.click(screen.getByRole('checkbox', { name: 'Type A' }))
		expect(onSelect).toHaveBeenLastCalledWith({ indexes: [0] })

		await user.click(screen.getByRole('checkbox', { name: 'Type B' }))
		expect(onSelect).toHaveBeenLastCalledWith({ indexes: [0, 1] })

		await user.click(screen.getByRole('checkbox', { name: 'Type A' }))
		expect(onSelect).toHaveBeenLastCalledWith({ indexes: [1] })
	})

	it('WHEN select all is toggled THEN it selects and clears every source', async () => {
		const selectAll = screen.getByRole('checkbox', { name: 'Select All' })

		await user.click(selectAll)

		expect(onSelect).toHaveBeenLastCalledWith({ indexes: [0, 1, 2] })
		for (const label of ['Type A', 'Type B', 'Type C']) {
			expect(
				screen.getByRole<HTMLInputElement>('checkbox', { name: label })
					.checked
			).toBe(true)
		}

		await user.click(selectAll)

		expect(onSelect).toHaveBeenLastCalledWith({ indexes: [] })
		for (const label of ['Type A', 'Type B', 'Type C']) {
			expect(
				screen.getByRole<HTMLInputElement>('checkbox', { name: label })
					.checked
			).toBe(false)
		}
	})

	it('WHEN a source is selected without a target THEN switching remains disabled', async () => {
		const switchButton = screen.getByRole<HTMLButtonElement>('button', {
			name: 'Switch'
		})
		await user.click(screen.getByRole('checkbox', { name: 'Type A' }))

		expect(switchButton.disabled).toBe(true)
		await fireEvent.click(switchButton)

		expect(onRelink).not.toHaveBeenCalled()
	})

	it('WHEN a target and sources are chosen THEN switching reports their indexes', async () => {
		const switchButton = screen.getByRole<HTMLButtonElement>('button', {
			name: 'Switch'
		})
		expect(switchButton.disabled).toBe(true)

		await user.click(screen.getByRole('combobox'))
		await user.click(await screen.findByRole('option', { name: 'Type C' }))
		// Let SMUI finish its close animation before the component is unmounted.
		await waitFor(() => {
			expect(
				document.querySelector('.mdc-menu-surface--animating-closed')
			).toBeNull()
		})
		expect(switchButton.disabled).toBe(true)

		await user.click(screen.getByRole('checkbox', { name: 'Type A' }))
		await user.click(screen.getByRole('checkbox', { name: 'Type B' }))
		expect(switchButton.disabled).toBe(false)

		await user.click(switchButton)

		expect(onRelink).toHaveBeenCalledExactlyOnceWith({
			sourceIndexes: [0, 1],
			targetIndex: 2
		})

		await user.click(screen.getByRole('checkbox', { name: 'Type A' }))
		await user.click(screen.getByRole('checkbox', { name: 'Type B' }))
		expect(switchButton.disabled).toBe(true)
	})

	it('WHEN every source is selected individually THEN select all reflects that state', async () => {
		for (const label of ['Type A', 'Type B', 'Type C']) {
			await user.click(screen.getByRole('checkbox', { name: label }))
		}

		expect(
			screen.getByRole<HTMLInputElement>('checkbox', {
				name: 'Select All'
			}).checked
		).toBe(true)
	})
})

it('GIVEN no duplicate types WHEN the linker is rendered THEN switching is unavailable', () => {
	render(TypeLinker, {
		handleSelect: () => {},
		handleRelink: () => {}
	})

	expect(screen.getAllByRole('checkbox')).toHaveLength(1)
	expect(
		screen.getByRole<HTMLButtonElement>('button', { name: 'Switch' })
			.disabled
	).toBe(true)
})
