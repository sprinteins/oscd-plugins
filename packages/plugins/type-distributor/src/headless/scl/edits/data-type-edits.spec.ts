import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import {
	ensureDataTypeTemplates,
	buildEditsForDataTypeTemplates
} from './data-type-edits'
import type { LNodeTemplate } from '@/headless/common-types'

vi.mock('uuid', () => ({ v4: () => 'mocked-uuid' }))

afterEach(() => {
	vi.restoreAllMocks()
})

function makeDoc(xml: string): Document {
	return new DOMParser().parseFromString(xml, 'application/xml')
}

function makeScdDoc(inner = ''): Document {
	return makeDoc(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">${inner}</SCL>`
	)
}

function makeSsdDoc(inner = ''): XMLDocument {
	return makeDoc(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><DataTypeTemplates>${inner}</DataTypeTemplates></SCL>`
	) as XMLDocument
}

describe('ensureDataTypeTemplates', () => {
	it('GIVEN an SCD without DataTypeTemplates WHEN called THEN returns a new element and a non-null Insert edit', () => {
		const doc = makeScdDoc() as XMLDocument

		const { element, edit } = ensureDataTypeTemplates(doc)

		expect(element.tagName).toBe('DataTypeTemplates')
		expect(edit).not.toBeNull()
		expect(edit?.node).toBe(element)
		expect(edit?.parent).toBe(doc.documentElement)
	})

	it('GIVEN an SCD that already has DataTypeTemplates WHEN called THEN returns the existing element and a null edit', () => {
		const doc = makeScdDoc('<DataTypeTemplates/>') as XMLDocument
		// biome-ignore lint/style/noNonNullAssertion: test fixture
		const existing = doc.querySelector('DataTypeTemplates')!

		const { element, edit } = ensureDataTypeTemplates(doc)

		expect(element).toBe(existing)
		expect(edit).toBeNull()
	})
})

const SSD_DTT_XML = `
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
`

const lnodeTemplate: LNodeTemplate = {
	lnClass: 'XCBR',
	lnType: 'XCBR1',
	lnInst: '1'
}

describe('buildEditsForDataTypeTemplates', () => {
	let ssdDoc: XMLDocument

	beforeEach(() => {
		ssdDoc = makeSsdDoc(SSD_DTT_XML)
	})

	describe('GIVEN lnodeTemplates that reference types missing from the SCD', () => {
		let scdDoc: Document
		let dataTypeTemplates: Element

		beforeEach(() => {
			scdDoc = makeScdDoc()
			dataTypeTemplates = scdDoc.createElement('DataTypeTemplates')
			scdDoc.documentElement.appendChild(dataTypeTemplates)
		})

		it('WHEN called THEN it returns Insert edits for every missing type', () => {
			const edits = buildEditsForDataTypeTemplates(
				scdDoc,
				dataTypeTemplates,
				[lnodeTemplate],
				ssdDoc
			)

			// Expect 5 types: XCBR1, ENC_Mod, Originator, CtlModels, OriginatorKind
			expect(edits.length).toBe(5)
			const tagNames = edits.map((e) => (e.node as Element).tagName)
			expect(tagNames).toContain('LNodeType')
			expect(tagNames).toContain('DOType')
			expect(tagNames).toContain('DAType')
			expect(tagNames.filter((t) => t === 'EnumType').length).toBe(2)
		})

		it('WHEN called THEN types are inserted in LNodeType → DOType → DAType → EnumType order', () => {
			const edits = buildEditsForDataTypeTemplates(
				scdDoc,
				dataTypeTemplates,
				[lnodeTemplate],
				ssdDoc
			)

			const tagNames = edits.map((e) => (e.node as Element).tagName)
			expect(tagNames.indexOf('LNodeType')).toBeLessThan(
				tagNames.indexOf('DOType')
			)
			expect(tagNames.indexOf('DOType')).toBeLessThan(
				tagNames.indexOf('DAType')
			)
			expect(tagNames.indexOf('DAType')).toBeLessThan(
				tagNames.indexOf('EnumType')
			)
		})
	})

	it('GIVEN the SCD already contains all required types WHEN called THEN it returns an empty array (no duplicates)', () => {
		const scdDoc = makeDoc(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><DataTypeTemplates>
				<LNodeType id="XCBR1" lnClass="XCBR"><DO name="Mod" type="ENC_Mod"/></LNodeType>
				<DOType id="ENC_Mod" cdc="ENC">
						<DA name="ctlModel" bType="Enum" type="CtlModels"/>
						<DA name="origin" bType="Struct" type="Originator"/>
					</DOType>
					<DAType id="Originator"><BDA name="orCat" bType="Enum" type="OriginatorKind"/></DAType>
					<EnumType id="CtlModels"/>
					<EnumType id="OriginatorKind"/>
				</DataTypeTemplates></SCL>`
		)
		// biome-ignore lint/style/noNonNullAssertion: test fixture
		const dataTypeTemplates = scdDoc.querySelector('DataTypeTemplates')!

		const edits = buildEditsForDataTypeTemplates(
			scdDoc,
			dataTypeTemplates,
			[lnodeTemplate],
			ssdDoc
		)

		expect(edits).toHaveLength(0)
	})

	it('GIVEN only some types are missing from the SCD WHEN called THEN it only inserts the missing types', () => {
		// SCD already has LNodeType and DOType but not DAType or EnumTypes
		const scdDoc = makeDoc(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><DataTypeTemplates>
				<LNodeType id="XCBR1" lnClass="XCBR"><DO name="Mod" type="ENC_Mod"/></LNodeType>
					<DOType id="ENC_Mod" cdc="ENC">
						<DA name="ctlModel" bType="Enum" type="CtlModels"/>
						<DA name="origin" bType="Struct" type="Originator"/>
					</DOType>
				</DataTypeTemplates></SCL>`
		)
		// biome-ignore lint/style/noNonNullAssertion: test fixture
		const dataTypeTemplates = scdDoc.querySelector('DataTypeTemplates')!

		const edits = buildEditsForDataTypeTemplates(
			scdDoc,
			dataTypeTemplates,
			[lnodeTemplate],
			ssdDoc
		)

		// Only DAType[Originator], EnumType[CtlModels], EnumType[OriginatorKind]
		expect(edits).toHaveLength(3)
		const tagNames = edits.map((e) => (e.node as Element).tagName)
		expect(tagNames).not.toContain('LNodeType')
		expect(tagNames).not.toContain('DOType')
		expect(tagNames).toContain('DAType')
		expect(tagNames.filter((t) => t === 'EnumType').length).toBe(2)
	})

	it('GIVEN an empty lnodeTemplates list WHEN called THEN it returns an empty array', () => {
		const scdDoc = makeScdDoc()
		const dataTypeTemplates = scdDoc.createElement('DataTypeTemplates')
		scdDoc.documentElement.appendChild(dataTypeTemplates)

		const edits = buildEditsForDataTypeTemplates(
			scdDoc,
			dataTypeTemplates,
			[],
			ssdDoc
		)

		expect(edits).toHaveLength(0)
	})
})
