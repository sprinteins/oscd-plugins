import type { IEC61850 } from '@oscd-plugins/core-standard'

export namespace Utils {
	export type Attributes = Record<string, string | null>
	export type Namespace = {
		uri: string
		prefix: string
	}
	export type Entries<T> = {
		[K in keyof T]: [K, T[K]]
	}[keyof T][]
}
