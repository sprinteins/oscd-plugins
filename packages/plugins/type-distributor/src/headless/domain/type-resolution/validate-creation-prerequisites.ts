const mandatoryLln0DoNames = ['NamPlt', 'Beh', 'Health', 'Mod'] as const

export const MISSING_SSD_CREATION_MESSAGE =
	'Import an SSD file before creating S-IEDs or Access Points.'

export type CreationPrerequisiteProblemCode =
	| 'missing-ssd-document'
	| 'missing-lln0-type'
	| 'missing-mandatory-lln0-do'

export type CreationPrerequisiteProblem = {
	code: CreationPrerequisiteProblemCode
	message: string
	doName?: string
}

export type CreationPrerequisiteValidation = {
	isValid: boolean
	problems: CreationPrerequisiteProblem[]
}

export class CreationPrerequisiteError extends Error {
	readonly problems: CreationPrerequisiteProblem[]

	constructor(problems: CreationPrerequisiteProblem[]) {
		super(problems.map((problem) => problem.message).join(' '))
		this.name = 'CreationPrerequisiteError'
		this.problems = problems
	}
}

function createValidationResult(
	problems: CreationPrerequisiteProblem[]
): CreationPrerequisiteValidation {
	return {
		isValid: problems.length === 0,
		problems
	}
}

export function validateCreationPrerequisites(
	ssdDoc: XMLDocument | null
): CreationPrerequisiteValidation {
	if (!ssdDoc) {
		return createValidationResult([
			{
				code: 'missing-ssd-document',
				message: MISSING_SSD_CREATION_MESSAGE
			}
		])
	}

	const lln0Type = ssdDoc.querySelector('LNodeType[lnClass="LLN0"]')
	if (!lln0Type) {
		return createValidationResult([
			{
				code: 'missing-lln0-type',
				message: 'The SSD is missing the mandatory LLN0 LNodeType.'
			}
		])
	}

	const problems: CreationPrerequisiteProblem[] = []

	for (const mandatoryDoName of mandatoryLln0DoNames) {
		const doElement = lln0Type.querySelector(
			`DO[name="${mandatoryDoName}"]`
		)

		if (!doElement) {
			problems.push({
				code: 'missing-mandatory-lln0-do',
				message: `LLN0 is missing mandatory DO "${mandatoryDoName}".`,
				doName: mandatoryDoName
			})
		}
	}

	return createValidationResult(problems)
}

export function assertCreationPrerequisites(
	ssdDoc: XMLDocument | null
): CreationPrerequisiteValidation {
	const validation = validateCreationPrerequisites(ssdDoc)
	if (!validation.isValid) {
		throw new CreationPrerequisiteError(validation.problems)
	}
	return validation
}
