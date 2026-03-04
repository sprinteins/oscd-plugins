import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isRemoveEdit } from '@/headless/test-helpers/type-guards'
import { createTestDocument } from '@/headless/test-helpers'
import { buildEditsForDeleteEmptyIed } from './build-edits-for-delete-empty-ied'
import { getDocument } from '@/headless/utils'

// Mock dependencies
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		editCount: 0
	}
}))

vi.mock('@/headless/utils', () => ({
	getDocument: vi.fn()
}))

const sampleSCD = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
  <IED name="IED1"></IED>
  <IED name="IED2"></IED>
</SCL>`

describe('buildEditsForDeleteEmptyIed', () => {
	let doc: Document

	beforeEach(() => {
		doc = createTestDocument(sampleSCD)
		vi.mocked(getDocument).mockReturnValue(doc as XMLDocument)
	})

	describe('GIVEN an empty IED', () => {
		it('WHEN building edits for deleting the empty IED THEN should return Remove edit for the IED element', () => {
			// WHEN
			const edits = buildEditsForDeleteEmptyIed('IED1')

			// THEN
			expect(edits.length).toBe(1)
			const removeEdit = edits.find(isRemoveEdit)
			expect(removeEdit).toBeDefined()
			if (removeEdit) {
				const node = removeEdit.node as Element
				expect(node.tagName).toBe('IED')
				expect(node.getAttribute('name')).toBe('IED1')
			}
		})

		it('WHEN building edits for deleting a non-existent IED THEN should return empty edits array', () => {
			// WHEN
			const edits = buildEditsForDeleteEmptyIed('NonExistentIED')

			// THEN
			expect(edits.length).toBe(0)
		})
	})

	describe('GIVEN an IED with AccessPoints and LNodes (not empty) THEN should not delete the IED and return empty edits array', () => {
		const nonEmptySCD = `<?xml version="1.0" encoding="UTF-8"?>
    <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
      <IED name="IED1">
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
    </SCL>`

		beforeEach(() => {
			doc = createTestDocument(nonEmptySCD)
			vi.mocked(getDocument).mockReturnValue(doc as XMLDocument)
		})

		it('WHEN building edits for deleting the non-empty IED THEN should return empty edits array', () => {
			// WHEN
			const edits = buildEditsForDeleteEmptyIed('IED1')

			// THEN
			expect(edits.length).toBe(0)
		})
	})
})
