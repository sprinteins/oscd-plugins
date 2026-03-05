export type DODefinition = { name: string; type: string }

export const LLN0_MANDATORY_DOS: DODefinition[] = [
	{ name: 'NamPlt', type: 'LPL' },
	{ name: 'Beh', type: 'ENS' },
	{ name: 'Health', type: 'ENS_Health' },
	{ name: 'Mod', type: 'ENC' }
]

export const LLN0_OPTIONAL_DOS: DODefinition[] = [
	{ name: 'LocKey', type: 'SPS' },
	{ name: 'Loc', type: 'SPS' },
	{ name: 'LocSta', type: 'SPC' },
	{ name: 'Diag', type: 'SPC' },
	{ name: 'LEDRs', type: 'SPC' },
	{ name: 'SwModKey', type: 'SPC' },
	{ name: 'InRef', type: 'ORG' },
	{ name: 'GrRef', type: 'ORG' },
	{ name: 'MltLev', type: 'SPG' }
]

export const LPHD_MANDATORY_DOS: DODefinition[] = [
	{ name: 'NamPlt', type: 'LPL' },
	{ name: 'PhyNam', type: 'DPL' },
	{ name: 'PhyHealth', type: 'ENS_Health' },
	{ name: 'Proxy', type: 'SPS' },
	{ name: 'MaxDl', type: 'ING' }
]

export const LPHD_OPTIONAL_DOS: DODefinition[] = [
	{ name: 'OutOv', type: 'SPS' },
	{ name: 'InOv', type: 'SPS' },
	{ name: 'OpTmh', type: 'INS' },
	{ name: 'NumPwrUp', type: 'INS' },
	{ name: 'WrmStr', type: 'INS' },
	{ name: 'WacTrg', type: 'INS' },
	{ name: 'PwrUp', type: 'SPS' },
	{ name: 'PwrDn', type: 'SPS' },
	{ name: 'PwrSupAlm', type: 'SPS' },
	{ name: 'RsStat', type: 'SPC' },
	{ name: 'Sim', type: 'SPC' }
]

// ENS_Health reuses the ENS CDC (variant type for health status)
export const DEFAULT_DO_TYPE_CDCS: Record<string, string> = {
	ENC: 'ENC',
	ENS: 'ENS',
	ENS_Health: 'ENS',
	LPL: 'LPL',
	SPS: 'SPS',
	DPL: 'DPL',
	SPC: 'SPC',
	ORG: 'ORG',
	SPG: 'SPG',
	INS: 'INS',
	ING: 'ING'
}

export const LLN0_TYPE_ID_MANDATORY = 'LLN0_Default'
export const LLN0_TYPE_ID_FULL = 'LLN0_Default_Full'
export const LPHD_TYPE_ID_MANDATORY = 'LPHD_Default'
export const LPHD_TYPE_ID_FULL = 'LPHD_Default_Full'
