import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createMultipleLNodesInAccessPoint } from './accesspoint-edits'
import type { XMLEditor } from '@openscd/oscd-editor'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { Insert } from '@openscd/oscd-api'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

describe('createMultipleLNodesInAccessPoint', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document
	let lnodeTemplate: LNodeTemplate
	let functionTemplate: FunctionTemplate
	let equipmentTemplate: ConductingEquipmentTemplate
	let accessPoint: Element

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="TestIED">
					<AccessPoint name="TestAP">
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

		lnodeTemplate = {
			uuid: 'lnode-uuid',
			lnClass: 'XCBR',
			lnType: 'TestLNType',
			lnInst: '1'
		}

		functionTemplate = {
			uuid: 'func-template-uuid',
			name: 'CBFunction',
			desc: 'Circuit Breaker Function',
			lnodes: [lnodeTemplate]
		}

		equipmentTemplate = {
			uuid: 'eq-template-uuid',
			name: 'CircuitBreaker1',
			type: 'CBR',
			desc: 'Test Circuit Breaker',
			terminals: [
				{
					uuid: 'term-uuid',
					name: 'Term1',
					connectivityNode: 'CN1',
					cNodeName: 'TestPath'
				}
			],
			eqFunctions: [functionTemplate]
		}

		accessPoint = mockDocument.querySelector(
			'AccessPoint[name="TestAP"]'
		) as Element

		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('with FunctionTemplate', () => {
		it('should create Server element if it does not exist', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Find the Server creation edit
			let serverCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'Server'
				) {
					serverCreated = true
					expect(edit.parent).toBe(accessPoint)
				}
			}
			expect(serverCreated).toBe(true)
		})

		it('should create LDevice with function name', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lDeviceCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LDevice'
				) {
					lDeviceCreated = true
					expect(edit.node.getAttribute('inst')).toBe('CBFunction')
				}
			}
			expect(lDeviceCreated).toBe(true)
		})

		it('should create LN elements for each lNode', () => {
			const lnode2 = {
				...lnodeTemplate,
				uuid: 'lnode2-uuid',
				lnInst: '2'
			}
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2],
				accessPoint
			})

			let lnCount = 0
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnCount++
				}
			}
			expect(lnCount).toBe(2)
		})

		it('should reuse existing Server', () => {
			// Create existing Server
			const server = mockDocument.createElement('Server')
			const auth = mockDocument.createElement('Authentication')
			auth.setAttribute('none', 'true')
			server.appendChild(auth)
			accessPoint.appendChild(server)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let serverCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'Server'
				) {
					serverCreated = true
				}
			}
			expect(serverCreated).toBe(false)
		})

		it('should reuse existing LDevice without creating new edit', () => {
			// Create existing Server and LDevice
			const server = mockDocument.createElement('Server')
			const auth = mockDocument.createElement('Authentication')
			auth.setAttribute('none', 'true')
			server.appendChild(auth)
			accessPoint.appendChild(server)

			const lDevice = mockDocument.createElement('LDevice')
			lDevice.setAttribute('inst', 'CBFunction')
			server.appendChild(lDevice)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Should not create LDevice edit since it already exists
			let lDeviceCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LDevice'
				) {
					lDeviceCreated = true
				}
			}
			expect(lDeviceCreated).toBe(false)

			// Should still create LN edit
			let lnCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnCreated = true
				}
			}
			expect(lnCreated).toBe(true)
		})
	})

	describe('with ConductingEquipmentTemplate', () => {
		it('should create LDevice with equipment name', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lDeviceCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LDevice'
				) {
					lDeviceCreated = true
					expect(edit.node.getAttribute('inst')).toBe(
						'CircuitBreaker1_CBFunction'
					)
				}
			}
			expect(lDeviceCreated).toBe(true)
		})

		it('should create LN elements for equipment lNodes', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lnCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnCreated = true
					expect(edit.node.getAttribute('lnClass')).toBe('XCBR')
					expect(edit.node.getAttribute('lnType')).toBe('TestLNType')
				}
			}
			expect(lnCreated).toBe(true)
		})
	})

	describe('LN element creation', () => {
		it('should create LN with correct attributes', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lnElement: Element | null = null
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnElement = edit.node
					break
				}
			}

			expect(lnElement).not.toBeNull()
			expect(lnElement?.getAttribute('lnClass')).toBe('XCBR')
			expect(lnElement?.getAttribute('lnType')).toBe('TestLNType')
			expect(lnElement?.getAttribute('lnInst')).toBe('1')
		})

		it('should create multiple LN elements with unique inst values', () => {
			const lnode2 = {
				...lnodeTemplate,
				uuid: 'lnode2-uuid',
				lnInst: '2'
			}
			const lnode3 = {
				...lnodeTemplate,
				uuid: 'lnode3-uuid',
				lnInst: '3'
			}

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2, lnode3],
				accessPoint
			})

			const lnInstances = new Set<string | null>()
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnInstances.add(edit.node.getAttribute('lnInst'))
				}
			}

			expect(lnInstances.size).toBe(3)
			expect(lnInstances.has('1')).toBe(true)
			expect(lnInstances.has('2')).toBe(true)
			expect(lnInstances.has('3')).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() =>
				createMultipleLNodesInAccessPoint({
					sourceFunction: functionTemplate,
					lNodes: [lnodeTemplate],
					accessPoint
				})
			).toThrow('No XML document found')
		})

		it('should return empty array when lNodes array is empty', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [],
				accessPoint
			})
			// Should return empty array
			expect(edits).toEqual([])
		})

		it('should create lNode even when same lNode exists in another IED', () => {
			// Create existing LNode in another IED
			const otherIED = mockDocument.createElement('IED')
			otherIED.setAttribute('name', 'OtherIED')
			const otherAP = mockDocument.createElement('AccessPoint')
			otherAP.setAttribute('name', 'OtherAP')
			otherIED.appendChild(otherAP)
			const otherServer = mockDocument.createElement('Server')
			otherAP.appendChild(otherServer)
			const otherLDevice = mockDocument.createElement('LDevice')
			otherLDevice.setAttribute('inst', 'TestLD')
			otherServer.appendChild(otherLDevice)
			const existingLN = mockDocument.createElement('LN')
			existingLN.setAttribute('lnClass', 'XCBR')
			existingLN.setAttribute('lnType', 'TestLNType')
			existingLN.setAttribute('lnInst', '1')
			otherLDevice.appendChild(existingLN)
			mockDocument.documentElement.appendChild(otherIED)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Should create edits since lNode uniqueness is scoped to LDevice, not entire document
			expect(edits.length).toBeGreaterThan(0)
			
			// Verify Server, LDevice, and LN are created
			let hasServer = false
			let hasLDevice = false
			let hasLN = false
			for (const edit of edits as Insert[]) {
				if (edit.node instanceof Element) {
					if (edit.node.localName === 'Server') hasServer = true
					if (edit.node.localName === 'LDevice') hasLDevice = true
					if (edit.node.localName === 'LN') hasLN = true
				}
			}
			expect(hasServer).toBe(true)
			expect(hasLDevice).toBe(true)
			expect(hasLN).toBe(true)
		})

		it('should return empty array when all lNodes already exist in same LDevice', () => {
			// Create existing Server and LDevice with the same LNode in target AccessPoint
			const server = mockDocument.createElement('Server')
			const auth = mockDocument.createElement('Authentication')
			auth.setAttribute('none', 'true')
			server.appendChild(auth)
			accessPoint.appendChild(server)

			const lDevice = mockDocument.createElement('LDevice')
			lDevice.setAttribute('inst', 'CBFunction')
			server.appendChild(lDevice)

			const existingLN = mockDocument.createElement('LN')
			existingLN.setAttribute('lnClass', 'XCBR')
			existingLN.setAttribute('lnType', 'TestLNType')
			existingLN.setAttribute('lnInst', '1')
			lDevice.appendChild(existingLN)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Should return empty array since lNode already exists in the same LDevice
			expect(edits).toEqual([])
		})
	})

	describe('authentication setup', () => {
		it('should create Server with Authentication element set to none=true', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'Server'
				) {
					const authElement =
						edit.node.querySelector('Authentication')
					expect(authElement).not.toBeNull()
					expect(authElement?.getAttribute('none')).toBe('true')
				}
			}
		})
	})
})
