import { webcrypto } from 'node:crypto'
import { render, screen, waitFor, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Replace } from '@/headless/types'
import { duplicateTypesScd } from '@/testing/duplicate-types'
import TypeSwitcher from './type-switcher.svelte'

function panel(name: string): HTMLElement {
	const element = screen.getByRole('heading', { name }).parentElement
	if (!element) throw new Error(`Missing ${name} panel`)
	return element
}

describe('GIVEN an SCD with duplicate types and usages', () => {
	let doc: Document
	let user: ReturnType<typeof userEvent.setup>
	let onAction: ReturnType<typeof vi.fn<(event: Event) => void>>
	let setDocument: (document: Element) => Promise<void>

	beforeEach(async () => {
		vi.stubGlobal('crypto', webcrypto)
		doc = new DOMParser().parseFromString(
			duplicateTypesScd,
			'application/xml'
		)
		user = userEvent.setup()
		onAction = vi.fn()
		const { container, rerender } = render(TypeSwitcher, {
			doc: doc.documentElement
		})
		setDocument = (document) => rerender({ doc: document })
		container.addEventListener('editor-action', onAction)
		await screen.findByText('DO Type (1)')
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	async function selectTarget(name: string) {
		await user.click(screen.getByRole('combobox'))
		await user.click(await screen.findByRole('option', { name }))
		// Let SMUI finish its close animation before the component is unmounted.
		await waitFor(() => {
			expect(
				document.querySelector('.mdc-menu-surface--animating-closed')
			).toBeNull()
		})
	}

	it('WHEN duplicates are loaded THEN all four categories and their groups are shown', () => {
		for (const label of [
			'LN Type (1)',
			'DO Type (1)',
			'DA Type (1)',
			'Enum Type (1)'
		]) {
			expect(screen.getByText(label)).toBeTruthy()
		}

		expect(
			screen
				.getAllByTestId(/^card_/)
				.map((card) => card.getAttribute('title'))
		).toEqual([
			'ln-a\nln-b',
			'do-a\ndo-b\ndo-c',
			'da-a\nda-b',
			'enum-a\nenum-b'
		])
		expect(
			screen.getByRole<HTMLButtonElement>('button', { name: 'Switch' })
				.disabled
		).toBe(true)
	})

	it('WHEN the category filter changes THEN stale group details and affected nodes are cleared', async () => {
		await user.click(screen.getByText('DO Type (1)'))
		await waitFor(() => {
			expect(screen.getAllByTestId(/^card_/)).toHaveLength(1)
		})
		await user.click(screen.getByTestId('card_0'))
		await user.click(screen.getByRole('checkbox', { name: 'do-a' }))

		expect(
			within(panel('Affected Nodes')).getByText('ln-uses')
		).toBeTruthy()
		expect(within(panel('Structure')).getByText('stVal')).toBeTruthy()

		await user.click(screen.getByText('Enum Type (1)'))
		await user.click(screen.getByText('DO Type (1)'))

		await waitFor(() => {
			expect(screen.getAllByTestId(/^card_/)).toHaveLength(1)
			expect(screen.queryByRole('checkbox', { name: 'do-a' })).toBeNull()
			expect(
				within(panel('Affected Nodes')).queryAllByRole('listitem')
			).toHaveLength(0)
			expect(within(panel('Structure')).queryByText('stVal')).toBeNull()
		})

		await user.click(screen.getByTestId('card_0'))
		expect(within(panel('Structure')).getByText('Open')).toBeTruthy()
		expect(within(panel('Structure')).getByText('EnumVal')).toBeTruthy()
	})

	it('WHEN the document changes and the selected category count becomes zero THEN stale results are removed', async () => {
		await user.click(screen.getByText('DO Type (1)'))
		await waitFor(() => {
			expect(screen.getAllByTestId(/^card_/)).toHaveLength(1)
		})
		await user.click(screen.getByTestId('card_0'))
		await user.click(screen.getByRole('checkbox', { name: 'do-a' }))

		const empty = new DOMParser().parseFromString(
			'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><DataTypeTemplates /></SCL>',
			'application/xml'
		)
		await setDocument(empty.documentElement)
		await screen.findByText('DO Type (0)')

		expect(screen.queryAllByTestId(/^card_/)).toHaveLength(0)
		expect(screen.queryByRole('checkbox', { name: 'do-a' })).toBeNull()
		expect(
			within(panel('Affected Nodes')).queryAllByRole('listitem')
		).toHaveLength(0)
	})

	it('WHEN a duplicate DO type is switched THEN it emits the replacements as an editor action', async () => {
		await user.click(screen.getByText('DO Type (1)'))
		await waitFor(() => {
			expect(screen.getAllByTestId(/^card_/)).toHaveLength(1)
		})
		await user.click(screen.getByTestId('card_0'))
		await user.click(screen.getByRole('checkbox', { name: 'do-a' }))

		for (const name of ['ln-a', 'ln-b', 'ln-uses']) {
			expect(within(panel('Affected Nodes')).getByText(name)).toBeTruthy()
		}

		await selectTarget('do-b')
		await user.click(screen.getByRole('button', { name: 'Switch' }))

		expect(onAction).toHaveBeenCalledOnce()
		const event = onAction.mock.calls[0][0]
		if (!(event instanceof CustomEvent))
			throw new Error('Expected editor action')
		expect(event.bubbles).toBe(true)
		expect(event.composed).toBe(true)

		const actions: Replace[] = event.detail.action.actions
		expect(actions.map((action) => action.old.element)).toEqual(
			Array.from(doc.querySelectorAll('DO[type="do-a"]'))
		)
		for (const action of actions) {
			expect(action.new.element.getAttribute('type')).toBe('do-b')
		}
	})
})

it('GIVEN no document WHEN the view is initialized THEN no duplicate groups are displayed', () => {
	render(TypeSwitcher, {})

	expect(screen.getByText('DO Type (0)')).toBeTruthy()
	expect(screen.queryAllByTestId(/^card_/)).toHaveLength(0)
})
