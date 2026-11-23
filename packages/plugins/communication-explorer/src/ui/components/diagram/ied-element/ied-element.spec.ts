import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import type { IEDElkNode } from '../nodes'
import { IEDElement } from '.'

describe('IED', () => {
	it('renders', () => {
		const label = 'IED1'

		const node: IEDElkNode = {
			id: label,
			label: label,
			isRelevant: true,
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			edges: [],
			children: []
		}

		render(IEDElement, { node })
		const stuff = screen.getByText(label)
		expect(stuff).toBeTruthy()
	})

	it("applies 'isIrrelevant' class if the node's 'relevant' prop is false", () => {
		const label = 'IED1'

		const node: IEDElkNode = {
			id: label,
			label: label,
			isRelevant: false,
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			edges: [],
			children: []
		}

		render(IEDElement, { node })
		const stuff = screen.getByText(label)
		expect(stuff.classList.contains('isIrrelevant')).toBeTruthy()
	})

	it("applies 'selected' if the 'isSelected' prop is true", () => {
		const label = 'IED1'

		const node: IEDElkNode = {
			id: label,
			label: label,
			isRelevant: true,
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			edges: [],
			children: []
		}

		render(IEDElement, { node, isIEDSelected: true })
		const stuff = screen.getByText(label)
		expect(stuff.classList.contains('selected')).toBeTruthy()
	})
})
