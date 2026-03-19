import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestDocument } from '@/headless/test-helpers'
import {
	isRemoveEdit,
	isSetAttributesEdit
} from '@/headless/test-helpers/type-guards'
import { buildEditsForDeleteLNodeFromAccessPoint } from './ied-lnode-edits'

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
        <LDevice inst="CBFunction_aa11bb22">
          <LN0 lnClass="LLN0" inst="" lnType="TestLLN0"/>
          <LN lnClass="XCBR" lnInst="1" lnType="TestXCBR"/>
          <LN lnClass="CSWI" lnInst="1" lnType="TestCSWI"/>
        </LDevice>
        <LDevice inst="QA1_Protection_cc33dd44">
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
        <Function name="CBFunction" uuid="aa11bb22-0000-0000-0000-000000000000" templateUuid="func-uuid-1">
          <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED1" ldInst="CBFunction_aa11bb22"/>
          <LNode lnClass="CSWI" lnType="TestCSWI" lnInst="1" iedName="IED1" ldInst="CBFunction_aa11bb22"/>
        </Function>
        <!-- Equipment with EqFunction -->
        <ConductingEquipment name="QA1" type="CBR" templateUuid="eq-uuid-1">
          <EqFunction name="Protection" uuid="cc33dd44-0000-0000-0000-000000000000">
            <LNode lnClass="PTRC" lnType="TestPTRC" lnInst="1" iedName="IED1" ldInst="QA1_Protection_cc33dd44"/>
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

describe('buildEditsForDeleteLNodeFromAccessPoint', () => {
	let doc: Document
	let bay1: Element | null

	beforeEach(() => {
		doc = createTestDocument(sampleSCD)
		bay1 = doc.querySelector('Bay[name="Bay1"]')
		expect(bay1).not.toBeNull()
	})

	describe('GIVEN a specific LNode in an AccessPoint', () => {
		describe('WHEN deleting the LNode', () => {
			let accessPoint: Element
			let edits: ReturnType<
				typeof buildEditsForDeleteLNodeFromAccessPoint
			>

			beforeEach(() => {
				accessPoint = doc.querySelector(
					'IED[name="IED1"] AccessPoint[name="P1"]'
				) as Element
				edits = buildEditsForDeleteLNodeFromAccessPoint({
					iedName: 'IED1',
					accessPoint,
					lNodeTemplate: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1',
						ldInst: 'CBFunction_aa11bb22'
					},
					selectedBay: bay1
				})
			})

			it('THEN should return Remove edit for the LNode element', () => {
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

		it('WHEN deleting one LNode from LDevice with multiple LNodes THEN should not delete other LNodes from same LDevice', () => {
			// WHEN
			const accessPoint = doc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			const edits = buildEditsForDeleteLNodeFromAccessPoint({
				iedName: 'IED1',
				accessPoint,
				lNodeTemplate: {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1',
					ldInst: 'CBFunction_aa11bb22'
				},
				selectedBay: bay1
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

		it('WHEN deleting the last LNode from an LDevice THEN should remove the entire LDevice instead of just the LNode', () => {
			// WHEN
			const accessPoint = doc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			const edits = buildEditsForDeleteLNodeFromAccessPoint({
				iedName: 'IED1',
				accessPoint,
				lNodeTemplate: {
					lnClass: 'PTRC',
					lnType: 'TestPTRC',
					lnInst: '1',
					ldInst: 'QA1_Protection_cc33dd44'
				},
				selectedBay: bay1
			})

			// THEN
			const removeEdit = edits.find(isRemoveEdit)
			expect(removeEdit).toBeDefined()
			if (removeEdit) {
				const node = removeEdit.node as Element
				// Should remove LDevice, not just LN
				expect(node.tagName).toBe('LDevice')
				expect(node.getAttribute('inst')).toBe(
					'QA1_Protection_cc33dd44'
				)
			}
		})
	})

	it('GIVEN Bay templateUuid assignment WHEN deleting last LNode removes all connections THEN should clear templateUuid', () => {
		// GIVEN
		const simpleSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED1">
    <AccessPoint name="P1">
      <Server>
        <LDevice inst="CBFunction_aa11bb22">
          <LN lnClass="XCBR" lnInst="1" lnType="TestXCBR"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <Substation>
    <VoltageLevel>
      <Bay name="Bay1" templateUuid="baytype-uuid-1">
        <Function name="CBFunction" uuid="aa11bb22-0000-0000-0000-000000000000">
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
		const accessPoint = simpleDoc.querySelector(
			'IED[name="IED1"] AccessPoint[name="P1"]'
		) as Element
		const edits = buildEditsForDeleteLNodeFromAccessPoint({
			iedName: 'IED1',
			accessPoint,
			lNodeTemplate: {
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1',
				ldInst: 'CBFunction_aa11bb22'
			},
			selectedBay: simpleBay
		})

		// Apply edits
		const setAttributesEdits = edits.filter(isSetAttributesEdit)

		for (const edit of setAttributesEdits) {
			if (edit.element.tagName === 'LNode' && edit.attributes) {
				for (const [key, value] of Object.entries(edit.attributes)) {
					if (value === null) {
						edit.element.removeAttribute(key)
					}
				}
			}
		}

		// THEN
		const templateUuidEdit = edits.find(
			(edit) =>
				isSetAttributesEdit(edit) && edit.element.tagName === 'Bay'
		)
		expect(templateUuidEdit).toBeDefined()
	})

	it('GIVEN Bay with uuid and ConductingEquipment with type-assignment attributes WHEN deleting last LNode removes all connections THEN should also clear bay uuid, equipment attributes, and remove EqFunctions', () => {
		// GIVEN - mirrors the real assigned-ap.scd structure
		const assignedSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED1">
    <AccessPoint name="P1">
      <Server>
        <LDevice inst="-CEQ2_DisconnectorFunction_a1b2c3d4">
          <LN lnClass="XSWI" lnInst="1" lnType="XSWI$type"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <Substation>
    <VoltageLevel>
      <Bay name="Bay1" uuid="bay-uuid-1" templateUuid="baytype-uuid-1">
        <ConductingEquipment name="-CEQ2" type="DIS" uuid="equip-uuid-2" templateUuid="tpl-uuid-2" originUuid="orig-uuid-2">
          <EqFunction name="DisconnectorFunction" uuid="a1b2c3d4-e5f6-7890-abcd-ef1234567890">
            <LNode lnClass="XSWI" lnInst="1" lnType="XSWI$type" iedName="IED1" ldInst="-CEQ2_DisconnectorFunction_a1b2c3d4"/>
          </EqFunction>
        </ConductingEquipment>
        <ConductingEquipment name="-CEQ3" type="CBR" uuid="equip-uuid-3" templateUuid="tpl-uuid-3" originUuid="orig-uuid-3">
          <EqFunction name="CircuitBreakerFunction">
            <LNode lnClass="XCBR" lnInst="1" lnType="XCBR$type"/>
          </EqFunction>
        </ConductingEquipment>
      </Bay>
    </VoltageLevel>
  </Substation>
</SCL>`

		const assignedDoc = createTestDocument(assignedSCD)
		const assignedBay = assignedDoc.querySelector('Bay[name="Bay1"]')
		expect(assignedBay).not.toBeNull()

		// WHEN - delete the last IED-assigned LNode
		const accessPoint = assignedDoc.querySelector(
			'IED[name="IED1"] AccessPoint[name="P1"]'
		) as Element
		const edits = buildEditsForDeleteLNodeFromAccessPoint({
			iedName: 'IED1',
			accessPoint,
			lNodeTemplate: {
				lnClass: 'XSWI',
				lnType: 'XSWI$type',
				lnInst: '1',
				ldInst: '-CEQ2_DisconnectorFunction_a1b2c3d4'
			},
			selectedBay: assignedBay
		})

		// THEN - bay uuid and templateUuid must be cleared
		const bayEdit = edits.find(
			(edit) =>
				isSetAttributesEdit(edit) && edit.element.tagName === 'Bay'
		)
		expect(bayEdit).toBeDefined()
		if (bayEdit && isSetAttributesEdit(bayEdit)) {
			expect(bayEdit.attributes?.uuid).toBeNull()
			expect(bayEdit.attributes?.templateUuid).toBeNull()
		}

		// THEN - both ConductingEquipments must have their type-assignment attributes cleared
		const equipEdits = edits.filter(
			(edit) =>
				isSetAttributesEdit(edit) &&
				edit.element.tagName === 'ConductingEquipment'
		)
		expect(equipEdits.length).toBe(2)
		for (const edit of equipEdits) {
			if (isSetAttributesEdit(edit)) {
				expect(edit.attributes?.uuid).toBeNull()
				expect(edit.attributes?.templateUuid).toBeNull()
				expect(edit.attributes?.originUuid).toBeNull()
			}
		}

		// THEN - EqFunction elements from both ConductingEquipments must be removed
		const removeEdits = edits.filter(isRemoveEdit)
		const eqFunctionRemoves = removeEdits.filter(
			(edit) => (edit.node as Element).tagName === 'EqFunction'
		)
		expect(eqFunctionRemoves.length).toBe(2)
	})

	it('GIVEN Bay with Function elements WHEN deleting last LNode removes all connections THEN should remove Function elements', () => {
		// GIVEN - Bay with direct Function children (not EqFunction inside ConductingEquipment)
		const functionSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED1">
    <AccessPoint name="P1">
      <Server>
        <LDevice inst="ProtectionFunction_bb22cc33">
          <LN lnClass="PTRC" lnInst="1" lnType="PTRC$type"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <Substation>
    <VoltageLevel>
      <Bay name="Bay1" uuid="bay-uuid-1" templateUuid="baytype-uuid-1">
        <Function name="ProtectionFunction" uuid="bb22cc33-0000-0000-0000-000000000000" templateUuid="tpl-func-1" originUuid="orig-func-1">
          <LNode lnClass="PTRC" lnInst="1" lnType="PTRC$type" iedName="IED1" ldInst="ProtectionFunction_bb22cc33"/>
        </Function>
        <Function name="MeasurementFunction" uuid="func-uuid-2" templateUuid="tpl-func-2" originUuid="orig-func-2">
          <LNode lnClass="MMXU" lnInst="1" lnType="MMXU$type"/>
        </Function>
      </Bay>
    </VoltageLevel>
  </Substation>
</SCL>`

		const functionDoc = createTestDocument(functionSCD)
		const functionBay = functionDoc.querySelector('Bay[name="Bay1"]')
		expect(functionBay).not.toBeNull()

		// WHEN - delete the last IED-assigned LNode
		const accessPoint = functionDoc.querySelector(
			'IED[name="IED1"] AccessPoint[name="P1"]'
		) as Element
		const edits = buildEditsForDeleteLNodeFromAccessPoint({
			iedName: 'IED1',
			accessPoint,
			lNodeTemplate: {
				lnClass: 'PTRC',
				lnType: 'PTRC$type',
				lnInst: '1',
				ldInst: 'ProtectionFunction_bb22cc33'
			},
			selectedBay: functionBay
		})

		// THEN - bay uuid and templateUuid must be cleared
		const bayEdit = edits.find(
			(edit) =>
				isSetAttributesEdit(edit) && edit.element.tagName === 'Bay'
		)
		expect(bayEdit).toBeDefined()
		if (bayEdit && isSetAttributesEdit(bayEdit)) {
			expect(bayEdit.attributes?.uuid).toBeNull()
			expect(bayEdit.attributes?.templateUuid).toBeNull()
		}

		// THEN - both Function elements must be removed
		const removeEdits = edits.filter(isRemoveEdit)
		const functionRemoves = removeEdits.filter(
			(edit) => (edit.node as Element).tagName === 'Function'
		)
		expect(functionRemoves.length).toBe(2)
	})

	it('GIVEN invalid inputs WHEN LNode does not exist in AccessPoint THEN should throw error', () => {
		// WHEN / THEN
		const accessPoint = doc.querySelector(
			'IED[name="IED1"] AccessPoint[name="P1"]'
		) as Element
		expect(() => {
			buildEditsForDeleteLNodeFromAccessPoint({
				iedName: 'IED1',
				accessPoint,
				lNodeTemplate: {
					lnClass: 'NonExistent',
					lnType: 'TestXCBR',
					lnInst: '99',
					ldInst: 'QBFunction'
				},
				selectedBay: bay1
			})
		}).toThrow()
	})
})
