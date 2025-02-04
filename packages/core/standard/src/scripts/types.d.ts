import type { IEC61850 } from '@/global'

export type UnstableModule = {
	[key: string]: Record<string, unknown>
	UNSTABLE_REVISION_BASED_ON: IEC61850.AvailableUnStableDefinition
}
