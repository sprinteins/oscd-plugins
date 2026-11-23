// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { get } from 'svelte/store'
import { afterEach, describe, expect, it } from 'vitest'
import {
	defaultSelection,
	filterState
} from '../../../stores/_store-view-filter'
import type { IEDElkNode, RootNode } from '../diagram'
import Sidebar from './sidebar.svelte'

afterEach(() => {
	cleanup()
	filterState.set(structuredClone(defaultSelection))
})

function createNode(label: string, bays: string[]): IEDElkNode {
	return {
		id: label,
		label,
		children: [],
		edges: [],
		details: {
			logicalNodes: [],
			dataObjects: [],
			dataAttributes: []
		},
		bays: new Set(bays),
		bayLabelHeight: 15,
		bayLabelGap: 2,
		iedHeight: 40
	}
}

describe('GIVEN the Communication Explorer sidebar', () => {
	it('WHEN a bay option is selected with the keyboard THEN the bay IEDs are selected', async () => {
		const user = userEvent.setup()
		const node = createNode('IED_1', ['Bay A'])
		const rootNode: RootNode = {
			id: 'root',
			children: [node]
		}
		render(Sidebar, { rootNode, bays: ['Bay A'] })

		const search = screen.getByRole('combobox', {
			name: 'Filter IED or bay'
		})
		await user.click(search)
		await user.type(search, 'Bay')
		await user.keyboard('{ArrowDown}{Enter}')

		expect(get(filterState).selectedIEDs).toEqual([node])
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('WHEN Clear all is activated THEN IED search and selection state are cleared', async () => {
		const user = userEvent.setup()
		const node = createNode('IED_1', [])
		const rootNode: RootNode = {
			id: 'root',
			children: [node]
		}
		filterState.update((state) => ({
			...state,
			selectedIEDs: [node],
			nameFilter: 'IED'
		}))
		render(Sidebar, { rootNode, bays: [] })

		await user.click(screen.getByRole('button', { name: 'Clear all' }))

		expect(get(filterState).selectedIEDs).toEqual([])
		expect(
			(
				screen.getByRole('combobox', {
					name: 'Filter IED or bay'
				}) as HTMLInputElement
			).value
		).toBe('')
	})
})
