
export type NewLC = {
	type: LCType
	instance: string
	nrOfLRTIInputs?: number
}

export const LCTypes = {
	LRTD: "LRTD",
	LRTI: "LRTI",
	LRTB: "LRTB",
} as const
export type LCType = typeof LCTypes[keyof typeof LCTypes]