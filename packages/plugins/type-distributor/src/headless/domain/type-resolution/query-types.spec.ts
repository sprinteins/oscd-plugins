import { describe, it, expect } from 'vitest'
import {
	queryTypesFromDOType,
	queryTypesFromDAType,
	queryDOTypesFromLNodeType
} from './query-types'

function makeElement(xml: string): Element {
	const doc = new DOMParser().parseFromString(xml, 'application/xml')
	return doc.documentElement
}

describe('queryDOTypesFromLNodeType', () => {
	it('GIVEN a lNodeType with DO elements WHEN called THEN returns all their type attributes', () => {
		const lNodeType = makeElement(`
			<LNodeType id="XCBR1">
				<DO name="Mod" type="ENC_Mod"/>
				<DO name="Beh" type="ENS_Beh"/>
			</LNodeType>
		`)
		expect(queryDOTypesFromLNodeType(lNodeType)).toEqual([
			'ENC_Mod',
			'ENS_Beh'
		])
	})

	it('GIVEN a DO has no type attribute WHEN called THEN it is omitted from the result', () => {
		const lNodeType = makeElement(`
			<LNodeType id="XCBR1">
				<DO name="Mod" type="ENC_Mod"/>
				<DO name="NoType"/>
			</LNodeType>
		`)
		expect(queryDOTypesFromLNodeType(lNodeType)).toEqual(['ENC_Mod'])
	})

	it('GIVEN lNodeType has no DO children WHEN called THEN returns an empty array', () => {
		const lNodeType = makeElement('<LNodeType id="Empty"/>')
		expect(queryDOTypesFromLNodeType(lNodeType)).toHaveLength(0)
	})
})

describe('queryTypesFromDOType', () => {
	it('GIVEN a DA with bType="Struct" WHEN called THEN its type is added to daTypeIds', () => {
		const doType = makeElement(`
			<DOType id="ENC_Mod">
				<DA name="ctlModel" bType="Enum" type="CtlModels"/>
				<DA name="origin" bType="Struct" type="Originator"/>
			</DOType>
		`)
		const { daTypeIds, enumTypeIds } = queryTypesFromDOType(doType)
		expect(daTypeIds.has('Originator')).toBe(true)
		expect(enumTypeIds.has('CtlModels')).toBe(true)
	})

	it('GIVEN a DA with bType="Enum" WHEN called THEN its type is added to enumTypeIds', () => {
		const doType = makeElement(`
			<DOType id="ENC_Mod">
				<DA name="ctlModel" bType="Enum" type="CtlModels"/>
			</DOType>
		`)
		const { daTypeIds, enumTypeIds } = queryTypesFromDOType(doType)
		expect(enumTypeIds.has('CtlModels')).toBe(true)
		expect(daTypeIds.size).toBe(0)
	})

	it('GIVEN a DA with bType that is neither Struct nor Enum WHEN called THEN it is ignored', () => {
		const doType = makeElement(`
			<DOType id="ENC_Mod">
				<DA name="t" bType="Timestamp"/>
				<DA name="stVal" bType="INT8U"/>
			</DOType>
		`)
		const { daTypeIds, enumTypeIds } = queryTypesFromDOType(doType)
		expect(daTypeIds.size).toBe(0)
		expect(enumTypeIds.size).toBe(0)
	})

	it('GIVEN a DA with a type attr but no bType WHEN called THEN it is ignored', () => {
		const doType = makeElement(`
			<DOType id="ENC_Mod">
				<DA name="x" type="SomeType"/>
			</DOType>
		`)
		const { daTypeIds, enumTypeIds } = queryTypesFromDOType(doType)
		expect(daTypeIds.size).toBe(0)
		expect(enumTypeIds.size).toBe(0)
	})

	it('GIVEN a DOType with no DA children WHEN called THEN both sets are empty', () => {
		const doType = makeElement('<DOType id="Empty"/>')
		const { daTypeIds, enumTypeIds } = queryTypesFromDOType(doType)
		expect(daTypeIds.size).toBe(0)
		expect(enumTypeIds.size).toBe(0)
	})
})

describe('queryTypesFromDAType', () => {
	it('GIVEN a BDA with bType="Struct" WHEN called THEN its type is added to daTypeIds', () => {
		const daType = makeElement(`
			<DAType id="Originator">
				<BDA name="orIdent" bType="Struct" type="InnerStruct"/>
			</DAType>
		`)
		const { daTypeIds } = queryTypesFromDAType(daType)
		expect(daTypeIds.has('InnerStruct')).toBe(true)
	})

	it('GIVEN a BDA with bType="Enum" WHEN called THEN its type is added to enumTypeIds', () => {
		const daType = makeElement(`
			<DAType id="Originator">
				<BDA name="orCat" bType="Enum" type="OriginatorCategoryKind"/>
			</DAType>
		`)
		const { enumTypeIds } = queryTypesFromDAType(daType)
		expect(enumTypeIds.has('OriginatorCategoryKind')).toBe(true)
	})

	it('GIVEN a DAType with no BDA children WHEN called THEN both sets are empty', () => {
		const daType = makeElement('<DAType id="Empty"/>')
		const { daTypeIds, enumTypeIds } = queryTypesFromDAType(daType)
		expect(daTypeIds.size).toBe(0)
		expect(enumTypeIds.size).toBe(0)
	})
})
