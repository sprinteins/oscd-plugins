import { describe, expect, it } from 'vitest'
import { REF_FAMILY } from '@/headless/constants/type-elements'
import { getSchemaInsertBeforeReference } from './schema-insertion.helper'

describe('getSchemaInsertBeforeReference', () => {
	it.each([
		{
			elementName: REF_FAMILY.generalEquipment,
			boundaryName: 'ConductingEquipment'
		},
		{
			elementName: REF_FAMILY.generalEquipment,
			boundaryName: 'ConnectivityNode'
		},
		{
			elementName: REF_FAMILY.generalEquipment,
			boundaryName: 'Function'
		},
		{
			elementName: REF_FAMILY.conductingEquipment,
			boundaryName: 'ConnectivityNode'
		},
		{
			elementName: REF_FAMILY.conductingEquipment,
			boundaryName: 'Function'
		},
		{
			elementName: 'Terminal',
			boundaryName: 'SubEquipment'
		},
		{
			elementName: 'Terminal',
			boundaryName: 'EqFunction'
		}
	] as const)('GIVEN a parent with $boundaryName as a later child WHEN inserting $elementName THEN that boundary is returned', ({
		elementName,
		boundaryName
	}) => {
		const xmlDocument = document.implementation.createDocument(
			null,
			'SCL',
			null
		)
		const parent = xmlDocument.createElement('Parent')
		const boundary = xmlDocument.createElement(boundaryName)
		parent.append(boundary)

		expect(
			getSchemaInsertBeforeReference({
				elementName,
				parentTypeWrapper: parent
			})
		).toBe(boundary)
	})

	it('GIVEN a ConductingEquipment with SubEquipment and EqFunction after its Terminal WHEN another Terminal is positioned THEN it is inserted before SubEquipment', () => {
		const xmlDocument = document.implementation.createDocument(
			null,
			'SCL',
			null
		)
		const parent = xmlDocument.createElement('ConductingEquipment')
		const existingTerminal = xmlDocument.createElement('Terminal')
		const subEquipment = xmlDocument.createElement('SubEquipment')
		const eqFunction = xmlDocument.createElement('EqFunction')
		const newTerminal = xmlDocument.createElement('Terminal')

		parent.append(existingTerminal, subEquipment, eqFunction)
		const reference = getSchemaInsertBeforeReference({
			elementName: 'Terminal',
			parentTypeWrapper: parent
		})
		parent.insertBefore(newTerminal, reference)

		expect(reference).toBe(subEquipment)
		expect(
			Array.from(parent.children).map((child) => child.localName)
		).toEqual(['Terminal', 'Terminal', 'SubEquipment', 'EqFunction'])
	})

	it('GIVEN a parent with no later child boundary WHEN inserting an ordered child THEN no reference is returned', () => {
		const xmlDocument = document.implementation.createDocument(
			null,
			'SCL',
			null
		)
		const parent = xmlDocument.createElement('ConductingEquipment')
		parent.append(xmlDocument.createElement('Terminal'))

		expect(
			getSchemaInsertBeforeReference({
				elementName: 'Terminal',
				parentTypeWrapper: parent
			})
		).toBeNull()
	})

	it('GIVEN an element family without schema boundaries WHEN inserting it THEN no reference is returned', () => {
		const xmlDocument = document.implementation.createDocument(
			null,
			'SCL',
			null
		)
		const parent = xmlDocument.createElement('Bay')

		expect(
			getSchemaInsertBeforeReference({
				elementName: REF_FAMILY.function,
				parentTypeWrapper: parent
			})
		).toBeNull()
	})
})
