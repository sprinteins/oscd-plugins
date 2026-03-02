import { describe, it, expect, beforeEach } from 'vitest'
import { queryTypeReference, TYPE_ORDER } from './query-insertion-references'

describe('insertion-references', () => {
	let mockDocument: Document
	let dataTypeTemplates: Element

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<DataTypeTemplates xmlns="http://www.iec.ch/61850/2003/SCL"></DataTypeTemplates>',
			'application/xml'
		)
		dataTypeTemplates = mockDocument.documentElement
	})

	describe('getTypeReference', () => {
		describe('GIVEN an empty DataTypeTemplates', () => {
			describe('WHEN getTypeReference is called for any type', () => {
				it('THEN should return the first child (null in empty case)', () => {
					// GIVEN
					expect(dataTypeTemplates.children).toHaveLength(0)

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'LNodeType'
					)

					// THEN
					expect(result).toBeNull()
				})

				it('THEN should return null for DOType', () => {
					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DOType'
					)

					// THEN
					expect(result).toBeNull()
				})

				it('THEN should return null for DAType', () => {
					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DAType'
					)

					// THEN
					expect(result).toBeNull()
				})

				it('THEN should return null for EnumType', () => {
					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'EnumType'
					)

					// THEN
					expect(result).toBeNull()
				})
			})
		})

		describe('GIVEN DataTypeTemplates with LNodeType elements', () => {
			beforeEach(() => {
				const lnodeType1 = mockDocument.createElement('LNodeType')
				lnodeType1.setAttribute('id', 'LN1')
				const lnodeType2 = mockDocument.createElement('LNodeType')
				lnodeType2.setAttribute('id', 'LN2')
				dataTypeTemplates.appendChild(lnodeType1)
				dataTypeTemplates.appendChild(lnodeType2)
			})

			describe('WHEN getTypeReference is called for LNodeType', () => {
				it('THEN should return nextSibling of the last LNodeType', () => {
					// GIVEN
					const lastLNodeType =
						dataTypeTemplates.querySelectorAll('LNodeType')[1]

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'LNodeType'
					)

					// THEN
					expect(result).toBe(lastLNodeType.nextSibling)
				})
			})

			describe('WHEN getTypeReference is called for DOType', () => {
				it('THEN should return nextSibling of the last LNodeType', () => {
					// GIVEN
					const lastLNodeType =
						dataTypeTemplates.querySelectorAll('LNodeType')[1]

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DOType'
					)

					// THEN
					expect(result).toBe(lastLNodeType.nextSibling)
				})
			})
		})

		describe('GIVEN DataTypeTemplates with LNodeType and DOType elements', () => {
			beforeEach(() => {
				const lnodeType = mockDocument.createElement('LNodeType')
				lnodeType.setAttribute('id', 'LN1')
				const doType1 = mockDocument.createElement('DOType')
				doType1.setAttribute('id', 'DO1')
				const doType2 = mockDocument.createElement('DOType')
				doType2.setAttribute('id', 'DO2')
				dataTypeTemplates.appendChild(lnodeType)
				dataTypeTemplates.appendChild(doType1)
				dataTypeTemplates.appendChild(doType2)
			})

			describe('WHEN getTypeReference is called for LNodeType', () => {
				it('THEN should return nextSibling of the last LNodeType', () => {
					// GIVEN
					const lastLNodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'LNodeType'
					)

					// THEN
					expect(result).toBe(lastLNodeType?.nextSibling)
				})
			})

			describe('WHEN getTypeReference is called for DOType', () => {
				it('THEN should return nextSibling of the last LNodeType (searches LNodeType, DOType in order)', () => {
					// GIVEN
					const lastLNodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DOType'
					)

					// THEN
					// precedingTypes = ['LNodeType', 'DOType'], loop finds LNodeType first and returns
					expect(result).toBe(lastLNodeType?.nextSibling)
				})
			})

			describe('WHEN getTypeReference is called for DAType', () => {
				it('THEN should return nextSibling of the last LNodeType (searches LNodeType, DOType, DAType in order)', () => {
					// GIVEN
					const lastLNodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DAType'
					)

					// THEN
					// precedingTypes = ['LNodeType', 'DOType', 'DAType'], loop finds LNodeType first and returns
					expect(result).toBe(lastLNodeType?.nextSibling)
				})
			})
		})

		describe('GIVEN DataTypeTemplates with all type elements in order', () => {
			beforeEach(() => {
				const lnodeType = mockDocument.createElement('LNodeType')
				lnodeType.setAttribute('id', 'LN1')
				const doType = mockDocument.createElement('DOType')
				doType.setAttribute('id', 'DO1')
				const daType = mockDocument.createElement('DAType')
				daType.setAttribute('id', 'DA1')
				const enumType = mockDocument.createElement('EnumType')
				enumType.setAttribute('id', 'EN1')

				dataTypeTemplates.appendChild(lnodeType)
				dataTypeTemplates.appendChild(doType)
				dataTypeTemplates.appendChild(daType)
				dataTypeTemplates.appendChild(enumType)
			})

			describe('WHEN getTypeReference is called for each type', () => {
				it('THEN should return correct reference for LNodeType', () => {
					// GIVEN
					const lnodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'LNodeType'
					)

					// THEN
					expect(result).toBe(lnodeType?.nextSibling)
				})

				it('THEN should return correct reference for DOType', () => {
					// GIVEN
					const lnodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DOType'
					)

					// THEN
					// precedingTypes = ['LNodeType', 'DOType'], finds LNodeType first
					expect(result).toBe(lnodeType?.nextSibling)
				})

				it('THEN should return correct reference for DAType', () => {
					// GIVEN
					const lnodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DAType'
					)

					// THEN
					// precedingTypes = ['LNodeType', 'DOType', 'DAType'], finds LNodeType first
					expect(result).toBe(lnodeType?.nextSibling)
				})

				it('THEN should return correct reference for EnumType', () => {
					// GIVEN
					const lnodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'EnumType'
					)

					// THEN
					// precedingTypes = ['LNodeType', 'DOType', 'DAType', 'EnumType'], finds LNodeType first
					expect(result).toBe(lnodeType?.nextSibling)
				})
			})
		})

		describe('GIVEN DataTypeTemplates with multiple elements of same type', () => {
			beforeEach(() => {
				const lnodeType1 = mockDocument.createElement('LNodeType')
				lnodeType1.setAttribute('id', 'LN1')
				const lnodeType2 = mockDocument.createElement('LNodeType')
				lnodeType2.setAttribute('id', 'LN2')
				const lnodeType3 = mockDocument.createElement('LNodeType')
				lnodeType3.setAttribute('id', 'LN3')

				dataTypeTemplates.appendChild(lnodeType1)
				dataTypeTemplates.appendChild(lnodeType2)
				dataTypeTemplates.appendChild(lnodeType3)
			})

			describe('WHEN getTypeReference is called for LNodeType', () => {
				it('THEN should return nextSibling of the last element', () => {
					// GIVEN
					const allLNodeTypes =
						dataTypeTemplates.querySelectorAll('LNodeType')
					const lastLNodeType =
						allLNodeTypes[allLNodeTypes.length - 1]

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'LNodeType'
					)

					// THEN
					expect(result).toBe(lastLNodeType.nextSibling)
				})
			})
		})

		describe('GIVEN DataTypeTemplates with types out of order', () => {
			beforeEach(() => {
				const enumType = mockDocument.createElement('EnumType')
				enumType.setAttribute('id', 'EN1')
				const lnodeType = mockDocument.createElement('LNodeType')
				lnodeType.setAttribute('id', 'LN1')
				const daType = mockDocument.createElement('DAType')
				daType.setAttribute('id', 'DA1')

				dataTypeTemplates.appendChild(enumType)
				dataTypeTemplates.appendChild(lnodeType)
				dataTypeTemplates.appendChild(daType)
			})

			describe('WHEN getTypeReference is called for LNodeType', () => {
				it('THEN should return nextSibling of the last LNodeType found', () => {
					// GIVEN
					const lnodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'LNodeType'
					)

					// THEN
					expect(result).toBe(lnodeType?.nextSibling)
				})
			})

			describe('WHEN getTypeReference is called for DOType', () => {
				it('THEN should return nextSibling of last LNodeType since no DOType exists', () => {
					// GIVEN
					const lnodeType =
						dataTypeTemplates.querySelector('LNodeType')

					// WHEN
					const result = queryTypeReference(
						dataTypeTemplates,
						'DOType'
					)

					// THEN
					expect(result).toBe(lnodeType?.nextSibling)
				})
			})
		})
	})
})
