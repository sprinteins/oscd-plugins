export namespace Compas {
	export type AvailableFileType =
		| 'CID'
		| 'ICD'
		| 'IID'
		| 'ISD'
		| 'SCD'
		| 'SSD'
		| 'SED'
		| 'STD'

	export type FileTypeResponse = {
		description: string
		code: AvailableFileType
	}[]

	export type FileByType = {
		id: string
		name: string
		version: `${number}.${number}.${number}`
		label: string
	}

	export type FileByTypeResponse = FileByType[]
}
