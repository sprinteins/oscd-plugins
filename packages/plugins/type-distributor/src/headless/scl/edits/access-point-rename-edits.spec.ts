import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildUpdatesForRenameAccessPoint } from './access-point-rename-edits'

function makeAccessPoint(apName: string, ld0Inst?: string): Element {
	const ldXml = ld0Inst ? `<LDevice inst="${ld0Inst}"/>` : ''
	const xml = `<AccessPoint name="${apName}"><Server>${ldXml}</Server></AccessPoint>`
	return new DOMParser().parseFromString(xml, 'application/xml')
		.documentElement
}

describe('buildUpdatesForRenameAccessPoint', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('GIVEN an AccessPoint with no LD0 LDevice', () => {
		let accessPoint: Element

		beforeEach(() => {
			accessPoint = makeAccessPoint('AP1')
		})

		it('WHEN renamed THEN returns exactly one edit targeting the AccessPoint element', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: ''
			})

			expect(edits).toHaveLength(1)
			expect(edits[0].element).toBe(accessPoint)
		})

		it('WHEN renamed THEN updates the name attribute', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP_NEW',
				newDescription: ''
			})

			expect(edits[0].attributes?.name).toBe('AP_NEW')
		})

		it('WHEN renamed with a description THEN sets the desc attribute', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: 'My AP'
			})

			expect(edits[0].attributes?.desc).toBe('My AP')
		})

		it('WHEN renamed with an empty description THEN sets desc to null', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: ''
			})

			expect(edits[0].attributes?.desc).toBeNull()
		})
	})

	describe('GIVEN an AccessPoint with a matching LD0 LDevice', () => {
		let accessPoint: Element

		beforeEach(() => {
			// LD0 inst follows naming convention: LD0_<oldApName>
			accessPoint = makeAccessPoint('AP1', 'LD0_AP1')
		})

		it('WHEN renamed THEN returns two edits (AccessPoint + LD0)', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: ''
			})

			expect(edits).toHaveLength(2)
		})

		it('WHEN renamed THEN updates LD0 inst to new naming convention', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: ''
			})

			expect(edits[1].attributes?.inst).toBe('LD0_AP2')
		})

		it('WHEN renamed THEN updates LD0 ldName to IED_IEDName_LD0_NewApName format', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: ''
			})

			expect(edits[1].attributes?.ldName).toBe('IED_A_LD0_AP2')
		})

		it('WHEN renamed THEN the LD0 edit targets the correct element', () => {
			const ld0 = accessPoint.querySelector(
				'Server > LDevice[inst="LD0_AP1"]'
			)
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: ''
			})

			expect(edits[1].element).toBe(ld0)
		})
	})

	describe('GIVEN an AccessPoint with an LD0 whose inst does NOT match the old AP name', () => {
		let accessPoint: Element

		beforeEach(() => {
			// inst uses a different naming convention — should not be updated
			accessPoint = makeAccessPoint('AP1', 'LD0_OTHER')
		})

		it('WHEN renamed THEN returns only the AccessPoint edit (no LD0 edit)', () => {
			const edits = buildUpdatesForRenameAccessPoint({
				accessPoint,
				iedName: 'IED_A',
				oldName: 'AP1',
				newName: 'AP2',
				newDescription: ''
			})

			expect(edits).toHaveLength(1)
		})
	})
})
