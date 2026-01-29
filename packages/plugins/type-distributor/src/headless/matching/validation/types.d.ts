export type AmbiguousTypeInfo = {
	typeCode: string
	templateNames: string[]
}

export type ValidationResult = {
	isValid: boolean
	errors: string[]
	requiresManualMatching?: boolean
	ambiguousTypes?: AmbiguousTypeInfo[]
	canAutoMatch?: boolean
}
