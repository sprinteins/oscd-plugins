import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mocks } = vi.hoisted(() => {
	const typeElement = (label: string) => ({
		parameters: {
			label,
		},
	})

	return {
		mocks: {
			createNewType: vi.fn(),
			deleteTypeAndRefs: vi.fn(),
			createNewRef: vi.fn(),
			deleteRef: vi.fn(),
			duplicateElement: vi.fn(),
			getTypeNextOccurrence: vi.fn(() => 3),
			getElementsWithSameNameBase: vi.fn(() => []),
			computeNameWithOptionalSuffix: vi.fn(
				(
					_family: 'bay' | 'function',
					inputValue: string | undefined,
					defaultPrefix: string,
					nextOccurrence: number,
				) =>
					`${inputValue?.trim() || defaultPrefix}_${nextOccurrence}`,
			),
			getAndMapTypeElements: vi.fn(
				({ family }: { family: string }) => {
					const typeElementsByFamily: Record<
						string,
						Record<string, unknown>
					> = {
						bay: {
							bay1: typeElement('Main Bay'),
							bay2: typeElement('Secondary Bay'),
						},
						generalEquipment: {
							generalEquipment1: typeElement('Control Cabinet'),
						},
						conductingEquipment: {
							conductingEquipment1: typeElement('Circuit Breaker'),
						},
						function: {
							function1: typeElement('Protection Function'),
						},
						lNodeType: {
							lNodeType1: typeElement('PTOC'),
						},
					}

					return typeElementsByFamily[family] ?? {}
				},
			),
			pluginLocalStore: {
				bayTypeElements: [],
				bayTemplateSubElements: {
					generalEquipment: [],
					conductingEquipment: [],
					function: [],
				},
				dataTypeTemplatesSubElements: {
					lNodeType: [],
				},
				rootElement: document.createElement('SCL'),
				currentDefinition: {
					generalEquipment: { tag: 'GeneralEquipmentRef' },
					conductingEquipment: {
						tag: 'ConductingEquipmentRef',
					},
					function: { tag: 'FunctionRef' },
					eqFunction: { tag: 'EqFunctionRef' },
					lNode: { tag: 'LNode' },
				},
			},
			importsStore: {
				loadedTypeElementsPerFamily: {
					bay: {
						all: {
							importedBay1: typeElement('Imported Bay'),
						},
						toUpdate: {},
						toAdd: {
							importedBay1: typeElement('Imported Bay'),
						},
					},
					generalEquipment: {
						all: {},
						toUpdate: {},
						toAdd: {},
					},
					conductingEquipment: {
						all: {},
						toUpdate: {},
						toAdd: {},
					},
					function: {
						all: {
							importedFunction1: typeElement(
								'Imported Function',
							),
						},
						toUpdate: {},
						toAdd: {},
					},
					lNodeType: {
						all: {},
						toUpdate: {},
						toAdd: {},
					},
				},
			},
		},
	}
})

vi.mock('@/headless/stores', () => ({
	importsStore: mocks.importsStore,
	pluginLocalStore: mocks.pluginLocalStore,
}))

vi.mock('@/headless/constants', () => ({
	TYPE_FAMILY: {
		bay: 'bay',
		generalEquipment: 'generalEquipment',
		conductingEquipment: 'conductingEquipment',
		function: 'function',
		lNodeType: 'lNodeType',
	},
	REF_FAMILY: {
		generalEquipment: 'generalEquipment',
		conductingEquipment: 'conductingEquipment',
		function: 'function',
		eqFunction: 'eqFunction',
		lNode: 'lNode',
	},
	COLUMNS: {
		bayType: 'bayType',
		equipmentType: 'equipmentType',
		functionType: 'functionType',
		lNodeType: 'lNodeType',
	},
	EQUIPMENTS: {},
}))

vi.mock('./consolidate-types.helper', () => ({
	getAndMapTypeElements: mocks.getAndMapTypeElements,
}))

vi.mock('./type-crud-operation.helper', () => ({
	createNewType: mocks.createNewType,
	deleteTypeAndRefs: mocks.deleteTypeAndRefs,
}))

vi.mock('./ref-crud-operation.helper', () => ({
	createNewRef: mocks.createNewRef,
	deleteRef: mocks.deleteRef,
}))

vi.mock('./type-naming.helper', () => ({
	getTypeNextOccurrence: mocks.getTypeNextOccurrence,
	getElementsWithSameNameBase: mocks.getElementsWithSameNameBase,
	computeNameWithOptionalSuffix: mocks.computeNameWithOptionalSuffix,
}))

vi.mock('./filter.helper', () => ({
	getFilteredTypeElementByIds: (
		filter: string,
		typeElements: Record<
			string,
			{ parameters: { label: string } }
		>,
	) =>
		Object.fromEntries(
			Object.entries(typeElements).filter(([, typeElement]) =>
				typeElement.parameters.label
					.toLowerCase()
					.includes(filter.toLowerCase()),
			),
		),
}))

vi.mock(
	'@/headless/stores/type-elements/common-crud-operation.helper',
	() => ({
		duplicateElement: mocks.duplicateElement,
	}),
)

import { typeElementsStore } from './store.svelte'

beforeEach(() => {
	vi.clearAllMocks()

	typeElementsStore.filtersByColumns.bayType = ''
	typeElementsStore.filtersByColumns.equipmentType = ''
	typeElementsStore.filtersByColumns.functionType = ''
	typeElementsStore.filtersByColumns.lNodeType = ''

	typeElementsStore.newTypeNameInputValueByColumnKey.bayType = ''
	typeElementsStore.newTypeNameInputValueByColumnKey.functionType = ''
})

describe('typeElementsStore columns integration', () => {
	it('groups mapped type elements into the expected columns', () => {
        const bayColumn = typeElementsStore.columns.bayType as {
            groupedTypeElements: {
                bay: Record<string, unknown>
            }
        }

        const equipmentColumn =
        typeElementsStore.columns.equipmentType as unknown as {
            groupedTypeElements: {
                generalEquipment: Record<string, unknown>
                conductingEquipment: Record<string, unknown>
            }
        }

        const functionColumn = typeElementsStore.columns.functionType as {
            groupedTypeElements: {
                function: Record<string, unknown>
            }
        }

        const lNodeColumn = typeElementsStore.columns.lNodeType as {
            groupedTypeElements: {
                lNodeType: Record<string, unknown>
            }
        }

        expect(
            Object.keys(bayColumn.groupedTypeElements.bay),
        ).toEqual(['bay1', 'bay2'])

        expect(
            Object.keys(equipmentColumn.groupedTypeElements.generalEquipment),
        ).toEqual(['generalEquipment1'])

        expect(
            Object.keys(
                equipmentColumn.groupedTypeElements.conductingEquipment,
            ),
        ).toEqual(['conductingEquipment1'])

        expect(
            Object.keys(functionColumn.groupedTypeElements.function),
        ).toEqual(['function1'])

        expect(
            Object.keys(lNodeColumn.groupedTypeElements.lNodeType),
        ).toEqual(['lNodeType1'])
    })

    it('includes imported type elements in the matching column', () => {
        const bayColumn = typeElementsStore.columns.bayType as {
            importedTypeElements: {
                bay: {
                    all: Record<string, unknown>
                }
            }
        }

        const functionColumn =
            typeElementsStore.columns.functionType as unknown as {
                importedTypeElements: {
                    function: {
                        all: Record<string, unknown>
                    }
                }
            }

        expect(
            Object.keys(bayColumn.importedTypeElements.bay.all),
        ).toEqual(['importedBay1'])

        expect(
            Object.keys(functionColumn.importedTypeElements.function.all),
        ).toEqual(['importedFunction1'])
    })

	it('filters current and imported bay types with the same filter value', () => {
		typeElementsStore.filtersByColumns.bayType = 'main'

		expect(
			Object.keys(
				typeElementsStore.columns.bayType.groupedTypeElements.bay,
			),
		).toEqual(['bay1'])

		expect(
			Object.keys(
				typeElementsStore.columns.bayType.importedTypeElements.bay
					.all,
			),
		).toEqual([])
	})

	it('filters imported bay types independently from current type elements', () => {
		typeElementsStore.filtersByColumns.bayType = 'imported'

		expect(
			Object.keys(
				typeElementsStore.columns.bayType.groupedTypeElements.bay,
			),
		).toEqual([])

		expect(
			Object.keys(
				typeElementsStore.columns.bayType.importedTypeElements.bay
					.all,
			),
		).toEqual(['importedBay1'])
	})
})

describe('typeElementsStore name calculation integration', () => {
	it('uses the Bay default prefix and the next occurrence', () => {
		expect(typeElementsStore.newComputedTypeName.bay).toBe('Bay_3')
	})

	it('updates the computed Bay name after user input changes', () => {
		typeElementsStore.newTypeNameInputValueByColumnKey.bayType =
			'  Custom Bay  '

		expect(typeElementsStore.newComputedTypeName.bay).toBe(
			'Custom Bay_3',
		)
	})

	it('uses the Function default prefix and the next occurrence', () => {
		expect(typeElementsStore.newComputedTypeName.function).toBe(
			'Func_3',
		)
	})

	it('updates the computed Function name after user input changes', () => {
		typeElementsStore.newTypeNameInputValueByColumnKey.functionType =
			'Protection'

		expect(typeElementsStore.newComputedTypeName.function).toBe(
			'Protection_3',
		)
	})
})

describe('typeElementsStore helper proxies', () => {
	it('exposes CRUD helpers through the store', () => {
		expect(typeElementsStore.createNewType).toBe(mocks.createNewType)
		expect(typeElementsStore.deleteTypeAndRefs).toBe(
			mocks.deleteTypeAndRefs,
		)
		expect(typeElementsStore.createNewRef).toBe(mocks.createNewRef)
		expect(typeElementsStore.deleteRef).toBe(mocks.deleteRef)
	})

	it('exposes shared naming and duplicate helpers through the store', () => {
		expect(typeElementsStore.getTypeNextOccurrence).toBe(
			mocks.getTypeNextOccurrence,
		)
		expect(typeElementsStore.getElementsWithSameNameBase).toBe(
			mocks.getElementsWithSameNameBase,
		)
		expect(typeElementsStore.duplicateElement).toBe(
			mocks.duplicateElement,
		)
	})
})