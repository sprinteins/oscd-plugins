import { beforeEach, describe, expect, it } from 'vitest'
import { generateLDeviceInst } from '../elements'
import { buildEditsForLDeviceRename } from './ldevice-rename-edits'

const PARSER = new DOMParser()

function parseXml(xml: string): XMLDocument {
	return PARSER.parseFromString(
		xml,
		'application/xml'
	) as unknown as XMLDocument
}

describe('generateLDeviceInst', () => {
	it('GIVEN an eqFunction name, uuid and CE name WHEN called THEN returns sanitized inst string', () => {
		const inst = generateLDeviceInst(
			'Protection',
			'abcdef12-0000-0000-0000-000000000000',
			'Breaker1'
		)
		expect(inst).toBe('Breaker1_Protection_abcdef12')
	})

	it('GIVEN a CE name with special chars WHEN called THEN sanitizes the CE name', () => {
		const inst = generateLDeviceInst(
			'Prot',
			'aaaaaaaa-0000-0000-0000-000000000000',
			'Bay-A.1'
		)
		expect(inst).toBe('BayA1_Prot_aaaaaaaa')
	})
})

describe('buildEditsForLDeviceRename', () => {
	let doc: XMLDocument
	let ied: Element

	const OLD_INST = 'CB1_Protection_aabbccdd'
	const NEW_INST = 'CB1_Protection_11223344'

	beforeEach(() => {
		doc = parseXml(`
			<SCL>
				<IED name="IED1">
					<AccessPoint name="AP1">
						<Server>
							<LDevice inst="${OLD_INST}" ldName="IED1_${OLD_INST}">
								<LN0 lnClass="LLN0" lnType="T1" lnInst="" />
								<LN lnClass="PTRC" lnType="T2" lnInst="1" />
							</LDevice>
						</Server>
					</AccessPoint>
				</IED>
			</SCL>
		`)
		ied = doc.querySelector('IED')!
	})

	describe('GIVEN a valid IED with an existing LDevice', () => {
		it('WHEN called THEN produces a SetAttributes edit renaming the LDevice', () => {
			const edits = buildEditsForLDeviceRename({
				ied,
				oldInst: OLD_INST,
				newInst: NEW_INST,
				newLNodeTemplates: [],
				doc
			})

			const renameEdit = edits.find(
				(e) =>
					'element' in e && (e as any).attributes?.inst === NEW_INST
			)
			expect(renameEdit).toBeDefined()
			expect((renameEdit as any).attributes.ldName).toBe(
				`IED1_${NEW_INST}`
			)
		})

		it('WHEN called THEN produces Remove edits for old LN elements', () => {
			const edits = buildEditsForLDeviceRename({
				ied,
				oldInst: OLD_INST,
				newInst: NEW_INST,
				newLNodeTemplates: [],
				doc
			})

			const removes = edits.filter((e) => 'node' in e && !('parent' in e))
			expect(removes).toHaveLength(1)
		})

		it('WHEN called with new LNode templates THEN produces Insert edits for new LN elements', () => {
			const newLNodeTemplates = [
				{ lnClass: 'PDIS', lnType: 'T99', lnInst: '1' }
			]

			const edits = buildEditsForLDeviceRename({
				ied,
				oldInst: OLD_INST,
				newInst: NEW_INST,
				newLNodeTemplates,
				doc
			})

			const inserts = edits.filter((e) => 'parent' in e)
			expect(inserts).toHaveLength(1)
			expect((inserts[0] as any).node.getAttribute('lnClass')).toBe(
				'PDIS'
			)
		})

		it('WHEN called THEN edit order is: rename, removes, inserts', () => {
			const newLNodeTemplates = [
				{ lnClass: 'PDIS', lnType: 'T99', lnInst: '1' }
			]

			const edits = buildEditsForLDeviceRename({
				ied,
				oldInst: OLD_INST,
				newInst: NEW_INST,
				newLNodeTemplates,
				doc
			})

			expect('element' in edits[0]).toBe(true)
			expect('node' in edits[1] && !('parent' in edits[1])).toBe(true)
		})
	})

	it('GIVEN a non-existent LDevice inst WHEN called THEN throws an error', () => {
		expect(() =>
			buildEditsForLDeviceRename({
				ied,
				oldInst: 'DOES_NOT_EXIST',
				newInst: NEW_INST,
				newLNodeTemplates: [],
				doc
			})
		).toThrow('LDevice with inst "DOES_NOT_EXIST" not found in IED "IED1"')
	})

	it('GIVEN a LDevice with no LN elements WHEN called THEN produces only the rename edit', () => {
		doc = parseXml(`
			<SCL>
				<IED name="IED2">
					<AccessPoint name="AP1">
						<Server>
							<LDevice inst="${OLD_INST}" ldName="IED2_${OLD_INST}" />
						</Server>
					</AccessPoint>
				</IED>
			</SCL>
		`)
		ied = doc.querySelector('IED')!

		const edits = buildEditsForLDeviceRename({
			ied,
			oldInst: OLD_INST,
			newInst: NEW_INST,
			newLNodeTemplates: [],
			doc
		})

		expect(edits).toHaveLength(1)
		expect('element' in edits[0]).toBe(true)
	})
})
