import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { bayStore } from './bay.store.svelte'
import type { XMLEditor } from '@openscd/oscd-editor'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

describe('bayStore', () => {
	let mockDocument: Document
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		// Reset bay store state
		bayStore.selectedBay = null
		bayStore.selectedBayUuid = null
		bayStore.assignedBayTypeUuid = null
		bayStore.pendingBayTypeApply = null
		bayStore.equipmentMatches = []

		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation>
					<VoltageLevel>
						<Bay name="TestBay1">
							<Function name="TestFunc"/>
						</Bay>
						<Bay name="TestBay2"/>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		mockEditor = {
			commit: vi.fn()
		}

		pluginGlobalStore.xmlDocument = mockDocument
		pluginGlobalStore.editor = mockEditor as unknown as XMLEditor
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('state management', () => {
		it('GIVEN initial state WHEN store is accessed THEN should have null values', () => {
			// GIVEN initial state
			const store = bayStore

			// WHEN store is accessed
			const {
				selectedBay,
				selectedBayUuid,
				assignedBayTypeUuid,
				pendingBayTypeApply,
				equipmentMatches
			} = store

			// THEN should have null values
			expect(selectedBay).toBeNull()
			expect(selectedBayUuid).toBeNull()
			expect(assignedBayTypeUuid).toBeNull()
			expect(pendingBayTypeApply).toBeNull()
			expect(equipmentMatches).toEqual([])
		})

		it('GIVEN a bay name WHEN selectedBay is set THEN should update selectedBay state', () => {
			// GIVEN a bay name
			const bayName = 'TestBay1'

			// WHEN selectedBay is set
			bayStore.selectedBay = bayName

			// THEN should update selectedBay state
			expect(bayStore.selectedBay).toBe(bayName)
		})

		it('GIVEN a bay UUID WHEN selectedBayUuid is set THEN should update selectedBayUuid state', () => {
			// GIVEN a bay UUID
			const bayUuid = 'test-bay-uuid'

			// WHEN selectedBayUuid is set
			bayStore.selectedBayUuid = bayUuid

			// THEN should update selectedBayUuid state
			expect(bayStore.selectedBayUuid).toBe(bayUuid)
		})

		it('GIVEN a bay type WHEN assignedBayTypeUuid is set THEN should update assignedBayTypeUuid state', () => {
			// GIVEN a bay type
			const bayType = 'test-bay-type'

			// WHEN assignedBayTypeUuid is set
			bayStore.assignedBayTypeUuid = bayType

			// THEN should update assignedBayTypeUuid state
			expect(bayStore.assignedBayTypeUuid).toBe(bayType)
		})

		it('GIVEN a pending bay type WHEN pendingBayTypeApply is set THEN should update pendingBayTypeApply state', () => {
			// GIVEN a pending bay type
			const pendingType = 'pending-bay-type'

			// WHEN pendingBayTypeApply is set
			bayStore.pendingBayTypeApply = pendingType

			// THEN should update pendingBayTypeApply state
			expect(bayStore.pendingBayTypeApply).toBe(pendingType)
		})

		it('GIVEN equipment matches WHEN equipmentMatches is set THEN should update equipmentMatches state', () => {
			// GIVEN equipment matches
			const matches = [
				{
					scdElement: document.createElement('ConductingEquipment'),
					bayTypeEquipment: {
						uuid: 'eq-uuid',
						templateUuid: 'template-uuid',
						virtual: false
					},
					templateEquipment: {
						uuid: 'template-uuid',
						name: 'TestEquipment',
						type: 'CBR',
						terminals: [],
						eqFunctions: []
					}
				}
			]

			// WHEN equipmentMatches is set
			bayStore.equipmentMatches = matches

			// THEN should update equipmentMatches state
			expect(bayStore.equipmentMatches).toStrictEqual(matches)
			expect(bayStore.equipmentMatches.length).toBe(1)
		})
	})

	describe('scdBay derived state', () => {
		it('GIVEN no selected bay WHEN scdBay is accessed THEN should return null', () => {
			// GIVEN no selected bay
			bayStore.selectedBay = null

			// WHEN scdBay is accessed
			const result = bayStore.scdBay

			// THEN should return null
			expect(result).toBeNull()
		})

		it('GIVEN selected bay exists in document WHEN scdBay is accessed THEN should return bay element', () => {
			// GIVEN selected bay exists in document
			bayStore.selectedBay = 'TestBay1'

			// WHEN scdBay is accessed
			const result = bayStore.scdBay

			// THEN should return bay element
			expect(result).toBeDefined()
			expect(result?.tagName).toBe('Bay')
			expect(result?.getAttribute('name')).toBe('TestBay1')
		})

		it('GIVEN selected bay does not exist in document WHEN scdBay is accessed THEN should return null', () => {
			// GIVEN selected bay does not exist in document
			bayStore.selectedBay = 'NonExistentBay'

			// WHEN scdBay is accessed
			const result = bayStore.scdBay

			// THEN should return null
			expect(result).toBeNull()
		})

		it('GIVEN no document loaded WHEN scdBay is accessed THEN should return null', () => {
			// GIVEN no document loaded
			bayStore.selectedBay = 'TestBay1'
			pluginGlobalStore.xmlDocument = undefined

			// WHEN scdBay is accessed
			const result = bayStore.scdBay

			// THEN should return null
			expect(result).toBeNull()
		})

		it('GIVEN no editor available WHEN scdBay is accessed THEN should return null', () => {
			// GIVEN no editor available
			bayStore.selectedBay = 'TestBay1'
			pluginGlobalStore.editor = undefined

			// WHEN scdBay is accessed
			const result = bayStore.scdBay

			// THEN should return null
			expect(result).toBeNull()
		})

		it('GIVEN selected bay changes WHEN scdBay is accessed THEN should return updated bay element', () => {
			// GIVEN selected bay changes
			bayStore.selectedBay = 'TestBay1'
			const firstBay = bayStore.scdBay

			// WHEN selected bay changes
			bayStore.selectedBay = 'TestBay2'
			const secondBay = bayStore.scdBay

			// THEN should return updated bay element
			expect(firstBay?.getAttribute('name')).toBe('TestBay1')
			expect(secondBay?.getAttribute('name')).toBe('TestBay2')
			expect(firstBay).not.toBe(secondBay)
		})
	})
})
