import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createAccessPoints, createMultipleLNodesInAccessPoint } from './accesspoint-edits'
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

describe('createAccessPoints', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><IED name="TestIED"></IED></SCL>',
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

	describe('Functionality Tests', () => {
		it('should create an AccessPoint element with correct structure', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const parent = edit.parent as Element

			expect(accessPointElement.tagName).toBe('AccessPoint')
			expect(parent.getAttribute('name')).toBe('TestIED')
		})

		it('should set the name attribute of AccessPoint', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('name')).toBe('AP1')
		})

		it('should set the desc attribute of AccessPoint when description is provided', () => {
			const accessPoints = [
				{ name: 'AP1', description: 'Access Point 1' }
			]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('desc')).toBe(
				'Access Point 1'
			)
		})

		it('should not set desc attribute when description is not provided', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.hasAttribute('desc')).toBe(false)
		})

		it('should create multiple AccessPoint elements when multiple accessPoints are provided', () => {
			const accessPoints = [{ name: 'AP1' }, { name: 'AP2' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			expect(mockEditor.commit).toHaveBeenCalledTimes(2)

			const edit1 = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPoint1 = edit1.node as Element

			const edit2 = mockEditor.commit.mock.calls[1][0] as Insert
			const accessPoint2 = edit2.node as Element

			expect(accessPoint1.getAttribute('name')).toBe('AP1')
			expect(accessPoint2.getAttribute('name')).toBe('AP2')
		})

		it('should have a Server child element within AccessPoint', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const serverElements =
				accessPointElement.getElementsByTagName('Server')

			expect(serverElements.length).toBe(1)
		})

		it('should have an Authentication child element within Server with the attribut none="true"', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const serverElements =
				accessPointElement.getElementsByTagName('Server')
			const authenticationElements =
				serverElements[0].getElementsByTagName('Authentication')

			expect(authenticationElements.length).toBe(1)
			expect(authenticationElements[0].getAttribute('none')).toBe('true')
		})
	})

	describe('error handling', () => {
		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() =>
				createAccessPoints({
					iedName: 'TestIED',
					accessPoints: [{ name: 'AP1' }]
				})
			).toThrow('No XML document loaded')
		})

		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() =>
				createAccessPoints({
					iedName: 'TestIED',
					accessPoints: [{ name: 'AP1' }]
				})
			).toThrow('No editor available')
		})

		it('should throw error when IED with given name is not found', () => {
			expect(() =>
				createAccessPoints({
					iedName: 'NonExistentIED',
					accessPoints: [{ name: 'AP1' }]
				})
			).toThrow('IED with name "NonExistentIED" not found')
		})
	})

	describe('edge cases', () => {
		it('should handle empty accessPoints array', () => {
			createAccessPoints({ iedName: 'TestIED', accessPoints: [] })

			expect(mockEditor.commit).not.toHaveBeenCalled()
		})

		it('should handle special characters in access point name', () => {
			const specialName = 'AP-1_test.abc'
			createAccessPoints({
				iedName: 'TestIED',
				accessPoints: [{ name: specialName }]
			})

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('name')).toBe(specialName)
		})

		it('should handle special characters in description', () => {
			const specialDesc = 'Access <>&" Point'
			createAccessPoints({
				iedName: 'TestIED',
				accessPoints: [{ name: 'AP1', description: specialDesc }]
			})

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('desc')).toBe(specialDesc)
		})
	})
})
