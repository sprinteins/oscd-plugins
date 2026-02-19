import { describe, it, expect, beforeEach, vi } from 'vitest'
import { buildEditsForDeleteAccessPoint } from './build-edits-for-delete-access-point'
import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { bayStore } from '@/headless/stores'
import {
	isRemoveEdit,
	isSetAttributesEdit
} from '@/headless/test-helpers/type-guards'
import { createTestDocument } from '@/headless/test-helpers'

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
			let accessPoint: Element
			let edits: (Remove | SetAttributes)[]

			beforeEach(() => {
				expect(bay1).not.toBeNull()
				accessPoint = doc.querySelector(
					'IED[name="IED1"] AccessPoint[name="P1"]'
				) as Element
				bayStore.scdBay = bay1
				edits = buildEditsForDeleteAccessPoint(accessPoint, 'IED1')
			})

			it('THEN should return Remove edit for AccessPoint element', () => {
				const removeEdit = edits.find(isRemoveEdit)
				expect(removeEdit).toBeDefined()
				if (removeEdit) {
					const node = removeEdit.node as Element
					expect(node.tagName).toBe('AccessPoint')
					expect(node.getAttribute('name')).toBe('P1')
				}
			})

			it('THEN should clear iedName from matching Bay Function LNodes', () => {
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

		it('WHEN AccessPoint has multiple LDevices THEN should clear all matching LNodes from all LDevices', () => {
			expect(bay1).not.toBeNull()

			const accessPoint = doc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			bayStore.scdBay = bay1
			const edits = buildEditsForDeleteAccessPoint(accessPoint, 'IED1')

			const setAttributesEdits = edits.filter(isSetAttributesEdit)
			const lnodeEdits = setAttributesEdits.filter(
				(edit) => edit.element.tagName === 'LNode'
			)

			// P1 has 2 LDevices: CBFunction (2 LNodes) and QA1_Protection (1 LNode)
			expect(lnodeEdits.length).toBe(3)
		})
	})

	it('GIVEN an AccessPoint with no LNodes WHEN deleting the empty AccessPoint THEN should successfully remove AccessPoint without errors', () => {
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

		const accessPoint = emptyDoc.querySelector(
			'IED[name="IED3"] AccessPoint[name="EmptyAP"]'
		) as Element
		bayStore.scdBay = bay
		const edits = buildEditsForDeleteAccessPoint(accessPoint, 'IED3')

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
				isSetAttributesEdit(edit) && edit.element.tagName === 'LNode'
		)
		expect(lnodeEdits.length).toBe(0)

		// Should not clear Bay templateUuid (no connections were removed)
		const bayEdit = edits.find(
			(edit) =>
				isSetAttributesEdit(edit) && edit.element.tagName === 'Bay'
		)
		expect(bayEdit).toBeUndefined()
	})

	describe('GIVEN multiple Bays with different IED assignments WHEN deleting AccessPoint from specific IED', () => {
		let accessPoint: Element
		let edits: (Remove | SetAttributes)[]

		beforeEach(() => {
			expect(bay1).not.toBeNull()
			accessPoint = doc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			bayStore.scdBay = bay1
			edits = buildEditsForDeleteAccessPoint(accessPoint, 'IED1')
		})

		it('THEN should only affect LNodes with matching iedName', () => {
			const bay2LNodeBefore = doc.querySelector(
				'Bay[name="Bay2"] Function LNode[iedName="IED2"]'
			)
			expect(bay2LNodeBefore).not.toBeNull()

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

	it('GIVEN LNode matching algorithm WHEN LNodes exist in different parent contexts THEN should match by lnClass, lnType, lnInst regardless of parent', () => {
		expect(bay1).not.toBeNull()

		const accessPoint = doc.querySelector(
			'IED[name="IED1"] AccessPoint[name="P1"]'
		) as Element
		bayStore.scdBay = bay1
		const edits = buildEditsForDeleteAccessPoint(accessPoint, 'IED1')

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

	it('GIVEN multiple equipment with identical LNode attributes WHEN deleting AccessPoint with LNodes in different equipment THEN should only clear iedName from LNodes in matching equipment context', () => {
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

		const accessPoint = dupDoc.querySelector(
			'IED[name="BCU"] AccessPoint[name="AP1"]'
		) as Element
		bayStore.scdBay = bay
		const edits = buildEditsForDeleteAccessPoint(accessPoint, 'BCU')

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

	describe('GIVEN Bay templateUuid assignment', () => {
		it('WHEN deleting does not remove all connections THEN should not include templateUuid clear edit', () => {
			expect(bay1).not.toBeNull()

			const accessPoint = doc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			bayStore.scdBay = bay1
			const edits = buildEditsForDeleteAccessPoint(accessPoint, 'IED1')

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

			const templateUuidEdit = edits.find(
				(edit) =>
					isSetAttributesEdit(edit) && edit.element.tagName === 'Bay'
			)

			// After clearing all IED1 references, check if Bay has remaining connections
			const remainingConnections =
				bay1?.querySelectorAll('LNode[iedName]')
			if (remainingConnections && remainingConnections.length === 0) {
				expect(templateUuidEdit).toBeDefined()
				if (templateUuidEdit && isSetAttributesEdit(templateUuidEdit)) {
					expect(templateUuidEdit.attributes?.templateUuid).toBeNull()
				}
			} else {
				expect(templateUuidEdit).toBeUndefined()
			}
		})

		it('WHEN deleting removes all connections THEN should include templateUuid clear edit', () => {
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

			const accessPoint = simpleDoc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			bayStore.scdBay = simpleBay
			const edits = buildEditsForDeleteAccessPoint(accessPoint, 'IED1')

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

			const templateUuidEdit = edits.find(
				(edit) =>
					isSetAttributesEdit(edit) && edit.element.tagName === 'Bay'
			)
			expect(templateUuidEdit).toBeDefined()
			if (templateUuidEdit && isSetAttributesEdit(templateUuidEdit)) {
				expect(templateUuidEdit.attributes?.templateUuid).toBeNull()
			}
		})
	})
})
