import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildUpdatesForRenameIed } from './ied-rename-edits'

function makeIed(name: string, lDeviceInsts: string[] = []): Element {
	const ied = document.createElement('IED')
	ied.setAttribute('name', name)
	const ap = document.createElement('AccessPoint')
	const server = document.createElement('Server')
	ap.appendChild(server)
	for (const inst of lDeviceInsts) {
		const ld = document.createElement('LDevice')
		ld.setAttribute('inst', inst)
		ld.setAttribute('ldName', `${name}_${inst}`)
		server.appendChild(ld)
	}
	ied.appendChild(ap)
	return ied
}

function makeBay(iedName: string, lNodeCount: number): Element {
	const bay = document.createElement('Bay')
	for (let i = 0; i < lNodeCount; i++) {
		const lNode = document.createElement('LNode')
		lNode.setAttribute('iedName', iedName)
		lNode.setAttribute('ldInst', `LD${i}`)
		bay.appendChild(lNode)
	}
	return bay
}

describe('buildUpdatesForRenameIed', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('GIVEN an IED with no LDevices and no bay', () => {
		let ied: Element

		beforeEach(() => {
			ied = makeIed('OLD_IED')
		})

		it('WHEN renamed THEN returns exactly one edit targeting the IED element', () => {
			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: 'New desc',
				selectedBay: null
			})

			expect(edits).toHaveLength(1)
			expect(edits[0].element).toBe(ied)
		})

		it('WHEN renamed THEN sets the new name attribute', () => {
			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: '',
				selectedBay: null
			})

			expect(edits[0].attributes?.name).toBe('NEW_IED')
		})

		it('WHEN renamed with a description THEN sets the desc attribute', () => {
			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: 'My description',
				selectedBay: null
			})

			expect(edits[0].attributes?.desc).toBe('My description')
		})

		it('WHEN renamed with an empty description THEN sets desc to null', () => {
			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: '',
				selectedBay: null
			})

			expect(edits[0].attributes?.desc).toBeNull()
		})
	})

	describe('GIVEN an IED with two LDevices and no bay', () => {
		let ied: Element

		beforeEach(() => {
			ied = makeIed('OLD_IED', ['LD0_AP1', 'CTRL'])
		})

		it('WHEN renamed THEN returns one edit per LDevice plus the IED edit', () => {
			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: '',
				selectedBay: null
			})

			// 1 IED + 2 LDevice edits
			expect(edits).toHaveLength(3)
		})

		it('WHEN renamed THEN updates each LDevice ldName to use the new IED name', () => {
			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: '',
				selectedBay: null
			})

			const ldEdits = edits.slice(1)
			expect(ldEdits[0].attributes?.ldName).toBe('NEW_IED_LD0_AP1')
			expect(ldEdits[1].attributes?.ldName).toBe('NEW_IED_CTRL')
		})
	})

	describe('GIVEN a bay with LNodes referencing the IED', () => {
		let ied: Element
		let bay: Element

		beforeEach(() => {
			ied = makeIed('OLD_IED', ['LD0'])
			bay = makeBay('OLD_IED', 2)
		})

		it('WHEN renamed THEN returns edits for LNodes updating their iedName reference', () => {
			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: '',
				selectedBay: bay
			})

			// 1 IED + 1 LDevice + 2 LNode edits
			expect(edits).toHaveLength(4)
			const lNodeEdits = edits.slice(2)
			for (const edit of lNodeEdits) {
				expect(edit.attributes?.iedName).toBe('NEW_IED')
			}
		})

		it('WHEN renamed THEN does not touch LNodes belonging to a different IED', () => {
			// Add a LNode for a different IED in the same bay
			const otherLNode = document.createElement('LNode')
			otherLNode.setAttribute('iedName', 'OTHER_IED')
			bay.appendChild(otherLNode)

			const edits = buildUpdatesForRenameIed({
				iedElement: ied,
				oldName: 'OLD_IED',
				newName: 'NEW_IED',
				newDescription: '',
				selectedBay: bay
			})

			const editedElements = edits.map((e) => e.element)
			expect(editedElements).not.toContain(otherLNode)
		})
	})

	it('GIVEN no selected bay WHEN renamed THEN bay LNodes are not included in edits', () => {
		const ied = makeIed('OLD_IED')

		const edits = buildUpdatesForRenameIed({
			iedElement: ied,
			oldName: 'OLD_IED',
			newName: 'NEW_IED',
			newDescription: '',
			selectedBay: null
		})

		const lNodeEdits = edits.filter((e) => e.element.tagName === 'LNode')
		expect(lNodeEdits).toHaveLength(0)
	})
})
