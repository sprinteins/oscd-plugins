import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
	createAccessPoints,
	createMultipleLNodesInAccessPoint
} from './accesspoint-edits'
import type { XMLEditor } from '@openscd/oscd-editor'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { Insert } from '@openscd/oscd-api'
import type { EquipmentMatch } from '@/headless/matching'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

function collectEditsByTag(edits: Insert[], tagName: string): Element[] {
	return (edits as Insert[])
		.map((e) => e.node)
		.filter(
			(n): n is Element => n instanceof Element && n.localName === tagName
		)
}

function buildScl(): Document {
	return new DOMParser().parseFromString(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
			<IED name="TestIED">
				<AccessPoint name="TestAP"></AccessPoint>
			</IED>
		</SCL>`,
		'application/xml'
	)
}

function appendServerWithLDevice(
	doc: Document,
	accessPoint: Element,
	lDeviceInst: string
): { server: Element; lDevice: Element } {
	const server = doc.createElement('Server')
	const auth = doc.createElement('Authentication')
	auth.setAttribute('none', 'true')
	server.appendChild(auth)
	accessPoint.appendChild(server)

	const lDevice = doc.createElement('LDevice')
	lDevice.setAttribute('inst', lDeviceInst)
	server.appendChild(lDevice)
	return { server, lDevice }
}

const lnodeTemplate: LNodeTemplate = {
	uuid: 'lnode-uuid',
	lnClass: 'XCBR',
	lnType: 'TestLNType',
	lnInst: '1'
}

const functionTemplate: FunctionTemplate = {
	uuid: 'func-template-uuid',
	name: 'CBFunction',
	desc: 'Circuit Breaker Function',
	lnodes: [lnodeTemplate]
}

const equipmentTemplate: ConductingEquipmentTemplate = {
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

describe('createMultipleLNodesInAccessPoint', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document
	let accessPoint: Element

	beforeEach(() => {
		mockDocument = buildScl()
		pluginGlobalStore.xmlDocument = mockDocument
		pluginGlobalStore.editor = { commit: vi.fn() } as unknown as XMLEditor
		accessPoint = mockDocument.querySelector(
			'AccessPoint[name="TestAP"]'
		) as Element
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN xmlDocument is not set WHEN creating lNodes THEN throws "No XML document found"', () => {
		// GIVEN
		pluginGlobalStore.xmlDocument = undefined

		// WHEN / THEN
		expect(() =>
			createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})
		).toThrow('No XML document found')
	})

	it('GIVEN an empty lNodes array WHEN creating lNodes THEN returns empty array', () => {
		// WHEN
		const edits = createMultipleLNodesInAccessPoint({
			sourceFunction: functionTemplate,
			lNodes: [],
			accessPoint,
			equipmentMatches: []
		})

		// THEN
		expect(edits).toEqual([])
	})

	describe('GIVEN a fresh AccessPoint without Server or LDevice', () => {
		it('WHEN creating lNodes with FunctionTemplate THEN creates Server parented to AccessPoint', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			const servers = collectEditsByTag(edits, 'Server')
			expect(servers).toHaveLength(1)
			const serverEdit = (edits as Insert[]).find(
				(e) =>
					e.node instanceof Element &&
					(e.node as Element).localName === 'Server'
			)
			expect(serverEdit?.parent).toBe(accessPoint)
		})

		it('WHEN creating lNodes with FunctionTemplate THEN Server has Authentication none="true"', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			const [serverEl] = collectEditsByTag(edits, 'Server')
			const auth = serverEl?.querySelector('Authentication')
			expect(auth).not.toBeNull()
			expect(auth?.getAttribute('none')).toBe('true')
		})

		it('WHEN creating lNodes with FunctionTemplate THEN creates LDevice with inst=functionName', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			const [lDeviceEl] = collectEditsByTag(edits, 'LDevice')
			expect(lDeviceEl).toBeDefined()
			expect(lDeviceEl.getAttribute('inst')).toBe('CBFunction')
		})

		it('WHEN creating lNodes with ConductingEquipmentTemplate THEN LDevice inst is equipmentName_functionName', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			const [lDeviceEl] = collectEditsByTag(edits, 'LDevice')
			expect(lDeviceEl.getAttribute('inst')).toBe(
				'CircuitBreaker1_CBFunction'
			)
		})

		it('WHEN equipmentUuid matches an EquipmentMatch THEN LDevice inst uses the SCD element name', () => {
			const scdElement = mockDocument.createElement('ConductingEquipment')
			scdElement.setAttribute('name', 'ScdBreaker42')
			const match: EquipmentMatch = {
				bayTypeEquipment: {
					uuid: 'eq-template-uuid',
					templateUuid: 'eq-template-uuid',
					virtual: false
				},
				templateEquipment: equipmentTemplate,
				scdElement
			}

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentUuid: 'eq-template-uuid',
				equipmentMatches: [match]
			})

			const [lDeviceEl] = collectEditsByTag(edits, 'LDevice')
			expect(lDeviceEl.getAttribute('inst')).toBe(
				'ScdBreaker42_CBFunction'
			)
		})

		it('WHEN creating multiple lNodes THEN creates an LN edit for each', () => {
			const lnode2: LNodeTemplate = {
				...lnodeTemplate,
				uuid: 'lnode2-uuid',
				lnInst: '2'
			}
			const lnode3: LNodeTemplate = {
				...lnodeTemplate,
				uuid: 'lnode3-uuid',
				lnInst: '3'
			}

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2, lnode3],
				accessPoint,
				equipmentMatches: []
			})

			const lnElements = collectEditsByTag(edits, 'LN')
			expect(lnElements).toHaveLength(3)
		})

		it('WHEN creating lNodes THEN LN has correct lnClass / lnType / lnInst attributes', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			const [lnEl] = collectEditsByTag(edits, 'LN')
			expect(lnEl.getAttribute('lnClass')).toBe('XCBR')
			expect(lnEl.getAttribute('lnType')).toBe('TestLNType')
			expect(lnEl.getAttribute('lnInst')).toBe('1')
		})

		it('WHEN creating multiple lNodes THEN each LN has a unique lnInst', () => {
			const lnode2: LNodeTemplate = {
				...lnodeTemplate,
				uuid: 'lnode2-uuid',
				lnInst: '2'
			}

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2],
				accessPoint,
				equipmentMatches: []
			})

			const insts = collectEditsByTag(edits, 'LN').map((el) =>
				el.getAttribute('lnInst')
			)
			expect(new Set(insts).size).toBe(2)
		})

		it('WHEN lNode has lnClass LLN0 THEN creates an LN0 element instead of LN', () => {
			const lln0: LNodeTemplate = {
				uuid: 'lln0-uuid',
				lnClass: 'LLN0',
				lnType: 'LLN0Type',
				lnInst: '0'
			}

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lln0],
				accessPoint,
				equipmentMatches: []
			})

			const ln0s = collectEditsByTag(edits, 'LN0')
			const lns = collectEditsByTag(edits, 'LN')
			expect(ln0s).toHaveLength(1)
			expect(lns).toHaveLength(0)
			expect(ln0s[0].getAttribute('lnClass')).toBe('LLN0')
		})
	})

	it('GIVEN AccessPoint already has a Server WHEN creating lNodes THEN does not create an additional Server edit', () => {
		const server = mockDocument.createElement('Server')
		const auth = mockDocument.createElement('Authentication')
		auth.setAttribute('none', 'true')
		server.appendChild(auth)
		accessPoint.appendChild(server)

		const edits = createMultipleLNodesInAccessPoint({
			sourceFunction: functionTemplate,
			lNodes: [lnodeTemplate],
			accessPoint,
			equipmentMatches: []
		})

		expect(collectEditsByTag(edits, 'Server')).toHaveLength(0)
	})

	describe('GIVEN Server and matching LDevice already exist', () => {
		beforeEach(() => {
			appendServerWithLDevice(mockDocument, accessPoint, 'CBFunction')
		})

		it('WHEN creating lNodes THEN does not create LDevice or Server edits', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			expect(collectEditsByTag(edits, 'Server')).toHaveLength(0)
			expect(collectEditsByTag(edits, 'LDevice')).toHaveLength(0)
		})

		it('WHEN creating lNodes THEN still creates LN edits', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			expect(collectEditsByTag(edits, 'LN')).toHaveLength(1)
		})
	})

	describe('GIVEN all target lNodes already exist in the LDevice', () => {
		beforeEach(() => {
			const { lDevice } = appendServerWithLDevice(
				mockDocument,
				accessPoint,
				'CBFunction'
			)
			const ln = mockDocument.createElement('LN')
			ln.setAttribute('lnClass', 'XCBR')
			ln.setAttribute('lnType', 'TestLNType')
			ln.setAttribute('lnInst', '1')
			lDevice.appendChild(ln)
		})

		it('WHEN creating lNodes THEN returns empty array (no edits at all)', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

			expect(edits).toEqual([])
		})
	})

	describe('GIVEN some lNodes already exist in the LDevice and some do not', () => {
		let lnode2: LNodeTemplate

		beforeEach(() => {
			lnode2 = { ...lnodeTemplate, uuid: 'lnode2-uuid', lnInst: '2' }

			const { lDevice } = appendServerWithLDevice(
				mockDocument,
				accessPoint,
				'CBFunction'
			)
			const existingLN = mockDocument.createElement('LN')
			existingLN.setAttribute('lnClass', 'XCBR')
			existingLN.setAttribute('lnType', 'TestLNType')
			existingLN.setAttribute('lnInst', '1')
			lDevice.appendChild(existingLN)
		})

		it('WHEN creating both lNodes THEN only adds the missing lNode', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2],
				accessPoint,
				equipmentMatches: []
			})

			const lnEls = collectEditsByTag(edits, 'LN')
			expect(lnEls).toHaveLength(1)
			expect(lnEls[0].getAttribute('lnInst')).toBe('2')
		})

		it('WHEN adding missing lNode THEN does not emit Server or LDevice edits', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2],
				accessPoint,
				equipmentMatches: []
			})

			expect(collectEditsByTag(edits, 'Server')).toHaveLength(0)
			expect(collectEditsByTag(edits, 'LDevice')).toHaveLength(0)
		})
	})

	describe('GIVEN identical lNode exists only in a different IED', () => {
		beforeEach(() => {
			// Build a second IED that already has the same LN in a different LDevice
			const otherIED = mockDocument.createElement('IED')
			otherIED.setAttribute('name', 'OtherIED')
			const otherAP = mockDocument.createElement('AccessPoint')
			otherAP.setAttribute('name', 'OtherAP')
			otherIED.appendChild(otherAP)
			const otherServer = mockDocument.createElement('Server')
			otherAP.appendChild(otherServer)
			const otherLDevice = mockDocument.createElement('LDevice')
			otherLDevice.setAttribute('inst', 'CBFunction')
			otherServer.appendChild(otherLDevice)
			const existingLN = mockDocument.createElement('LN')
			existingLN.setAttribute('lnClass', 'XCBR')
			existingLN.setAttribute('lnType', 'TestLNType')
			existingLN.setAttribute('lnInst', '1')
			otherLDevice.appendChild(existingLN)
			mockDocument.documentElement.appendChild(otherIED)
		})

		it('WHEN creating lNodes in target AccessPoint THEN creates Server, LDevice and LN (uniqueness is LDevice-scoped)', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint,
				equipmentMatches: []
			})

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
				accessPoint,
				equipmentMatches: []
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
				accessPoint,
				equipmentMatches: []
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
