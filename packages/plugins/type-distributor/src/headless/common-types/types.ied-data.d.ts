export type IedLNData = {
	lnClass: string
	lnType: string
	inst: string
	prefix?: string
	iedName?: string
	ldInst: string
}

export type IedLDeviceData = {
	ldInst: string
	lns: IedLNData[]
}
