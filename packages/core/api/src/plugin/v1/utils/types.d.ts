import type { IEC61850 } from '@oscd-plugins/core-standard'

export namespace Utils {
	export type Attributes = Record<string, string | null>
	export type Namespace = {
		uri: string
		prefix: string
	}
}
