import { describe, expect, it } from 'vitest'
import {
	assertCreationPrerequisites,
	CreationPrerequisiteError,
	validateCreationPrerequisites
} from './validate-creation-prerequisites'

function makeSsdDoc(inner = ''): XMLDocument {
	return new DOMParser().parseFromString(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><DataTypeTemplates>${inner}</DataTypeTemplates></SCL>`,
		'application/xml'
	) as XMLDocument
}

const validLln0Xml = `
	<LNodeType id="LLN0_Default" lnClass="LLN0">
		<DO name="NamPlt" />
		<DO name="Beh" />
		<DO name="Health" />
		<DO name="Mod" />
	</LNodeType>
`

describe('validateCreationPrerequisites', () => {
	it('GIVEN no SSD document WHEN validated THEN it reports the missing SSD problem', () => {
		const validation = validateCreationPrerequisites(null)

		expect(validation.isValid).toBe(false)
		expect(validation.problems).toEqual([
			expect.objectContaining({ code: 'missing-ssd-document' })
		])
	})

	it('GIVEN an SSD without an LLN0 type WHEN validated THEN it reports the missing LLN0 problem', () => {
		const validation = validateCreationPrerequisites(makeSsdDoc())

		expect(validation.isValid).toBe(false)
		expect(validation.problems).toEqual([
			expect.objectContaining({ code: 'missing-lln0-type' })
		])
	})

	it('GIVEN an LLN0 type without the mandatory DOs WHEN validated THEN it reports all missing mandatory LLN0 DOs', () => {
		const validation = validateCreationPrerequisites(
			makeSsdDoc('<LNodeType id="LLN0_Default" lnClass="LLN0" />')
		)

		expect(validation.isValid).toBe(false)
		expect(validation.problems).toHaveLength(4)
		expect(validation.problems.map((problem) => problem.doName)).toEqual([
			'NamPlt',
			'Beh',
			'Health',
			'Mod'
		])
	})

	it('GIVEN an LLN0 type with the mandatory DO names only WHEN validated THEN it reports success even without type references', () => {
		const validation = validateCreationPrerequisites(
			makeSsdDoc(`
				<LNodeType id="LLN0_Default" lnClass="LLN0">
					<DO name="NamPlt" />
					<DO name="Beh" />
					<DO name="Health" />
					<DO name="Mod" />
				</LNodeType>
			`)
		)

		expect(validation.isValid).toBe(true)
		expect(validation.problems).toHaveLength(0)
	})

	it('GIVEN an SSD with all mandatory LLN0 DOs and DOTypes WHEN validated THEN it reports success', () => {
		const validation = validateCreationPrerequisites(
			makeSsdDoc(validLln0Xml)
		)

		expect(validation.isValid).toBe(true)
		expect(validation.problems).toHaveLength(0)
	})
})

describe('assertCreationPrerequisites', () => {
	it('GIVEN invalid creation prerequisites WHEN asserted THEN it throws a CreationPrerequisiteError', () => {
		expect(() => assertCreationPrerequisites(makeSsdDoc())).toThrow(
			CreationPrerequisiteError
		)
	})

	it('GIVEN valid creation prerequisites WHEN asserted THEN it returns the successful validation result', () => {
		const validation = assertCreationPrerequisites(makeSsdDoc(validLln0Xml))

		expect(validation.isValid).toBe(true)
		expect(validation.problems).toHaveLength(0)
	})
})
