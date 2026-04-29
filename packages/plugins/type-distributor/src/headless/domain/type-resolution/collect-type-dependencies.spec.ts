import { beforeEach, describe, expect, it } from 'vitest'
import type { LNodeTemplate } from '@/headless/common-types'
import { collectTypeDependencies } from './collect-type-dependencies'

function makeSsdDoc(xml: string): XMLDocument {
	return new DOMParser().parseFromString(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">${xml}</SCL>`,
		'application/xml'
	) as XMLDocument
}

const FULL_SSD_XML = `
<DataTypeTemplates>
	<LNodeType id="XCBR1" lnClass="XCBR">
		<DO name="Mod" type="ENC_Mod"/>
	</LNodeType>
	<DOType id="ENC_Mod" cdc="ENC">
		<DA name="ctlModel" bType="Enum" type="CtlModels"/>
		<DA name="origin" bType="Struct" type="Originator"/>
	</DOType>
	<DAType id="Originator">
		<BDA name="orCat" bType="Enum" type="OriginatorKind"/>
	</DAType>
	<EnumType id="CtlModels"/>
	<EnumType id="OriginatorKind"/>
</DataTypeTemplates>
`

const lnodeTemplate: LNodeTemplate = {
	lnClass: 'XCBR',
	lnType: 'XCBR1',
	lnInst: '1'
}

describe('collectTypeDependencies', () => {
	describe('GIVEN a fully resolved LNodeType hierarchy', () => {
		let ssdDoc: XMLDocument

		beforeEach(() => {
			// Sanity check that the SSD fixture is correct and the test setup is valid
			ssdDoc = makeSsdDoc(FULL_SSD_XML)
		})

		it('WHEN called THEN lnodeTypeIds contains the lnType', () => {
			const { lnodeTypeIds } = collectTypeDependencies(
				[lnodeTemplate],
				ssdDoc
			)
			expect(lnodeTypeIds.has('XCBR1')).toBe(true)
		})

		it('WHEN called THEN doTypeIds contains all referenced DOTypes', () => {
			const { doTypeIds } = collectTypeDependencies(
				[lnodeTemplate],
				ssdDoc
			)
			expect(doTypeIds.has('ENC_Mod')).toBe(true)
		})

		it('WHEN called THEN daTypeIds contains all referenced DATypes (including nested)', () => {
			const { daTypeIds } = collectTypeDependencies(
				[lnodeTemplate],
				ssdDoc
			)
			expect(daTypeIds.has('Originator')).toBe(true)
		})

		it('WHEN called THEN enumTypeIds contains all referenced EnumTypes', () => {
			const { enumTypeIds } = collectTypeDependencies(
				[lnodeTemplate],
				ssdDoc
			)
			expect(enumTypeIds.has('CtlModels')).toBe(true)
			expect(enumTypeIds.has('OriginatorKind')).toBe(true)
		})
	})

	it('GIVEN a template whose LNodeType is missing from the SSD WHEN called THEN lnodeTypeIds still contains the lnType but other sets are empty', () => {
		const ssdDoc = makeSsdDoc('<DataTypeTemplates/>')
		const { lnodeTypeIds, doTypeIds, daTypeIds, enumTypeIds } =
			collectTypeDependencies([lnodeTemplate], ssdDoc)

		expect(lnodeTypeIds.has('XCBR1')).toBe(true)
		expect(doTypeIds.size).toBe(0)
		expect(daTypeIds.size).toBe(0)
		expect(enumTypeIds.size).toBe(0)
	})

	it('GIVEN an empty lnodeTemplates list WHEN called THEN all collections are empty', () => {
		const ssdDoc = makeSsdDoc(FULL_SSD_XML)
		const result = collectTypeDependencies([], ssdDoc)

		expect(result.lnodeTypeIds.size).toBe(0)
		expect(result.doTypeIds.size).toBe(0)
		expect(result.daTypeIds.size).toBe(0)
		expect(result.enumTypeIds.size).toBe(0)
	})

	it('GIVEN multiple templates sharing the same LNodeType WHEN called THEN the lnType is deduplicated in lnodeTypeIds', () => {
		const ssdDoc = makeSsdDoc(FULL_SSD_XML)
		const templates: LNodeTemplate[] = [
			{ lnClass: 'XCBR', lnType: 'XCBR1', lnInst: '1' },
			{ lnClass: 'XCBR', lnType: 'XCBR1', lnInst: '2' }
		]
		const { lnodeTypeIds } = collectTypeDependencies(templates, ssdDoc)
		expect(lnodeTypeIds.size).toBe(1)
	})

	it('GIVEN a DOType with a DA that has no type attribute WHEN called THEN it does not add anything to daTypeIds or enumTypeIds for that DA', () => {
		const ssdDoc = makeSsdDoc(`
			<DataTypeTemplates>
				<LNodeType id="XCBR1" lnClass="XCBR">
					<DO name="Mod" type="DOT_Simple"/>
					</LNodeType>
					<DOType id="DOT_Simple" cdc="ENS">
						<DA name="t" bType="Timestamp"/>
					</DOType>
				</DataTypeTemplates>
			`)
		const { daTypeIds, enumTypeIds } = collectTypeDependencies(
			[lnodeTemplate],
			ssdDoc
		)
		expect(daTypeIds.size).toBe(0)
		expect(enumTypeIds.size).toBe(0)
	})

	it('GIVEN a DOType id referenced by LNodeType that is not present in SSD WHEN collecting THEN daTypeIds is empty', () => {
		const ssdDoc = makeSsdDoc(`
			<DataTypeTemplates>
				<LNodeType id="XCBR1" lnClass="XCBR">
					<DO name="Mod" type="MISSING_DOT"/>
				</LNodeType>
			</DataTypeTemplates>
		`)
		const { doTypeIds, daTypeIds, enumTypeIds } = collectTypeDependencies(
			[lnodeTemplate],
			ssdDoc
		)
		// doTypeIds still contains the id referenced by the LNodeType
		expect(doTypeIds.has('MISSING_DOT')).toBe(true)
		// but no DATypes or EnumTypes can be resolved
		expect(daTypeIds.size).toBe(0)
		expect(enumTypeIds.size).toBe(0)
	})

	it('GIVEN a DAType that is already in processedDaTypes WHEN collecting THEN it is not processed twice (no duplicates in results)', () => {
		// Two DAs in the same DOType both reference the same DAType
		const ssdDoc = makeSsdDoc(`
			<DataTypeTemplates>
				<LNodeType id="XCBR1" lnClass="XCBR">
					<DO name="Mod" type="ENC_Shared"/>
				</LNodeType>
				<DOType id="ENC_Shared" cdc="ENC">
					<DA name="a" bType="Struct" type="SharedDAType"/>
					<DA name="b" bType="Struct" type="SharedDAType"/>
				</DOType>
				<DAType id="SharedDAType">
					<BDA name="orCat" bType="Enum" type="SomeEnum"/>
				</DAType>
				<EnumType id="SomeEnum"/>
			</DataTypeTemplates>
		`)
		const { daTypeIds, enumTypeIds } = collectTypeDependencies(
			[lnodeTemplate],
			ssdDoc
		)
		// SharedDAType should appear exactly once
		expect(daTypeIds.size).toBe(1)
		expect(daTypeIds.has('SharedDAType')).toBe(true)
		expect(enumTypeIds.has('SomeEnum')).toBe(true)
	})
})
