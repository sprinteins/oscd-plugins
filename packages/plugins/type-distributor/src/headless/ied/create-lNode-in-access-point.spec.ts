import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createLNodesInAccessPoint } from './create-lNode-in-access-point'
import type { XMLEditor } from '@openscd/oscd-editor'
import type { ConductingEquipmentTemplate, FunctionTemplate, LNodeTemplate } from '../types'
import type { Insert } from '@openscd/oscd-api'

// Mock modules
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')

describe('createLNodesInAccessPoint', () => {
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

		accessPoint = mockDocument.querySelector('AccessPoint[name="TestAP"]') as Element

		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('with FunctionTemplate', () => {
		it('should create Server element if it does not exist', () => {
			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			expect(mockEditor.commit).toHaveBeenCalled()
			const calls = mockEditor.commit.mock.calls
			
			// Find the Server creation edit
			let serverCreated = false
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'Server') {
					serverCreated = true
					expect(edit.parent).toBe(accessPoint)
				}
			}
			expect(serverCreated).toBe(true)
		})

		it('should create LDevice with function name', () => {
			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			let lDeviceCreated = false
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'LDevice') {
					lDeviceCreated = true
					expect(edit.node.getAttribute('inst')).toBe('CBFunction')
				}
			}
			expect(lDeviceCreated).toBe(true)
		})

		it('should create LN elements for each lNode', () => {
			const lnode2 = { ...lnodeTemplate, uuid: 'lnode2-uuid', lnInst: '2' }
			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			let lnCount = 0
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'LN') {
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

			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			let serverCreated = false
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'Server') {
					serverCreated = true
				}
			}
			expect(serverCreated).toBe(true)
		})

		it('should reuse existing LDevice', () => {
			// Create existing Server and LDevice
			const server = mockDocument.createElement('Server')
			const auth = mockDocument.createElement('Authentication')
			auth.setAttribute('none', 'true')
			server.appendChild(auth)
			accessPoint.appendChild(server)

			const lDevice = mockDocument.createElement('LDevice')
			lDevice.setAttribute('inst', 'CBFunction')
			server.appendChild(lDevice)

			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			let lDeviceCreated = false
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'LDevice') {
					lDeviceCreated = true
				}
			}
			expect(lDeviceCreated).toBe(true)
		})
	})

	describe('with ConductingEquipmentTemplate', () => {
		it('should create LDevice with equipment name', () => {
			createLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			let lDeviceCreated = false
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'LDevice') {
					lDeviceCreated = true
					expect(edit.node.getAttribute('inst')).toBe('CircuitBreaker1_CBFunction')
				}
			}
			expect(lDeviceCreated).toBe(true)
		})

		it('should create LN elements for equipment lNodes', () => {
			createLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			let lnCreated = false
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'LN') {
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
			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			let lnElement: Element | null = null
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'LN') {
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
			const lnode2 = { ...lnodeTemplate, uuid: 'lnode2-uuid', lnInst: '2' }
			const lnode3 = { ...lnodeTemplate, uuid: 'lnode3-uuid', lnInst: '3' }

			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2, lnode3],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			const lnInstances = new Set<string | null>()
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'LN') {
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
				createLNodesInAccessPoint({
					sourceFunction: functionTemplate,
					lNodes: [lnodeTemplate],
					iedName: 'TestIED',
					accessPoint
				})
			).toThrow('No XML document found')
		})

		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() =>
				createLNodesInAccessPoint({
					sourceFunction: functionTemplate,
					lNodes: [lnodeTemplate],
					iedName: 'TestIED',
					accessPoint
				})
			).toThrow('No editor found')
		})

		it('should handle empty lNodes array gracefully', () => {
			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			// Should still create Server and LDevice
			let serverCreated = false
			let lDeviceCreated = false
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'Server') {
					serverCreated = true
				}
				if (edit.node instanceof Element && edit.node.localName === 'LDevice') {
					lDeviceCreated = true
				}
			}

			expect(serverCreated).toBe(true)
			expect(lDeviceCreated).toBe(true)
		})
	})

	describe('authentication setup', () => {
		it('should create Server with Authentication element set to none=true', () => {
			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls
			
			for (const call of calls) {
				const edit = call[0] as Insert
				if (edit.node instanceof Element && edit.node.localName === 'Server') {
					const authElement = edit.node.querySelector('Authentication')
					expect(authElement).not.toBeNull()
					expect(authElement?.getAttribute('none')).toBe('true')
				}
			}
		})
	})

	describe('editor commit calls', () => {
		it('should call editor.commit with appropriate titles', () => {
			createLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				iedName: 'TestIED',
				accessPoint
			})

			const calls = mockEditor.commit.mock.calls

			expect(calls.length).toBeGreaterThanOrEqual(3) // At least Server, LDevice, and LN

			const titles = calls.map((call) => call[1]?.title)
			expect(titles).toContain('Add Server element')
			expect(titles.some((t) => t?.includes('Add LDevice'))).toBe(true)
			expect(titles.some((t) => t?.includes('Add LN'))).toBe(true)
		})
	})
})
