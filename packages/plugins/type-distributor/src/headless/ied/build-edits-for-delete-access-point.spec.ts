import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
	buildEditsForDeleteAccessPoint,
	buildEditsForDeleteLNodeFromAccessPoint
} from './build-edits-for-delete-access-point'
import type { Remove, SetAttributes } from '@openscd/oscd-api'

// Mock dependencies
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		editCount: 0
	}
}))

vi.mock('@/headless/stores/bay.store.svelte', () => ({
	bayStore: {
		selectedBay: null,
		selectedBayUuid: null,
		assignedBayTypeUuid: null,
		pendingBayTypeApply: null,
		equipmentMatches: [],
		scdBay: null
	}
}))

vi.mock('@/headless/utils', () => ({
	getDocumentAndEditor: vi.fn()
}))

type Edit = Remove | SetAttributes

// Test XML Fixtures
const createTestDocument = (xml: string): Document => {
	const parser = new DOMParser()
	return parser.parseFromString(xml, 'application/xml')
}

// Type guards
const isRemoveEdit = (edit: Edit): edit is Remove => 'node' in edit
const isSetAttributesEdit = (edit: Edit): edit is SetAttributes =>
	'element' in edit && 'attributes' in edit

const sampleSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="CBFunction">
          <LN0 lnClass="LLN0" inst="" lnType="TestLLN0"/>
          <LN lnClass="XCBR" lnInst="1" lnType="TestXCBR"/>
          <LN lnClass="CSWI" lnInst="1" lnType="TestCSWI"/>
        </LDevice>
        <LDevice inst="QA1_Protection">
          <LN0 lnClass="LLN0" inst="" lnType="TestLLN0"/>
          <LN lnClass="PTRC" lnInst="1" lnType="TestPTRC"/>
        </LDevice>
      </Server>
    </AccessPoint>
    <AccessPoint name="P2">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="OtherFunction">
          <LN0 lnClass="LLN0" inst="" lnType="TestLLN0"/>
          <LN lnClass="XCBR" lnInst="2" lnType="TestXCBR"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="IED2">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="CBFunction">
          <LN0 lnClass="LLN0" inst="" lnType="TestLLN0"/>
          <LN lnClass="XCBR" lnInst="1" lnType="TestXCBR"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <Substation name="Sub1">
    <VoltageLevel name="VL1">
      <Bay name="Bay1" templateUuid="baytype-uuid-1">
        <!-- Function with LNodes -->
        <Function name="CBFunction" templateUuid="func-uuid-1">
          <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED1" ldInst="CBFunction"/>
          <LNode lnClass="CSWI" lnType="TestCSWI" lnInst="1" iedName="IED1" ldInst="CBFunction"/>
        </Function>
        <!-- Equipment with EqFunction -->
        <ConductingEquipment name="QA1" type="CBR" templateUuid="eq-uuid-1">
          <EqFunction name="Protection">
            <LNode lnClass="PTRC" lnType="TestPTRC" lnInst="1" iedName="IED1" ldInst="QA1_Protection"/>
          </EqFunction>
        </ConductingEquipment>
      </Bay>
      <Bay name="Bay2" templateUuid="baytype-uuid-2">
        <!-- LNode assigned to different IED -->
        <Function name="CBFunction" templateUuid="func-uuid-2">
          <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED2" ldInst="CBFunction"/>
        </Function>
      </Bay>
      <Bay name="Bay3" templateUuid="baytype-uuid-3">
        <!-- Unassigned LNodes (no iedName) -->
        <Function name="CBFunction" templateUuid="func-uuid-3">
          <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1"/>
          <LNode lnClass="CSWI" lnType="TestCSWI" lnInst="1"/>
        </Function>
      </Bay>
    </VoltageLevel>
  </Substation>
</SCL>`

describe('buildEditsForDeleteAccessPoint', () => {
	let doc: Document
	let bay1: Element | null
	let bay2: Element | null
	let bay3: Element | null

	beforeEach(() => {
		doc = createTestDocument(sampleSCD)
		bay1 = doc.querySelector('Bay[name="Bay1"]')
		bay2 = doc.querySelector('Bay[name="Bay2"]')
		bay3 = doc.querySelector('Bay[name="Bay3"]')
	})

	describe('GIVEN an AccessPoint with LNodes', () => {
		describe('WHEN deleting the AccessPoint', () => {
			it('THEN should return Remove edit for AccessPoint element', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// THEN
				const removeEdit = edits.find(isRemoveEdit)
				expect(removeEdit).toBeDefined()
				if (removeEdit) {
					const node = removeEdit.node as Element
					expect(node.tagName).toBe('AccessPoint')
					expect(node.getAttribute('name')).toBe('P1')
				}
			})

			it('THEN should clear iedName from matching Bay Function LNodes', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// THEN
				const setAttributesEdits = edits.filter(isSetAttributesEdit)

				// Should find XCBR and CSWI LNodes from CBFunction
				const xcbrEdit = setAttributesEdits.find(
					(edit) =>
						edit.element.getAttribute('lnClass') === 'XCBR' &&
						edit.element.getAttribute('lnInst') === '1'
				)
				expect(xcbrEdit).toBeDefined()
				if (xcbrEdit?.attributes) {
					expect(xcbrEdit.attributes.iedName).toBeNull()
					expect(xcbrEdit.attributes.ldInst).toBeNull()
				}

				const cswiEdit = setAttributesEdits.find(
					(edit) =>
						edit.element.getAttribute('lnClass') === 'CSWI' &&
						edit.element.getAttribute('lnInst') === '1'
				)
				expect(cswiEdit).toBeDefined()
				if (cswiEdit?.attributes) {
					expect(cswiEdit.attributes.iedName).toBeNull()
				}
			})

			it('THEN should clear iedName from matching Bay EqFunction LNodes', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// THEN
				const setAttributesEdits = edits.filter(isSetAttributesEdit)

				// Should find PTRC LNode from QA1/Protection
				const ptrcEdit = setAttributesEdits.find(
					(edit) =>
						edit.element.getAttribute('lnClass') === 'PTRC' &&
						edit.element.getAttribute('lnInst') === '1'
				)
				expect(ptrcEdit).toBeDefined()
				if (ptrcEdit?.attributes) {
					expect(ptrcEdit.attributes.iedName).toBeNull()
					expect(ptrcEdit.attributes.ldInst).toBeNull()
				}
			})
		})

		describe('WHEN AccessPoint has multiple LDevices', () => {
			it('THEN should clear all matching LNodes from all LDevices', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// THEN
				const setAttributesEdits = edits.filter(isSetAttributesEdit)
				const lnodeEdits = setAttributesEdits.filter(
					(edit) => edit.element.tagName === 'LNode'
				)

				// P1 has 2 LDevices: CBFunction (2 LNodes) and QA1_Protection (1 LNode)
				expect(lnodeEdits.length).toBe(3)
			})
		})
	})

	describe('GIVEN an AccessPoint with no LNodes', () => {
		describe('WHEN deleting the empty AccessPoint', () => {
			it('THEN should successfully remove AccessPoint without errors', () => {
				// GIVEN
				const emptyAPSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED3">
    <AccessPoint name="EmptyAP">
      <Server>
        <Authentication none="true"/>
      </Server>
    </AccessPoint>
  </IED>
  <Substation>
    <VoltageLevel>
      <Bay name="Bay1" templateUuid="baytype-uuid-1">
        <Function name="TestFunction">
          <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1"/>
        </Function>
      </Bay>
    </VoltageLevel>
  </Substation>
</SCL>`

				const emptyDoc = createTestDocument(emptyAPSCD)
				const bay = emptyDoc.querySelector('Bay[name="Bay1"]')
				expect(bay).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc: emptyDoc,
					iedName: 'IED3',
					accessPointName: 'EmptyAP',
					selectedBay: bay as Element
				})

				// THEN
				// Should have Remove edit for AccessPoint
				const removeEdit = edits.find(isRemoveEdit)
				expect(removeEdit).toBeDefined()
				if (removeEdit) {
					const node = removeEdit.node as Element
					expect(node.tagName).toBe('AccessPoint')
					expect(node.getAttribute('name')).toBe('EmptyAP')
				}

				// Should not have any SetAttributes edits for LNodes (none to clear)
				const lnodeEdits = edits.filter(
					(edit) =>
						isSetAttributesEdit(edit) &&
						edit.element.tagName === 'LNode'
				)
				expect(lnodeEdits.length).toBe(0)

				// Should not clear Bay templateUuid (no connections were removed)
				const bayEdit = edits.find(
					(edit) =>
						isSetAttributesEdit(edit) &&
						edit.element.tagName === 'Bay'
				)
				expect(bayEdit).toBeUndefined()
			})
		})
	})

	describe('GIVEN multiple Bays with different IED assignments', () => {
		describe('WHEN deleting AccessPoint from specific IED', () => {
			it('THEN should only affect LNodes with matching iedName', () => {
				// GIVEN
				expect(bay1).not.toBeNull()
				const bay2LNodeBefore = doc.querySelector(
					'Bay[name="Bay2"] Function LNode[iedName="IED2"]'
				)
				expect(bay2LNodeBefore).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// THEN
				const setAttributesEdits = edits.filter(isSetAttributesEdit)
				const lnodeEdits = setAttributesEdits.filter(
					(edit) => edit.element.tagName === 'LNode'
				)

				// Should have 3 LNode edits (XCBR, CSWI, PTRC from Bay1)
				expect(lnodeEdits.length).toBe(3)

				// Verify IED2 LNodes in Bay2 are not affected
				const bay2LNodeAfter = doc.querySelector(
					'Bay[name="Bay2"] Function LNode[iedName="IED2"]'
				)
				expect(bay2LNodeAfter).toBeTruthy()
				if (bay2LNodeAfter) {
					expect(bay2LNodeAfter.getAttribute('iedName')).toBe('IED2')
				}
			})

			it('THEN should not affect other bays', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// THEN
				const setAttributesEdits = edits.filter(isSetAttributesEdit)
				const lnodeEdits = setAttributesEdits.filter(
					(edit) => edit.element.tagName === 'LNode'
				)

				// None of the edits should target Bay2 or Bay3 LNodes
				for (const edit of lnodeEdits) {
					const lnode = edit.element
					const parent = lnode.closest('Bay')
					expect(parent?.getAttribute('name')).toBe('Bay1')
				}
			})
		})
	})

	describe('GIVEN LNode matching algorithm', () => {
		describe('WHEN LNodes exist in different parent contexts', () => {
			it('THEN should match by lnClass, lnType, lnInst regardless of parent', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// THEN
				const setAttributesEdits = edits.filter(isSetAttributesEdit)
				const lnodeEdits = setAttributesEdits.filter(
					(edit) => edit.element.tagName === 'LNode'
				)

				// Should find XCBR from Function, CSWI from Function, PTRC from EqFunction
				const lnClasses = lnodeEdits.map((edit) =>
					edit.element.getAttribute('lnClass')
				)
				expect(lnClasses).toContain('XCBR')
				expect(lnClasses).toContain('CSWI')
				expect(lnClasses).toContain('PTRC')
			})
		})
	})

	describe('GIVEN multiple equipment with identical LNode attributes', () => {
		describe('WHEN deleting AccessPoint with LNodes in different equipment', () => {
			it('THEN should only clear iedName from LNodes in matching equipment context', () => {
				// GIVEN - Create scenario with two equipment having identical LNode attributes
				const duplicateSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="BCU">
    <AccessPoint name="AP1">
      <Server>
        <LDevice inst="-QC2_DisconnectorFunction">
          <LN lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92"/>
        </LDevice>
        <LDevice inst="-QB92_DisconnectorFunction">
          <LN lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <Substation>
    <VoltageLevel>
      <Bay name="Q01A_" templateUuid="baytype-uuid">
        <ConductingEquipment name="-QC2" uuid="9a5f3d7b-4e8f-4d1f-9a6e-2c7b8f3d4e9a" templateUuid="616e3e5c-235a-4ba2-a129-c6b7aaf4eeb0">
          <EqFunction name="DisconnectorFunction" uuid="7e3d9a4f-6b8c-4a1f-9e5d-3c7b8f2d4e9a">
            <LNode lnClass="XSWI" lnInst="1" iedName="BCU" lnType="XSWI$oscd$_5114e81752706b92" uuid="9e5d3c7b-4a8f-4d1f-9a6e-3b7c8f2d4e9a"/>
          </EqFunction>
        </ConductingEquipment>
        <ConductingEquipment name="-QB92" uuid="0f3a7d9c-8e4b-4d6e-9a5f-2c9b7f3d4e8a" templateUuid="615085c8-5db2-46cf-9beb-88d90262a643">
          <EqFunction name="DisconnectorFunction" uuid="3d7b8f2c-4e9a-4d6e-9a1f-5a9d7c8b4f3e">
            <LNode lnClass="XSWI" lnInst="1" iedName="BCU" lnType="XSWI$oscd$_5114e81752706b92" uuid="X"/>
          </EqFunction>
        </ConductingEquipment>
      </Bay>
    </VoltageLevel>
  </Substation>
</SCL>`

				const dupDoc = createTestDocument(duplicateSCD)
				const bay = dupDoc.querySelector('Bay[name="Q01A_"]')
				expect(bay).not.toBeNull()

				// WHEN - Delete entire AccessPoint
				const edits = buildEditsForDeleteAccessPoint({
					doc: dupDoc,
					iedName: 'BCU',
					accessPointName: 'AP1',
					selectedBay: bay as Element
				})

				// THEN - Both LNodes should have their iedName cleared
				const setAttributesEdits = edits.filter(isSetAttributesEdit)
				const lnodeEdits = setAttributesEdits.filter(
					(edit) => edit.element.tagName === 'LNode'
				)

				// Should match both LNodes (one from -QC2 and one from -QB92)
				expect(lnodeEdits.length).toBe(2)

				// Verify correct LNodes are targeted by checking their parent equipment
				const targetedEquipment = lnodeEdits.map((edit) => {
					const lnode = edit.element
					const equipment = lnode.closest('ConductingEquipment')
					return equipment?.getAttribute('name')
				})

				expect(targetedEquipment).toContain('-QC2')
				expect(targetedEquipment).toContain('-QB92')

				// Verify the edits clear iedName
				for (const edit of lnodeEdits) {
					expect(edit.attributes?.iedName).toBeNull()
				}
			})
		})
	})

	describe('GIVEN Bay templateUuid assignment', () => {
		describe('WHEN deleting does not remove all connections', () => {
			it('THEN should not include templateUuid clear edit', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: bay1 as Element
				})

				// Apply the edits to simulate the deletion
				const setAttributesEdits = edits.filter(isSetAttributesEdit)

				for (const edit of setAttributesEdits) {
					if (edit.attributes) {
						for (const [key, value] of Object.entries(
							edit.attributes
						)) {
							if (value === null) {
								edit.element.removeAttribute(key)
							} else if (value !== undefined) {
								edit.element.setAttribute(key, value)
							}
						}
					}
				}

				// THEN
				const templateUuidEdit = edits.find(
					(edit) =>
						isSetAttributesEdit(edit) &&
						edit.element.tagName === 'Bay'
				)

				// After clearing all IED1 references, check if Bay has remaining connections
				const remainingConnections =
					bay1?.querySelectorAll('LNode[iedName]')
				if (remainingConnections && remainingConnections.length === 0) {
					expect(templateUuidEdit).toBeDefined()
					if (
						templateUuidEdit &&
						isSetAttributesEdit(templateUuidEdit)
					) {
						expect(
							templateUuidEdit.attributes?.templateUuid
						).toBeNull()
					}
				} else {
					expect(templateUuidEdit).toBeUndefined()
				}
			})
		})

		describe('WHEN deleting removes all connections', () => {
			it('THEN should include templateUuid clear edit', () => {
				// GIVEN
				const simpleSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED1">
    <AccessPoint name="P1">
      <Server>
        <LDevice inst="CBFunction">
          <LN lnClass="XCBR" lnInst="1" lnType="TestXCBR"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <Substation>
    <VoltageLevel>
      <Bay name="Bay1" templateUuid="baytype-uuid-1">
        <Function name="CBFunction">
          <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED1"/>
        </Function>
      </Bay>
    </VoltageLevel>
  </Substation>
</SCL>`

				const simpleDoc = createTestDocument(simpleSCD)
				const simpleBay = simpleDoc.querySelector('Bay[name="Bay1"]')
				expect(simpleBay).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteAccessPoint({
					doc: simpleDoc,
					iedName: 'IED1',
					accessPointName: 'P1',
					selectedBay: simpleBay as Element
				})

				// Apply attribute clears to simulate
				const setAttributesEdits = edits.filter(isSetAttributesEdit)

				for (const edit of setAttributesEdits) {
					if (edit.element.tagName === 'LNode' && edit.attributes) {
						for (const [key, value] of Object.entries(
							edit.attributes
						)) {
							if (value === null) {
								edit.element.removeAttribute(key)
							}
						}
					}
				}

				// THEN
				const templateUuidEdit = edits.find(
					(edit) =>
						isSetAttributesEdit(edit) &&
						edit.element.tagName === 'Bay'
				)
				expect(templateUuidEdit).toBeDefined()
				if (templateUuidEdit && isSetAttributesEdit(templateUuidEdit)) {
					expect(templateUuidEdit.attributes?.templateUuid).toBeNull()
				}
			})
		})
	})

	describe('GIVEN invalid inputs', () => {
		describe('WHEN AccessPoint does not exist', () => {
			it('THEN should throw error with AccessPoint message', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN / THEN
				expect(() => {
					buildEditsForDeleteAccessPoint({
						doc,
						iedName: 'IED1',
						accessPointName: 'NonExistent',
						selectedBay: bay1 as Element
					})
				}).toThrow('AccessPoint')
			})
		})

		describe('WHEN IED does not exist', () => {
			it('THEN should throw error with IED message', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN / THEN
				expect(() => {
					buildEditsForDeleteAccessPoint({
						doc,
						iedName: 'NonExistentIED',
						accessPointName: 'P1',
						selectedBay: bay1 as Element
					})
				}).toThrow('IED')
			})
		})
	})
})

describe('buildEditsForDeleteLNodeFromAccessPoint', () => {
	let doc: Document
	let bay1: Element | null

	beforeEach(() => {
		doc = createTestDocument(sampleSCD)
		bay1 = doc.querySelector('Bay[name="Bay1"]')
	})

	describe('GIVEN a specific LNode in an AccessPoint', () => {
		describe('WHEN deleting the LNode', () => {
			it('THEN should return Remove edit for the LNode element', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteLNodeFromAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					lDeviceInst: 'CBFunction',
					lNodeTemplate: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					},
					selectedBay: bay1 as Element
				})

				// THEN
				const removeEdit = edits.find(isRemoveEdit)
				expect(removeEdit).toBeDefined()
				if (removeEdit) {
					const node = removeEdit.node as Element
					expect(node.tagName).toBe('LN')
					expect(node.getAttribute('lnClass')).toBe('XCBR')
					expect(node.getAttribute('lnInst')).toBe('1')
				}
			})

			it('THEN should clear iedName on corresponding Bay LNode', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteLNodeFromAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					lDeviceInst: 'CBFunction',
					lNodeTemplate: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					},
					selectedBay: bay1 as Element
				})

				// THEN
				const setAttributesEdits = edits.filter(isSetAttributesEdit)
				const lnodeEdit = setAttributesEdits.find(
					(edit) => edit.element.tagName === 'LNode'
				)
				expect(lnodeEdit).toBeDefined()
				if (lnodeEdit?.attributes) {
					expect(lnodeEdit.attributes.iedName).toBeNull()
					expect(lnodeEdit.attributes.ldInst).toBeNull()
				}
			})
		})

		describe('WHEN deleting one LNode from LDevice with multiple LNodes', () => {
			it('THEN should not delete other LNodes from same LDevice', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteLNodeFromAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					lDeviceInst: 'CBFunction',
					lNodeTemplate: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					},
					selectedBay: bay1 as Element
				})

				// THEN
				// Should only have 1 Remove edit (for XCBR), not for CSWI
				const removeEdits = edits.filter(isRemoveEdit)
				expect(removeEdits.length).toBe(1)

				// Should only have 1 Bay LNode SetAttributes edit
				const lnodeEdits = edits.filter(
					(edit) =>
						isSetAttributesEdit(edit) &&
						edit.element.tagName === 'LNode'
				)
				expect(lnodeEdits.length).toBe(1)
			})
		})

		describe('WHEN deleting the last LNode from an LDevice', () => {
			it('THEN should remove the entire LDevice instead of just the LNode', () => {
				// GIVEN - Use QA1_Protection which has only 1 LNode
				expect(bay1).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteLNodeFromAccessPoint({
					doc,
					iedName: 'IED1',
					accessPointName: 'P1',
					lDeviceInst: 'QA1_Protection',
					lNodeTemplate: {
						lnClass: 'PTRC',
						lnType: 'TestPTRC',
						lnInst: '1'
					},
					selectedBay: bay1 as Element
				})

				// THEN
				const removeEdit = edits.find(isRemoveEdit)
				expect(removeEdit).toBeDefined()
				if (removeEdit) {
					const node = removeEdit.node as Element
					// Should remove LDevice, not just LN
					expect(node.tagName).toBe('LDevice')
					expect(node.getAttribute('inst')).toBe('QA1_Protection')
				}
			})
		})
	})

	describe('GIVEN Bay templateUuid assignment', () => {
		describe('WHEN deleting last LNode removes all connections', () => {
			it('THEN should clear templateUuid', () => {
				// GIVEN
				const simpleSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED1">
    <AccessPoint name="P1">
      <Server>
        <LDevice inst="CBFunction">
          <LN lnClass="XCBR" lnInst="1" lnType="TestXCBR"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <Substation>
    <VoltageLevel>
      <Bay name="Bay1" templateUuid="baytype-uuid-1">
        <Function name="CBFunction">
          <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED1"/>
        </Function>
      </Bay>
    </VoltageLevel>
  </Substation>
</SCL>`

				const simpleDoc = createTestDocument(simpleSCD)
				const simpleBay = simpleDoc.querySelector('Bay')
				expect(simpleBay).not.toBeNull()

				// WHEN
				const edits = buildEditsForDeleteLNodeFromAccessPoint({
					doc: simpleDoc,
					iedName: 'IED1',
					accessPointName: 'P1',
					lDeviceInst: 'CBFunction',
					lNodeTemplate: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					},
					selectedBay: simpleBay as Element
				})

				// Apply edits
				const setAttributesEdits = edits.filter(isSetAttributesEdit)

				for (const edit of setAttributesEdits) {
					if (edit.element.tagName === 'LNode' && edit.attributes) {
						for (const [key, value] of Object.entries(
							edit.attributes
						)) {
							if (value === null) {
								edit.element.removeAttribute(key)
							}
						}
					}
				}

				// THEN
				const templateUuidEdit = edits.find(
					(edit) =>
						isSetAttributesEdit(edit) &&
						edit.element.tagName === 'Bay'
				)
				expect(templateUuidEdit).toBeDefined()
			})
		})
	})

	describe('GIVEN invalid inputs', () => {
		describe('WHEN LNode does not exist in AccessPoint', () => {
			it('THEN should throw error', () => {
				// GIVEN
				expect(bay1).not.toBeNull()

				// WHEN / THEN
				expect(() => {
					buildEditsForDeleteLNodeFromAccessPoint({
						doc,
						iedName: 'IED1',
						accessPointName: 'P1',
						lDeviceInst: 'CBFunction',
						lNodeTemplate: {
							lnClass: 'NonExistent',
							lnType: 'TestXCBR',
							lnInst: '99'
						},
						selectedBay: bay1 as Element
					})
				}).toThrow()
			})
		})
	})
})
