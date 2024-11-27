export type ValueOf<T> = T[keyof T]

export type Entries<T> = {
	[K in keyof T]: [K, T[K]]
}[keyof T][]

export type StrictExclude<T, U> = T extends U ? (U extends T ? never : T) : T
