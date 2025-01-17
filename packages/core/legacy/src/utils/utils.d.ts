export namespace Utils {
	export type ValueOf<T> = T[keyof T]

	export type Entries<T> = {
		[K in keyof T]: [K, T[K]]
	}[keyof T][]

	export type StrictExclude<T, U> = T extends U
		? U extends T
			? never
			: T
		: T

	export type Mutable<T> = {
		-readonly [P in keyof T]: T[P]
	}
}
