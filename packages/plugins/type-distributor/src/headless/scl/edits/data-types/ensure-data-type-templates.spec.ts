import { describe, it, expect, beforeEach } from 'vitest'
import { ensureDataTypeTemplates } from './ensure-data-type-templates'
import type { Insert } from '@openscd/oscd-api'

describe('ensureDataTypeTemplates', () => {
	let mockDocument: XMLDocument

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>',
			'application/xml'
		) as XMLDocument
	})

	describe('GIVEN a document without DataTypeTemplates', () => {
		describe('WHEN ensureDataTypeTemplates is called', () => {
			it('THEN should create a new DataTypeTemplates element', () => {
				// GIVEN
				expect(
					mockDocument.querySelector('DataTypeTemplates')
				).toBeNull()

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(result.element).toBeTruthy()
				expect(result.element.tagName).toBe('DataTypeTemplates')
			})

			it('THEN should return an Insert edit', () => {
				// GIVEN
				expect(
					mockDocument.querySelector('DataTypeTemplates')
				).toBeNull()

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(result.edit).toBeTruthy()
				expect(result.edit).toHaveProperty('node')
				expect(result.edit).toHaveProperty('parent')
				expect(result.edit).toHaveProperty('reference')
			})

			it('THEN should have document root as parent', () => {
				// GIVEN
				const root = mockDocument.documentElement

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				const edit = result.edit as Insert
				expect(edit.parent).toBe(root)
			})

			it('THEN should have null reference for insertion', () => {
				// GIVEN
				expect(
					mockDocument.querySelector('DataTypeTemplates')
				).toBeNull()

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				const edit = result.edit as Insert
				expect(edit.reference).toBeNull()
			})

			it('THEN should return same element in both edit and element properties', () => {
				// GIVEN
				expect(
					mockDocument.querySelector('DataTypeTemplates')
				).toBeNull()

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				const edit = result.edit as Insert
				expect(result.element).toBe(edit.node)
			})
		})
	})

	describe('GIVEN a document with existing DataTypeTemplates', () => {
		beforeEach(() => {
			const dataTypeTemplates =
				mockDocument.createElement('DataTypeTemplates')
			mockDocument.documentElement.appendChild(dataTypeTemplates)
		})

		describe('WHEN ensureDataTypeTemplates is called', () => {
			it('THEN should return the existing DataTypeTemplates element', () => {
				// GIVEN
				const existingElement =
					mockDocument.querySelector('DataTypeTemplates')
				expect(existingElement).toBeTruthy()

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(result.element).toBe(existingElement)
			})

			it('THEN should return null edit', () => {
				// GIVEN
				expect(
					mockDocument.querySelector('DataTypeTemplates')
				).toBeTruthy()

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(result.edit).toBeNull()
			})

			it('THEN should not create a duplicate element', () => {
				// GIVEN
				expect(
					mockDocument.querySelectorAll('DataTypeTemplates')
				).toHaveLength(1)

				// WHEN
				ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(
					mockDocument.querySelectorAll('DataTypeTemplates')
				).toHaveLength(1)
			})
		})
	})

	describe('GIVEN a document with existing DataTypeTemplates and child types', () => {
		beforeEach(() => {
			const dataTypeTemplates =
				mockDocument.createElement('DataTypeTemplates')
			const lnodeType = mockDocument.createElement('LNodeType')
			lnodeType.setAttribute('id', 'TestType')
			dataTypeTemplates.appendChild(lnodeType)
			mockDocument.documentElement.appendChild(dataTypeTemplates)
		})

		describe('WHEN ensureDataTypeTemplates is called', () => {
			it('THEN should return the existing DataTypeTemplates with its content', () => {
				// GIVEN
				const existingElement =
					mockDocument.querySelector('DataTypeTemplates')
				expect(existingElement?.querySelector('LNodeType')).toBeTruthy()

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(result.element).toBe(existingElement)
				expect(result.element.querySelector('LNodeType')).toBeTruthy()
				expect(
					result.element
						.querySelector('LNodeType')
						?.getAttribute('id')
				).toBe('TestType')
			})

			it('THEN should not modify existing content', () => {
				// GIVEN
				const existingLNodeType =
					mockDocument.querySelector('LNodeType')

				// WHEN
				const result = ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(result.element.querySelector('LNodeType')).toBe(
					existingLNodeType
				)
			})
		})
	})

	describe('GIVEN multiple calls to ensureDataTypeTemplates', () => {
		describe('WHEN called on the same document', () => {
			it('THEN should return the same element on subsequent calls', () => {
				// GIVEN & WHEN
				const result1 = ensureDataTypeTemplates(mockDocument)
				mockDocument.documentElement.appendChild(result1.element)
				const result2 = ensureDataTypeTemplates(mockDocument)

				// THEN
				expect(result1.element).toBe(result2.element)
				expect(result1.edit).toBeTruthy()
				expect(result2.edit).toBeNull()
			})
		})
	})
})
