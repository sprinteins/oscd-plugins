import { describe, it, expect, beforeEach } from 'vitest'
import { parseDataTypeTemplates } from './parse-data-type-templates'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

describe('parseDataTypeTemplates', () => {
	let doc: XMLDocument

	beforeEach(() => {
		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
	})

	describe('LNodeType parsing', () => {
		it('parses LNodeTypes and their DOs including attributes', () => {
			const { lnodeTypes } = parseDataTypeTemplates(doc)

			expect(lnodeTypes.length).toBeGreaterThan(0)

			const lln0 = lnodeTypes.find((ln) => ln.id === 'Dummy.LLN0')
			expect(lln0).toBeDefined()
			expect(lln0).toMatchObject({ lnClass: 'LLN0' })

			const mod = lln0?.dataObjects.find((d) => d.name === 'Mod')
			expect(mod).toMatchObject({ type: 'Dummy.LLN0.Mod' })

			const health = lln0?.dataObjects.find((d) => d.name === 'Health')
			expect(health).toBeDefined()
		})

		it('respects transient and accessControl attributes on DOs', () => {
			const parser = new DOMParser()
			const xml = `<?xml version="1.0"?>
			<SCL>
				<DataTypeTemplates>
					<LNodeType id="Test.LLN0" lnClass="LLN0">
						<DO name="Mod" type="TestMod" transient="true" accessControl="protected" />
						<DO name="Health" type="TestHealth" />
					</LNodeType>
				</DataTypeTemplates>
			</SCL>`

			const localDoc = parser.parseFromString(xml, 'application/xml')
			const { lnodeTypes } = parseDataTypeTemplates(localDoc)
			const dos = lnodeTypes[0].dataObjects
			expect(dos[0]).toMatchObject({
				transient: true,
				accessControl: 'protected'
			})
			expect(dos[1]).toMatchObject({ transient: false })
		})
	})

	describe('DOType parsing', () => {
		it('parses DOTypes and DA attributes (including boolean defaults)', () => {
			const { doTypes } = parseDataTypeTemplates(doc)

			const dummySPS = doTypes.find((d) => d.id === 'Dummy.SPS')
			expect(dummySPS).toBeDefined()

			const stVal = dummySPS?.dataAttributes.find(
				(da) => da.name === 'stVal'
			)
			expect(stVal).toMatchObject({ bType: 'BOOLEAN', fc: 'ST' })
			expect(stVal?.dchg).toBe(true)
			expect(stVal?.qchg).toBe(false)

			const q = dummySPS?.dataAttributes.find((da) => da.name === 'q')
			expect(q?.qchg).toBe(true)

			const dummySAV = doTypes.find((d) => d.id === 'DummySAV')
			const instMag = dummySAV?.dataAttributes.find(
				(da) => da.name === 'instMag'
			)
			expect(instMag).toMatchObject({
				bType: 'Struct',
				type: 'AnalogueValue_i'
			})
		})

		it('parses optional DA attributes from inline DOType', () => {
			const parser = new DOMParser()
			const xml = `<?xml version="1.0"?>
			<SCL>
				<DataTypeTemplates>
					<DOType id="Test.DOType" cdc="SPS">
						<DA name="testDA" bType="INT32" fc="MX" type="TestType" sAddr="0x1234" valKind="RO" count="3" valImport="true" dchg="true" qchg="true" dupd="true" desc="Test DA Description" />
					</DOType>
				</DataTypeTemplates>
			</SCL>`

			const localDoc = parser.parseFromString(xml, 'application/xml')
			const { doTypes } = parseDataTypeTemplates(localDoc)
			const da = doTypes[0].dataAttributes[0]
			expect(da).toMatchObject({
				name: 'testDA',
				bType: 'INT32',
				fc: 'MX',
				type: 'TestType',
				sAddr: '0x1234',
				valKind: 'RO',
				count: '3'
			})
			expect(da.valImport).toBe(true)
			expect(da.dchg).toBe(true)
			expect(da.qchg).toBe(true)
			expect(da.dupd).toBe(true)
		})
	})

	it('parses DAType and EnumType ids', () => {
		const { daTypes, enumTypes } = parseDataTypeTemplates(doc)
		expect(daTypes.some((d) => d.id === 'AnalogueValue_i')).toBe(true)
		expect(enumTypes.some((e) => e.id === 'Dummy_Health')).toBe(true)
	})

	describe('Edge cases', () => {
		it('returns empty arrays when DataTypeTemplates element not found', () => {
			const parser = new DOMParser()
			const emptyDoc = parser.parseFromString(
				'<?xml version="1.0"?><SCL></SCL>',
				'application/xml'
			)
			const result = parseDataTypeTemplates(emptyDoc)
			expect(result.lnodeTypes).toHaveLength(0)
			expect(result.doTypes).toHaveLength(0)
			expect(result.daTypes).toHaveLength(0)
			expect(result.enumTypes).toHaveLength(0)
		})

		it('handles missing attributes with defaults', () => {
			const parser = new DOMParser()
			const minimalDoc = parser.parseFromString(
				`<?xml version="1.0"?><SCL><DataTypeTemplates><LNodeType><DO /></LNodeType><DOType><DA /></DOType></DataTypeTemplates></SCL>`,
				'application/xml'
			)
			const { lnodeTypes, doTypes } = parseDataTypeTemplates(minimalDoc)
			expect(lnodeTypes[0].id).toBe('')
			expect(lnodeTypes[0].lnClass).toBe('')
			expect(lnodeTypes[0].dataObjects[0].name).toBe('')
			expect(doTypes[0].dataAttributes[0].bType).toBe('')
		})
	})

	it('validates mock data has expected counts and representative entries', () => {
		const result = parseDataTypeTemplates(doc)
		expect(result.lnodeTypes.length).toBeGreaterThan(5)
		expect(result.doTypes.length).toBeGreaterThan(10)
		expect(result.daTypes.length).toBeGreaterThan(3)
		expect(result.enumTypes.length).toBeGreaterThan(3)
		expect(result.lnodeTypes.some((ln) => ln.id === 'Dummy.LLN0')).toBe(
			true
		)
		expect(result.doTypes.some((d) => d.id === 'Dummy.SPS')).toBe(true)
	})
})
