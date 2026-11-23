import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import type { IEDElkNode } from '../nodes'
import { IEDElement } from '.'

function createNode(label: string, isRelevant: boolean): IEDElkNode {
	return {
		id: label,
		label,
		isRelevant,
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		edges: [],
		children: [],
		details: {
			logicalNodes: [],
			dataObjects: [],
			dataAttributes: []
		},
		bays: new Set(),
		bayLabelHeight: 15,
		bayLabelGap: 2,
		iedHeight: 40
	}
}

describe('GIVEN an IED element', () => {
	it('WHEN rendered THEN its label is visible', () => {
		const label = 'IED1'
		const node = createNode(label, true)
		render(IEDElement, { node })
		const stuff = screen.getByText(label)
		expect(stuff).toBeTruthy()
	})

	it("WHEN the node is irrelevant THEN it has the 'isIrrelevant' class", () => {
		const label = 'IED1'
		const node = createNode(label, false)

		render(IEDElement, { node })
		const stuff = screen.getByText(label)
		expect(stuff.classList.contains('isIrrelevant')).toBeTruthy()
	})

	it("WHEN selected THEN it has the 'selected' class", () => {
		const label = 'IED1'
		const node = createNode(label, true)

		render(IEDElement, { node, isIEDSelected: true })
		const stuff = screen.getByText(label)
		expect(stuff.classList.contains('selected')).toBeTruthy()
	})
})
