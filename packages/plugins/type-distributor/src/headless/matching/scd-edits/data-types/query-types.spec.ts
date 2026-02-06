import { describe, it, expect, beforeEach } from 'vitest'
import {
	queryDOTypesFromLNodeType,
	queryTypesFromDOType,
	queryTypesFromDAType
} from './query-types'

describe('type-collectors', () => {
	let mockDocument: Document

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<root xmlns="http://www.iec.ch/61850/2003/SCL"></root>',
			'application/xml'
		)
	})

	describe('queryDOTypesFromLNodeType', () => {
		describe('GIVEN an LNodeType with no DO elements', () => {
			describe('WHEN collectDOTypesFromLNodeType is called', () => {
				it('THEN should return an empty array', () => {
					// GIVEN
					const lnodeType = mockDocument.createElement('LNodeType')
					lnodeType.setAttribute('id', 'TestLN')

					// WHEN
					const result = queryDOTypesFromLNodeType(lnodeType)

					// THEN
					expect(result).toEqual([])
				})
			})
		})

		describe('GIVEN an LNodeType with DO elements', () => {
			describe('WHEN collectDOTypesFromLNodeType is called', () => {
				it('THEN should return array with all DO type references', () => {
					// GIVEN
					const lnodeType = mockDocument.createElement('LNodeType')
					lnodeType.setAttribute('id', 'TestLN')

					const do1 = mockDocument.createElement('DO')
					do1.setAttribute('name', 'Mod')
					do1.setAttribute('type', 'MOD_Type1')

					const do2 = mockDocument.createElement('DO')
					do2.setAttribute('name', 'Beh')
					do2.setAttribute('type', 'BEH_Type1')

					lnodeType.appendChild(do1)
					lnodeType.appendChild(do2)

					// WHEN
					const result = queryDOTypesFromLNodeType(lnodeType)

					// THEN
					expect(result).toEqual(['MOD_Type1', 'BEH_Type1'])
				})

				it('THEN should handle multiple DO elements', () => {
					// GIVEN
					const lnodeType = mockDocument.createElement('LNodeType')

					for (let i = 1; i <= 5; i++) {
						const doElement = mockDocument.createElement('DO')
						doElement.setAttribute('name', `DO${i}`)
						doElement.setAttribute('type', `Type${i}`)
						lnodeType.appendChild(doElement)
					}

					// WHEN
					const result = queryDOTypesFromLNodeType(lnodeType)

					// THEN
					expect(result).toHaveLength(5)
					expect(result).toEqual([
						'Type1',
						'Type2',
						'Type3',
						'Type4',
						'Type5'
					])
				})
			})
		})

		describe('GIVEN an LNodeType with DO elements without type attribute', () => {
			describe('WHEN collectDOTypesFromLNodeType is called', () => {
				it('THEN should skip elements without type attribute', () => {
					// GIVEN
					const lnodeType = mockDocument.createElement('LNodeType')

					const do1 = mockDocument.createElement('DO')
					do1.setAttribute('name', 'Mod')
					do1.setAttribute('type', 'MOD_Type1')

					const do2 = mockDocument.createElement('DO')
					do2.setAttribute('name', 'Beh')

					lnodeType.appendChild(do1)
					lnodeType.appendChild(do2)

					// WHEN
					const result = queryDOTypesFromLNodeType(lnodeType)

					// THEN
					expect(result).toEqual(['MOD_Type1'])
				})
			})
		})
	})

	describe('queryTypesFromDOType', () => {
		describe('GIVEN a DOType with no DA elements', () => {
			describe('WHEN collectTypesFromDOType is called', () => {
				it('THEN should return empty sets', () => {
					// GIVEN
					const doType = mockDocument.createElement('DOType')
					doType.setAttribute('id', 'TestDO')

					// WHEN
					const result = queryTypesFromDOType(doType)

					// THEN
					expect(result.daTypeIds.size).toBe(0)
					expect(result.enumTypeIds.size).toBe(0)
				})
			})
		})

		describe('GIVEN a DOType with DA elements of type Struct', () => {
			describe('WHEN collectTypesFromDOType is called', () => {
				it('THEN should collect DA type IDs', () => {
					// GIVEN
					const doType = mockDocument.createElement('DOType')

					const da1 = mockDocument.createElement('DA')
					da1.setAttribute('name', 'origin')
					da1.setAttribute('bType', 'Struct')
					da1.setAttribute('type', 'Originator_Type')

					const da2 = mockDocument.createElement('DA')
					da2.setAttribute('name', 'ctlModel')
					da2.setAttribute('bType', 'Struct')
					da2.setAttribute('type', 'CtlModel_Type')

					doType.appendChild(da1)
					doType.appendChild(da2)

					// WHEN
					const result = queryTypesFromDOType(doType)

					// THEN
					expect(result.daTypeIds.size).toBe(2)
					expect(result.daTypeIds.has('Originator_Type')).toBe(true)
					expect(result.daTypeIds.has('CtlModel_Type')).toBe(true)
					expect(result.enumTypeIds.size).toBe(0)
				})
			})
		})

		describe('GIVEN a DOType with DA elements of type Enum', () => {
			describe('WHEN collectTypesFromDOType is called', () => {
				it('THEN should collect Enum type IDs', () => {
					// GIVEN
					const doType = mockDocument.createElement('DOType')

					const da1 = mockDocument.createElement('DA')
					da1.setAttribute('name', 'ctlModel')
					da1.setAttribute('bType', 'Enum')
					da1.setAttribute('type', 'CtlModelKind')

					const da2 = mockDocument.createElement('DA')
					da2.setAttribute('name', 'origin')
					da2.setAttribute('bType', 'Enum')
					da2.setAttribute('type', 'OriginatorCategory')

					doType.appendChild(da1)
					doType.appendChild(da2)

					// WHEN
					const result = queryTypesFromDOType(doType)

					// THEN
					expect(result.enumTypeIds.size).toBe(2)
					expect(result.enumTypeIds.has('CtlModelKind')).toBe(true)
					expect(result.enumTypeIds.has('OriginatorCategory')).toBe(
						true
					)
					expect(result.daTypeIds.size).toBe(0)
				})
			})
		})

		describe('GIVEN a DOType with mixed DA elements', () => {
			describe('WHEN collectTypesFromDOType is called', () => {
				it('THEN should collect both DAType and EnumType IDs', () => {
					// GIVEN
					const doType = mockDocument.createElement('DOType')

					const da1 = mockDocument.createElement('DA')
					da1.setAttribute('name', 'origin')
					da1.setAttribute('bType', 'Struct')
					da1.setAttribute('type', 'Originator_Type')

					const da2 = mockDocument.createElement('DA')
					da2.setAttribute('name', 'ctlModel')
					da2.setAttribute('bType', 'Enum')
					da2.setAttribute('type', 'CtlModelKind')

					const da3 = mockDocument.createElement('DA')
					da3.setAttribute('name', 'sboTimeout')
					da3.setAttribute('bType', 'INT32U')

					doType.appendChild(da1)
					doType.appendChild(da2)
					doType.appendChild(da3)

					// WHEN
					const result = queryTypesFromDOType(doType)

					// THEN
					expect(result.daTypeIds.size).toBe(1)
					expect(result.daTypeIds.has('Originator_Type')).toBe(true)
					expect(result.enumTypeIds.size).toBe(1)
					expect(result.enumTypeIds.has('CtlModelKind')).toBe(true)
				})
			})
		})
	})

	describe('queryTypesFromDAType', () => {
		describe('GIVEN a DAType with no BDA elements', () => {
			describe('WHEN collectTypesFromDAType is called', () => {
				it('THEN should return empty sets', () => {
					// GIVEN
					const daType = mockDocument.createElement('DAType')
					daType.setAttribute('id', 'TestDA')

					// WHEN
					const result = queryTypesFromDAType(daType)

					// THEN
					expect(result.daTypeIds.size).toBe(0)
					expect(result.enumTypeIds.size).toBe(0)
				})
			})
		})

		describe('GIVEN a DAType with BDA elements of type Struct', () => {
			describe('WHEN collectTypesFromDAType is called', () => {
				it('THEN should collect nested DAType IDs', () => {
					// GIVEN
					const daType = mockDocument.createElement('DAType')

					const bda1 = mockDocument.createElement('BDA')
					bda1.setAttribute('name', 'origin')
					bda1.setAttribute('bType', 'Struct')
					bda1.setAttribute('type', 'Nested_Type1')

					const bda2 = mockDocument.createElement('BDA')
					bda2.setAttribute('name', 'ctlModel')
					bda2.setAttribute('bType', 'Struct')
					bda2.setAttribute('type', 'Nested_Type2')

					daType.appendChild(bda1)
					daType.appendChild(bda2)

					// WHEN
					const result = queryTypesFromDAType(daType)

					// THEN
					expect(result.daTypeIds.size).toBe(2)
					expect(result.daTypeIds.has('Nested_Type1')).toBe(true)
					expect(result.daTypeIds.has('Nested_Type2')).toBe(true)
					expect(result.enumTypeIds.size).toBe(0)
				})
			})
		})

		describe('GIVEN a DAType with BDA elements of type Enum', () => {
			describe('WHEN collectTypesFromDAType is called', () => {
				it('THEN should collect Enum type IDs', () => {
					// GIVEN
					const daType = mockDocument.createElement('DAType')

					const bda1 = mockDocument.createElement('BDA')
					bda1.setAttribute('name', 'ctlModel')
					bda1.setAttribute('bType', 'Enum')
					bda1.setAttribute('type', 'CtlModelKind')

					daType.appendChild(bda1)

					// WHEN
					const result = queryTypesFromDAType(daType)

					// THEN
					expect(result.enumTypeIds.size).toBe(1)
					expect(result.enumTypeIds.has('CtlModelKind')).toBe(true)
					expect(result.daTypeIds.size).toBe(0)
				})
			})
		})

		describe('GIVEN a DAType with mixed BDA elements', () => {
			describe('WHEN collectTypesFromDAType is called', () => {
				it('THEN should collect both nested DAType and EnumType IDs', () => {
					// GIVEN
					const daType = mockDocument.createElement('DAType')

					const bda1 = mockDocument.createElement('BDA')
					bda1.setAttribute('name', 'nestedStruct')
					bda1.setAttribute('bType', 'Struct')
					bda1.setAttribute('type', 'NestedStruct_Type')

					const bda2 = mockDocument.createElement('BDA')
					bda2.setAttribute('name', 'enumField')
					bda2.setAttribute('bType', 'Enum')
					bda2.setAttribute('type', 'EnumKind')

					const bda3 = mockDocument.createElement('BDA')
					bda3.setAttribute('name', 'simpleField')
					bda3.setAttribute('bType', 'INT32')

					daType.appendChild(bda1)
					daType.appendChild(bda2)
					daType.appendChild(bda3)

					// WHEN
					const result = queryTypesFromDAType(daType)

					// THEN
					expect(result.daTypeIds.size).toBe(1)
					expect(result.daTypeIds.has('NestedStruct_Type')).toBe(true)
					expect(result.enumTypeIds.size).toBe(1)
					expect(result.enumTypeIds.has('EnumKind')).toBe(true)
				})
			})
		})

		describe('GIVEN a DAType with BDA elements without type attribute', () => {
			describe('WHEN collectTypesFromDAType is called', () => {
				it('THEN should skip elements without type attribute', () => {
					// GIVEN
					const daType = mockDocument.createElement('DAType')

					const bda1 = mockDocument.createElement('BDA')
					bda1.setAttribute('name', 'nestedStruct')
					bda1.setAttribute('bType', 'Struct')
					bda1.setAttribute('type', 'NestedStruct_Type')

					const bda2 = mockDocument.createElement('BDA')
					bda2.setAttribute('name', 'noType')
					bda2.setAttribute('bType', 'Struct')

					daType.appendChild(bda1)
					daType.appendChild(bda2)

					// WHEN
					const result = queryTypesFromDAType(daType)

					// THEN
					expect(result.daTypeIds.size).toBe(1)
					expect(result.daTypeIds.has('NestedStruct_Type')).toBe(true)
				})
			})
		})
	})

	describe('type collector integration', () => {
		describe('GIVEN a complete type hierarchy', () => {
			describe('WHEN collecting types at each level', () => {
				it('THEN should handle multi-level nesting correctly', () => {
					// GIVEN
					const lnodeType = mockDocument.createElement('LNodeType')
					const doElement = mockDocument.createElement('DO')
					doElement.setAttribute('type', 'DO_Type1')
					lnodeType.appendChild(doElement)

					const doType = mockDocument.createElement('DOType')
					doType.setAttribute('id', 'DO_Type1')
					const da = mockDocument.createElement('DA')
					da.setAttribute('bType', 'Struct')
					da.setAttribute('type', 'DA_Type1')
					doType.appendChild(da)

					const daType = mockDocument.createElement('DAType')
					daType.setAttribute('id', 'DA_Type1')
					const bda = mockDocument.createElement('BDA')
					bda.setAttribute('bType', 'Enum')
					bda.setAttribute('type', 'Enum_Type1')
					daType.appendChild(bda)

					// WHEN
					const doTypes = queryDOTypesFromLNodeType(lnodeType)
					const fromDO = queryTypesFromDOType(doType)
					const fromDA = queryTypesFromDAType(daType)

					// THEN
					expect(doTypes).toEqual(['DO_Type1'])
					expect(fromDO.daTypeIds.has('DA_Type1')).toBe(true)
					expect(fromDA.enumTypeIds.has('Enum_Type1')).toBe(true)
				})
			})
		})
	})
})
