import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mocks } = vi.hoisted(() => ({
	mocks: {
		attributeMappingError: null as unknown,
		pluginLocalStore: {
			currentEdition: 'ed2Rev1',
			currentUnstableRevision: 'IEC61850-90-30',
			currentDefinition: {
				bay: {
					tag: 'Bay',
					attributes: {
						description: { required: false },
						name: { required: true },
						uuid: { required: true }
					}
				},
				conductingEquipment: {
					tag: 'ConductingEquipment',
					attributes: {
						name: { required: true },
						type: { required: true },
						uuid: { required: true }
					}
				},
				function: {
					tag: 'Function',
					attributes: {
						name: { required: true },
						uuid: { required: true }
					}
				},
				generalEquipment: {
					tag: 'GeneralEquipment',
					attributes: {
						name: { required: true },
						uuid: { required: true }
					}
				},
				lNodeType: {
					tag: 'LNodeType',
					attributes: {
						id: { required: true },
						lnClass: { required: true }
					}
				}
			}
		},
		typeElementsStore: {
			mapRefTagNameToRefFamily: {
				FunctionRef: 'function',
				LNode: 'lNode'
			}
		}
	}
}))

vi.mock('@/headless/stores', () => ({
	pluginLocalStore: mocks.pluginLocalStore,
	typeElementsStore: mocks.typeElementsStore
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	findAllCustomElementBySelector: ({
		selector,
		root
	}: {
		selector: string
		root: Element
	}) => Array.from(root.querySelectorAll(selector)),
	findAllStandardElementsByTagNameNS: ({
		namespace,
		tagName,
		root
	}: {
		namespace: string
		tagName: string
		root: Element
	}) => Array.from(root.getElementsByTagNameNS(namespace, tagName)),
	namedNodeMapAttributesToPlainObject: ({
		attributes
	}: {
		attributes: NamedNodeMap
	}) => {
		if (mocks.attributeMappingError !== null)
			throw mocks.attributeMappingError

		return Object.fromEntries(
			Array.from(attributes, ({ name, value }) => [name, value])
		)
	},
	typeGuard: {
		isPropertyOfObject: (
			property: PropertyKey,
			object: Record<PropertyKey, unknown>
		) => Object.hasOwn(object, property)
	}
}))

import { TYPE_FAMILY } from '@/headless/constants'
import type { TypeRawElement } from '@/headless/stores'
import { getAndMapTypeElements } from './consolidate-types.helper'

let xmlDocument: XMLDocument

beforeEach(() => {
	xmlDocument = document.implementation.createDocument(
		'http://www.iec.ch/61850/2003/SCL',
		'SCL',
		null
	)
	mocks.attributeMappingError = null
})

afterEach(() => {
	vi.restoreAllMocks()
})

function createType(tagName: string, attributes: Record<string, string>) {
	const element = xmlDocument.createElementNS(
		xmlDocument.documentElement.namespaceURI,
		tagName
	)
	for (const [name, value] of Object.entries(attributes))
		element.setAttribute(name, value)
	return element
}

function mapElements<Family extends keyof typeof TYPE_FAMILY>(
	family: Family,
	elements: Element[] | undefined,
	includeRoot = true
) {
	return getAndMapTypeElements({
		family: TYPE_FAMILY[family],
		typeElements: elements as
			| TypeRawElement<(typeof TYPE_FAMILY)[Family]>[]
			| undefined,
		rootElement: includeRoot ? xmlDocument.documentElement : undefined
	})
}

describe('getAndMapTypeElements', () => {
	it('GIVEN a valid Bay type WHEN the element is mapped THEN it is available without a corruption reason', () => {
		const bay = createType('Bay', {
			description: 'Optional value',
			name: 'Bay 1',
			uuid: 'bay-1'
		})
		bay.append(xmlDocument.createElement('UnrecognizedRef'))

		const result = mapElements(TYPE_FAMILY.bay, [bay])

		expect(result['bay-1']).toMatchObject({
			parameters: { label: 'Bay 1' }
		})
		expect(result['bay-1']).not.toHaveProperty('corruptionReason')
	})

	it('GIVEN a conducting equipment type missing a required attribute and a valid type WHEN the elements are mapped THEN the invalid element is retained and the valid element remains usable', () => {
		const invalidEquipment = createType('ConductingEquipment', {
			name: 'Broken breaker',
			uuid: 'broken'
		})
		const validEquipment = createType('ConductingEquipment', {
			name: 'Circuit breaker',
			type: 'CBR',
			uuid: 'valid'
		})

		const result = mapElements(TYPE_FAMILY.conductingEquipment, [
			invalidEquipment,
			validEquipment
		])

		expect(result.broken.corruptionReason).toContain('type')
		expect(result.valid.parameters.label).toBe('Circuit breaker')
		expect(result.valid).not.toHaveProperty('corruptionReason')
	})

	it('GIVEN a type without its required identifier WHEN the elements are mapped THEN it remains visible under a stable fallback key and is marked invalid', () => {
		const invalidBay = createType('Bay', { name: 'Nameless ID' })

		const result = mapElements(TYPE_FAMILY.bay, [invalidBay])

		expect(result['invalid-bay-0']).toMatchObject({
			corruptionReason: expect.stringContaining('uuid'),
			parameters: { label: 'Nameless ID' }
		})
	})

	it('GIVEN a type without a name WHEN the element is mapped THEN its ID is used as the label', () => {
		const invalidBay = createType('Bay', {
			id: 'legacy-name',
			uuid: 'bay-1'
		})

		const result = mapElements(TYPE_FAMILY.bay, [invalidBay])

		expect(result['bay-1'].parameters.label).toBe('legacy-name')
	})

	it('GIVEN a type without a name or alternate ID WHEN the element is mapped THEN an invalid-element label is used', () => {
		const invalidBay = createType('Bay', { uuid: 'bay-1' })

		const result = mapElements(TYPE_FAMILY.bay, [invalidBay])

		expect(result['bay-1'].parameters.label).toBe('Invalid SCL element')
	})

	it('GIVEN a type containing a reference without a target ID and a valid sibling WHEN the elements are mapped THEN only the malformed type is marked invalid', () => {
		const invalidBay = createType('Bay', {
			name: 'Bay with broken reference',
			uuid: 'broken-bay'
		})
		invalidBay.append(xmlDocument.createElement('FunctionRef'))
		const validBay = createType('Bay', {
			name: 'Valid Bay',
			uuid: 'valid-bay'
		})

		const result = mapElements(TYPE_FAMILY.bay, [invalidBay, validBay])

		expect(result['broken-bay'].corruptionReason).toBe(
			'No id found for ref element'
		)
		expect(result['valid-bay'].corruptionReason).toBeUndefined()
	})

	it('GIVEN a type with repeated valid references WHEN the element is mapped THEN references are retained with increasing occurrences', () => {
		const bay = createType('Bay', { name: 'Bay 1', uuid: 'bay-1' })
		xmlDocument.documentElement.append(
			createType('Function', { name: 'Protection', uuid: 'function-1' })
		)
		const firstRef = xmlDocument.createElement('FunctionRef')
		firstRef.setAttribute('templateUuid', 'function-1')
		const secondRef = xmlDocument.createElement('FunctionRef')
		secondRef.setAttribute('templateUuid', 'function-1')
		bay.append(firstRef, secondRef)

		const result = mapElements(TYPE_FAMILY.bay, [bay])
		const refs = Object.values(result['bay-1'].refs.function)

		expect(refs.map((ref) => ref.occurrence)).toEqual([1, 2])
	})

	it('GIVEN a Function type with references WHEN the element is mapped THEN its reference family and LNode references are resolved', () => {
		const functionType = createType('Function', {
			name: 'Protection',
			uuid: 'function-1'
		})
		const functionRef = xmlDocument.createElement('FunctionRef')
		functionRef.setAttribute('templateUuid', 'function-1')
		const lNodeRef = xmlDocument.createElement('LNode')
		lNodeRef.setAttribute('lnType', 'ln-type-1')
		functionType.append(functionRef, lNodeRef)
		xmlDocument.documentElement.append(
			functionType,
			createType('LNodeType', { id: 'ln-type-1', lnClass: 'PTOC' })
		)

		const result = mapElements(TYPE_FAMILY.function, [functionType])

		expect(result['function-1'].parameters.refFamily).toBe('function')
		expect(Object.values(result['function-1'].refs.lNode)[0]).toMatchObject(
			{
				source: { id: 'ln-type-1', family: 'lNodeType' }
			}
		)
	})

	it('GIVEN CB_CTRL references an undefined CILO type while its CSWI type exists WHEN mapped THEN CB_CTRL is marked invalid with the missing LNodeType ID', () => {
		const cbCtrl = createType('Function', {
			desc: 'Leistungschaltersteuerfunktion',
			name: 'CB_CTRL',
			uuid: '86979b83-db51-4741-b859-fc0b649601f6'
		})
		const missingCiloRef = xmlDocument.createElement('LNode')
		missingCiloRef.setAttribute('lnType', 'TBW_CILO_eba5115e8513')
		missingCiloRef.setAttribute('lnClass', 'CILO')
		const validCswiRef = xmlDocument.createElement('LNode')
		validCswiRef.setAttribute('lnType', 'TBW_CSWI_90b0317d1bca')
		validCswiRef.setAttribute('lnClass', 'CSWI')
		cbCtrl.append(missingCiloRef, validCswiRef)
		xmlDocument.documentElement.append(
			cbCtrl,
			createType('LNodeType', {
				id: 'TBW_CILO_21831adffa5d',
				lnClass: 'CILO'
			}),
			createType('LNodeType', {
				id: 'TBW_CSWI_90b0317d1bca',
				lnClass: 'CSWI'
			})
		)

		const result = mapElements(TYPE_FAMILY.function, [cbCtrl])

		expect(result['86979b83-db51-4741-b859-fc0b649601f6']).toMatchObject({
			corruptionReason:
				'No LNodeType found with id "TBW_CILO_eba5115e8513"',
			parameters: { label: 'CB_CTRL' },
			refs: {
				lNode: {}
			}
		})
	})

	it('GIVEN a Function type without references WHEN the element is mapped THEN its reference family remains undefined', () => {
		const functionType = createType('Function', {
			name: 'Protection',
			uuid: 'function-1'
		})

		const result = mapElements(TYPE_FAMILY.function, [functionType])

		expect(result['function-1'].parameters.refFamily).toBeUndefined()
	})

	it('GIVEN a Function type without a root element WHEN the element is mapped THEN it is retained as invalid', () => {
		const functionType = createType('Function', {
			name: 'Protection',
			uuid: 'function-1'
		})

		const result = mapElements(TYPE_FAMILY.function, [functionType], false)

		expect(result['function-1'].corruptionReason).toBe('No root element')
	})

	it('GIVEN a Function type whose matching element is not a known reference WHEN the element is mapped THEN its reference family remains undefined', () => {
		const functionType = createType('Function', {
			name: 'Protection',
			uuid: 'function-1'
		})
		const unknownRef = xmlDocument.createElement('UnknownRef')
		unknownRef.setAttribute('templateUuid', 'function-1')
		xmlDocument.documentElement.append(unknownRef)

		const result = mapElements(TYPE_FAMILY.function, [functionType])

		expect(result['function-1'].parameters.refFamily).toBeUndefined()
	})

	it('GIVEN an LNode type WHEN the element is mapped THEN its required ID is retained and its reference family is assigned', () => {
		const lNodeType = createType('LNodeType', {
			id: 'ln-type-1',
			lnClass: 'PTOC'
		})
		xmlDocument.documentElement.append(lNodeType)

		const result = mapElements(TYPE_FAMILY.lNodeType, [lNodeType])

		expect(result['ln-type-1'].attributes.id).toBe('ln-type-1')
		expect(result['ln-type-1'].parameters.refFamily).toBe('lNode')
	})

	it('GIVEN duplicate type identifiers WHEN the elements are mapped THEN both elements are retained and marked invalid', () => {
		const firstBay = createType('Bay', {
			name: 'First Bay',
			uuid: 'invalid-bay-1'
		})
		const secondBay = createType('Bay', {
			name: 'Second Bay',
			uuid: 'invalid-bay-1'
		})

		const result = mapElements(TYPE_FAMILY.bay, [firstBay, secondBay])

		expect(Object.keys(result)).toHaveLength(2)
		expect(result['invalid-bay-1'].corruptionReason).toContain(
			'Duplicate uuid'
		)
		expect(
			Object.values(result).find(
				(element) => element.parameters.label === 'Second Bay'
			)?.corruptionReason
		).toContain('Duplicate uuid')
	})

	it('GIVEN no type elements WHEN the elements are mapped THEN an empty collection is returned', () => {
		expect(mapElements(TYPE_FAMILY.bay, [])).toEqual({})
	})

	it('GIVEN an undefined type-element collection WHEN the elements are mapped THEN an empty collection is returned', () => {
		expect(mapElements(TYPE_FAMILY.bay, undefined)).toEqual({})
	})

	it('GIVEN a mapping failure that is not an Error WHEN the element is mapped THEN a clear fallback corruption reason is returned', () => {
		mocks.attributeMappingError = 'non-error mapping failure'
		const bay = createType('Bay', { name: 'Bay 1', uuid: 'bay-1' })

		const result = mapElements(TYPE_FAMILY.bay, [bay])

		expect(result['bay-1'].corruptionReason).toBe('Unable to read Bay')
	})
})
