import { describe, it, expect, beforeEach, vi } from 'vitest'
import { buildEditsForDeleteLNodeFromAccessPoint } from './build-edits-for-delete-lnodes-from-access-point'
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
				const accessPoint = doc.querySelector(
					'IED[name="IED1"] AccessPoint[name="P1"]'
				) as Element
				bayStore.scdBay = bay1
				const edits = buildEditsForDeleteLNodeFromAccessPoint(
					'IED1',
					accessPoint,
					{
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1',
						ldInst: 'CBFunction'
					}
				)

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
				const accessPoint = doc.querySelector(
					'IED[name="IED1"] AccessPoint[name="P1"]'
				) as Element
				bayStore.scdBay = bay1
				const edits = buildEditsForDeleteLNodeFromAccessPoint(
					'IED1',
					accessPoint,
					{
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1',
						ldInst: 'CBFunction'
					}
				)

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

		it('WHEN deleting one LNode from LDevice with multiple LNodes THEN should not delete other LNodes from same LDevice', () => {
			// GIVEN
			expect(bay1).not.toBeNull()

			// WHEN
			const accessPoint = doc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			bayStore.scdBay = bay1
			const edits = buildEditsForDeleteLNodeFromAccessPoint(
				'IED1',
				accessPoint,
				{
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1',
					ldInst: 'CBFunction'
				}
			)

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
			// GIVEN - Use QA1_Protection which has only 1 LNode
			expect(bay1).not.toBeNull()

			// WHEN
			const accessPoint = doc.querySelector(
				'IED[name="IED1"] AccessPoint[name="P1"]'
			) as Element
			bayStore.scdBay = bay1
			const edits = buildEditsForDeleteLNodeFromAccessPoint(
				'IED1',
				accessPoint,
				{
					lnClass: 'PTRC',
					lnType: 'TestPTRC',
					lnInst: '1',
					ldInst: 'QA1_Protection'
				}
			)

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

	it('GIVEN Bay templateUuid assignment WHEN deleting last LNode removes all connections THEN should clear templateUuid', () => {
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
		const accessPoint = simpleDoc.querySelector(
			'IED[name="IED1"] AccessPoint[name="P1"]'
		) as Element
		bayStore.scdBay = simpleBay
		const edits = buildEditsForDeleteLNodeFromAccessPoint(
			'IED1',
			accessPoint,
			{
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1',
				ldInst: 'CBFunction'
			}
		)

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

	it('GIVEN invalid inputs WHEN LNode does not exist in AccessPoint THEN should throw error', () => {
		// GIVEN
		expect(bay1).not.toBeNull()

		// WHEN / THEN
		const accessPoint = doc.querySelector(
			'IED[name="IED1"] AccessPoint[name="P1"]'
		) as Element
		bayStore.scdBay = bay1
		expect(() => {
			buildEditsForDeleteLNodeFromAccessPoint('IED1', accessPoint, {
				lnClass: 'NonExistent',
				lnType: 'TestXCBR',
				lnInst: '99',
				ldInst: 'QBFunction'
			})
		}).toThrow()
	})
})
