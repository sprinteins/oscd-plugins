import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { assignedLNodesStore } from '@/headless/stores/assigned-lnodes'
import { dndStore } from '@/headless/stores/dnd'
import type {
	LNodeTemplate,
	FunctionTemplate,
	BayTypeWithTemplates
} from '@/headless/common-types'
import type { XMLEditor } from '@openscd/oscd-editor'
import { buildEditsForIed } from '@/headless/stores/dnd/drop-handler'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { bayStore } from '@/headless/stores/bay.store.svelte'

// Mock modules
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

// Mock the entire drop-handler module to avoid real execution
vi.mock('@/headless/stores/dnd/drop-handler', () => ({
	getBayTypeApplicationState: vi.fn(() => ({
		hasAssignedBayType: false,
		hasSelectedBay: true,
		requiresManualMatching: false,
		hasValidAutoSelection: false,
		hasPendingManualSelection: false
	})),
	shouldApplyBayType: vi.fn(() => false),
	applyBayType: vi.fn(() => []),
	buildEditsForIed: vi.fn(() => []),
	createBayEdits: vi.fn(() => []),
	generateCommitTitle: vi.fn(() => 'Test Commit'),
	commitEdits: vi.fn()
}))

vi.mock('@/headless/stores/bay-types.store.svelte', () => ({
	bayTypesStore: {
		selectedBayType: null,
		bayTypes: []
	}
}))

vi.mock('@/headless/stores/bay.store.svelte', () => ({
	bayStore: {
		selectedBay: null,
		assigendBayType: null,
		pendingBayTypeApply: null,
		equipmentMatches: [],
		scdBay: null
	}
}))

vi.mock('@/headless/stores/equipment-matching.store.svelte', () => ({
	equipmentMatchingStore: {
		validationResult: null
	}
}))

vi.mock('@/headless/stores/ssd-import.store.svelte', () => ({
	ssdImportStore: {
		bayTypes: []
	}
}))

describe('Integration: Assigned LNodes Flow', () => {
	let mockDocument: Document
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let accessPoint: Element
	let lnode1: LNodeTemplate
	let lnode2: LNodeTemplate
	let lnode3: LNodeTemplate
	let functionTemplate: FunctionTemplate
	let funcUuid: string
	let funcUuid2: string

	beforeEach(() => {
		// Create SCD with Bay structure and IED structure
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation name="Sub1">
					<VoltageLevel name="VL1">
						<Bay name="Bay1">
							<Function name="TestFunction" templateUuid="func-uuid-1">
								<LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="ExistingIED" ldInst="LD1" />
							</Function>
							<Function name="AnotherFunction" templateUuid="func-uuid-2">
							</Function>
						</Bay>
					</VoltageLevel>
				</Substation>
				<IED name="ExistingIED">
					<AccessPoint name="AP1">
						<Server>
							<LDevice inst="LD1">
								<LN lnClass="XCBR" lnType="TestXCBR" lnInst="1" />
							</LDevice>
						</Server>
					</AccessPoint>
				</IED>
				<IED name="NewIED">
					<AccessPoint name="AP1">
					</AccessPoint>
				</IED>
			</SCL>`,
			'application/xml'
		)

		mockEditor = {
			commit: vi.fn()
		}

		pluginGlobalStore.xmlDocument = mockDocument
		pluginGlobalStore.editor = mockEditor as unknown as XMLEditor

		// Set up bayStore.scdBay to point to the Bay element in the mock document
		const bayElement = mockDocument.querySelector('Bay')
		bayStore.scdBay = bayElement as Element

		accessPoint = mockDocument.querySelector(
			'IED[name="NewIED"] AccessPoint[name="AP1"]'
		) as Element

		funcUuid = 'func-uuid-1'
		funcUuid2 = 'func-uuid-2'

		lnode1 = {
			uuid: 'lnode1-uuid',
			lnClass: 'XCBR',
			lnType: 'TestXCBR',
			lnInst: '1'
		}

		lnode2 = {
			uuid: 'lnode2-uuid',
			lnClass: 'CSWI',
			lnType: 'TestCSWI',
			lnInst: '1'
		}

		lnode3 = {
			uuid: 'lnode3-uuid',
			lnClass: 'MMXU',
			lnType: 'TestMMXU',
			lnInst: '1'
		}

		functionTemplate = {
			uuid: funcUuid,
			name: 'TestFunction',
			desc: 'Test Function',
			lnodes: [lnode1, lnode2, lnode3]
		}

		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		dndStore.handleDragEnd()
	})

	describe('GIVEN a Bay with one assigned LNode in the document', () => {
		it('WHEN rebuild is called THEN already-assigned LNodes are identified correctly', () => {
			// WHEN
			assignedLNodesStore.rebuild()

			// THEN lnode1 exists in Bay structure with iedName → assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)

			// THEN lnode2 and lnode3 have no iedName → not assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)
		})

		it('WHEN rebuild is called THEN hasConnections returns true', () => {
			// WHEN
			assignedLNodesStore.rebuild()

			// THEN
			expect(assignedLNodesStore.hasConnections).toBe(true)
		})
	})

	describe('GIVEN no scdBay is set', () => {
		beforeEach(() => {
			bayStore.scdBay = null
		})

		it('WHEN rebuild is called THEN no LNodes are assigned and hasConnections is false', () => {
			// WHEN
			assignedLNodesStore.rebuild()

			// THEN
			expect(assignedLNodesStore.hasConnections).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)
		})

		it('WHEN rebuild is called THEN it does not throw', () => {
			// WHEN / THEN
			expect(() => assignedLNodesStore.rebuild()).not.toThrow()
		})
	})

	describe('GIVEN an empty SCL document', () => {
		beforeEach(() => {
			const emptyDoc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = emptyDoc
			bayStore.scdBay = null
		})

		it('WHEN rebuild is called THEN no LNodes are assigned and it does not throw', () => {
			// WHEN / THEN
			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)
		})
	})

	describe('GIVEN xmlDocument is undefined', () => {
		beforeEach(() => {
			pluginGlobalStore.xmlDocument = undefined
			bayStore.scdBay = null
		})

		it('WHEN rebuild is called THEN no LNodes are assigned and it does not throw', () => {
			// WHEN / THEN
			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(false)
		})
	})

	describe('GIVEN a drag-and-drop flow with edits produced', () => {
		beforeEach(() => {
			// Mock buildEditsForIed to return a non-empty array so commitEdits is called
			vi.mocked(buildEditsForIed).mockReturnValue([
				{
					type: 'insert',
					node: {},
					parent: accessPoint,
					reference: null
					// biome-ignore lint/suspicious/noExplicitAny: mock data
				} as any
			])

			assignedLNodesStore.rebuild()
		})

		it('WHEN unassigned LNodes are dropped THEN they are marked as assigned', () => {
			// Initial state – only lnode1 is assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)

			// WHEN
			dndStore.handleDragStart({
				type: 'functionTemplate',
				sourceFunction: functionTemplate,
				lNodes: [lnode2, lnode3]
			})
			dndStore.handleDrop(accessPoint, 'NewIED')

			// THEN lnode2 and lnode3 are now assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(true)

			// AND previously assigned lnode1 remains assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
		})

		it('WHEN mixed assigned/unassigned LNodes are dropped THEN all are marked as assigned', () => {
			// lnode1 is already assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// WHEN
			dndStore.handleDragStart({
				type: 'functionTemplate',
				sourceFunction: functionTemplate,
				lNodes: [lnode1, lnode2]
			})
			dndStore.handleDrop(accessPoint, 'NewIED')

			// THEN
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)
		})

		it('WHEN a drop occurs THEN markAsAssigned is used instead of a full rebuild', () => {
			const rebuildSpy = vi.spyOn(assignedLNodesStore, 'rebuild')
			const markAsAssignedSpy = vi.spyOn(assignedLNodesStore, 'markAsAssigned')

			// WHEN
			dndStore.handleDragStart({
				type: 'lNode',
				sourceFunction: functionTemplate,
				lNodes: [lnode2]
			})
			dndStore.handleDrop(accessPoint, 'NewIED')

			// THEN incremental update path is taken
			expect(markAsAssignedSpy).toHaveBeenCalledTimes(1)
			expect(rebuildSpy).not.toHaveBeenCalled()
		})
	})

	describe('GIVEN a drag that ends without a drop', () => {
		it('WHEN handleDragEnd is called THEN the assigned state does not change', () => {
			assignedLNodesStore.rebuild()

			const stateBefore = assignedLNodesStore.isAssigned(funcUuid, lnode2)

			// WHEN
			dndStore.handleDragStart({
				type: 'lNode',
				sourceFunction: functionTemplate,
				lNodes: [lnode2]
			})
			dndStore.handleDragEnd()

			// THEN
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(stateBefore)
		})
	})

	describe('GIVEN LNodes manually marked then document rebuilt', () => {
		it('WHEN rebuild is called THEN manually marked LNodes absent from the document are cleared', () => {
			assignedLNodesStore.rebuild()

			// Mark lnode2 manually
			assignedLNodesStore.markAsAssigned(funcUuid, [lnode2])
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)

			// WHEN rebuild re-reads document (lnode2 not in Bay structure)
			assignedLNodesStore.rebuild()

			// THEN lnode2 is gone
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// AND document-backed lnode1 is still assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
		})

		it('WHEN a LNode is added to the Bay structure and rebuild is called THEN it becomes assigned', () => {
			assignedLNodesStore.rebuild()
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// Manually add lnode2 to the document's Bay structure
			const func = mockDocument.querySelector('Function[templateUuid="func-uuid-1"]')
			const newLN = mockDocument.createElement('LNode')
			newLN.setAttribute('lnClass', 'CSWI')
			newLN.setAttribute('lnType', 'TestCSWI')
			newLN.setAttribute('lnInst', '1')
			newLN.setAttribute('iedName', 'NewIED')
			newLN.setAttribute('ldInst', 'LD2')
			func?.appendChild(newLN)

			// WHEN
			assignedLNodesStore.rebuild()

			// THEN
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)
		})
	})

	describe('GIVEN multiple Function elements in the Bay', () => {
		it('WHEN rebuild is called THEN LNodes are tracked per-function and not cross-contaminated', () => {
			// Add lnode2 to funcUuid2 in the document
			const func2 = mockDocument.querySelector('Function[templateUuid="func-uuid-2"]')
			const ln2 = mockDocument.createElement('LNode')
			ln2.setAttribute('lnClass', 'CSWI')
			ln2.setAttribute('lnType', 'TestCSWI')
			ln2.setAttribute('lnInst', '1')
			ln2.setAttribute('iedName', 'NewIED')
			ln2.setAttribute('ldInst', 'LD2')
			func2?.appendChild(ln2)

			bayStore.scdBay = mockDocument.querySelector('Bay') as Element

			// WHEN
			assignedLNodesStore.rebuild()

			// THEN lnode1 is assigned under funcUuid
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)

			// THEN lnode2 is assigned under funcUuid2 only
			expect(assignedLNodesStore.isAssigned(funcUuid2, lnode2)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// THEN lnode3 is not assigned anywhere
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid2, lnode3)).toBe(false)
		})
	})

	describe('GIVEN a BayTypeWithTemplates where all LNodes are assigned', () => {
		it('WHEN areAllLNodesAssigned is called THEN it returns true', () => {
			assignedLNodesStore.rebuild()
			// Mark lnode1 as assigned (it already is from rebuild)
			// Build a minimal BayTypeWithTemplates with one function containing lnode1
			const bayTypeWithTemplates: BayTypeWithTemplates = {
				uuid: 'bt-uuid',
				name: 'TestBayType',
				conductingEquipments: [],
				functions: [{ uuid: funcUuid, templateUuid: funcUuid }],
				conductingEquipmentTemplates: [],
				functionTemplates: [
					{ uuid: funcUuid, name: 'TestFunction', desc: '', lnodes: [lnode1] }
				],
				conductingEquipmentTemplateMap: new Map(),
				functionTemplateMap: new Map([
					[funcUuid, { uuid: funcUuid, name: 'TestFunction', desc: '', lnodes: [lnode1] }]
				])
			}

			// WHEN
			const result = assignedLNodesStore.areAllLNodesAssigned(bayTypeWithTemplates)

			// THEN
			expect(result).toBe(true)
		})

		it('WHEN areAllLNodesAssigned is called and some LNodes are not assigned THEN it returns false', () => {
			assignedLNodesStore.rebuild()

			// lnode2 is not assigned
			const bayTypeWithTemplates: BayTypeWithTemplates = {
				uuid: 'bt-uuid',
				name: 'TestBayType',
				conductingEquipments: [],
				functions: [{ uuid: funcUuid, templateUuid: funcUuid }],
				conductingEquipmentTemplates: [],
				functionTemplates: [
					{
						uuid: funcUuid,
						name: 'TestFunction',
						desc: '',
						lnodes: [lnode1, lnode2]
					}
				],
				conductingEquipmentTemplateMap: new Map(),
				functionTemplateMap: new Map([
					[
						funcUuid,
						{
							uuid: funcUuid,
							name: 'TestFunction',
							desc: '',
							lnodes: [lnode1, lnode2]
						}
					]
				])
			}

			// WHEN
			const result = assignedLNodesStore.areAllLNodesAssigned(bayTypeWithTemplates)

			// THEN
			expect(result).toBe(false)
		})
	})
})
