import { describe, it, expect, beforeEach } from 'vitest'
import { createLNodeElement } from './lnode-creation'
import type { LNodeTemplate } from '@/headless/common-types/ssd-types'

describe('createLNodeElement', () => {
	let mockDocument: Document

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<root></root>',
			'application/xml'
		)
	})

	describe('GIVEN an LNode template with minimal attributes', () => {
		describe('WHEN createLNodeElement is called', () => {
			it('THEN should create LNode element with required attributes', () => {
				// GIVEN
				const lnodeTemplate: LNodeTemplate = {
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}

				// WHEN
				const result = createLNodeElement(mockDocument, lnodeTemplate)

				// THEN
				expect(result.tagName).toBe('LNode')
				expect(result.getAttribute('lnClass')).toBe('XCBR')
				expect(result.getAttribute('lnType')).toBe('XCBR_Type1')
				expect(result.getAttribute('lnInst')).toBe('1')
			})

			it('THEN should generate a uuid attribute', () => {
				// GIVEN
				const lnodeTemplate: LNodeTemplate = {
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}

				// WHEN
				const result = createLNodeElement(mockDocument, lnodeTemplate)

				// THEN
				const uuid = result.getAttribute('uuid')
				expect(uuid).toBeTruthy()
				expect(uuid).toMatch(
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
				)
			})

			it('THEN should not set iedName attribute when not provided', () => {
				// GIVEN
				const lnodeTemplate: LNodeTemplate = {
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}

				// WHEN
				const result = createLNodeElement(mockDocument, lnodeTemplate)

				// THEN
				expect(result.hasAttribute('iedName')).toBe(false)
			})
		})
	})

	describe('GIVEN an LNode template with iedName', () => {
		describe('WHEN createLNodeElement is called', () => {
			it('THEN should create LNode element with iedName attribute', () => {
				// GIVEN
				const lnodeTemplate: LNodeTemplate = {
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '1',
					iedName: 'IED1'
				}

				// WHEN
				const result = createLNodeElement(mockDocument, lnodeTemplate)

				// THEN
				expect(result.getAttribute('iedName')).toBe('IED1')
			})
		})
	})

	describe('GIVEN multiple LNode templates', () => {
		describe('WHEN createLNodeElement is called for each', () => {
			it('THEN should generate unique uuids for each element', () => {
				// GIVEN
				const lnodeTemplate1: LNodeTemplate = {
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}

				const lnodeTemplate2: LNodeTemplate = {
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '1'
				}

				// WHEN
				const result1 = createLNodeElement(mockDocument, lnodeTemplate1)
				const result2 = createLNodeElement(mockDocument, lnodeTemplate2)

				// THEN
				const uuid1 = result1.getAttribute('uuid')
				const uuid2 = result2.getAttribute('uuid')

				expect(uuid1).not.toBe(uuid2)
			})

			it('THEN should create independent elements with correct attributes', () => {
				// GIVEN
				const lnodeTemplate1: LNodeTemplate = {
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}

				const lnodeTemplate2: LNodeTemplate = {
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '2',
					iedName: 'IED2'
				}

				// WHEN
				const result1 = createLNodeElement(mockDocument, lnodeTemplate1)
				const result2 = createLNodeElement(mockDocument, lnodeTemplate2)

				// THEN
				expect(result1.getAttribute('lnClass')).toBe('XCBR')
				expect(result1.getAttribute('lnInst')).toBe('1')
				expect(result1.hasAttribute('iedName')).toBe(false)

				expect(result2.getAttribute('lnClass')).toBe('CSWI')
				expect(result2.getAttribute('lnInst')).toBe('2')
				expect(result2.getAttribute('iedName')).toBe('IED2')
			})
		})
	})

	describe('GIVEN various lnClass values', () => {
		describe('WHEN createLNodeElement is called', () => {
			it('THEN should preserve the lnClass value', () => {
				// GIVEN
				const lnClasses = ['XCBR', 'CSWI', 'MMXU', 'PTRC', 'PDIS']

				// WHEN & THEN
				for (const lnClass of lnClasses) {
					const lnodeTemplate: LNodeTemplate = {
						lnClass,
						lnType: `${lnClass}_Type1`,
						lnInst: '1'
					}

					const result = createLNodeElement(
						mockDocument,
						lnodeTemplate
					)

					expect(result.getAttribute('lnClass')).toBe(lnClass)
				}
			})
		})
	})

	describe('GIVEN an LNode template with all optional attributes', () => {
		describe('WHEN createLNodeElement is called', () => {
			it('THEN should create a fully populated LNode element', () => {
				// GIVEN
				const lnodeTemplate: LNodeTemplate = {
					uuid: 'custom-uuid-123',
					lnClass: 'MMXU',
					lnType: 'MMXU_Type1',
					lnInst: '1',
					iedName: 'IED1'
				}

				// WHEN
				const result = createLNodeElement(mockDocument, lnodeTemplate)

				// THEN
				expect(result.tagName).toBe('LNode')
				expect(result.getAttribute('lnClass')).toBe('MMXU')
				expect(result.getAttribute('lnType')).toBe('MMXU_Type1')
				expect(result.getAttribute('lnInst')).toBe('1')
				expect(result.getAttribute('iedName')).toBe('IED1')
				// Note: uuid in template is ignored, function generates a new one
				expect(result.getAttribute('uuid')).not.toBe('custom-uuid-123')
				expect(result.getAttribute('uuid')).toMatch(
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
				)
			})
		})
	})
})
