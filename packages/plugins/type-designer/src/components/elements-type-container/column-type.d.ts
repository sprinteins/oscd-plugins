import type { DataTypeTemplates } from "./data-type-templates"

export type Column = {
	name: string
	visible: boolean
	items: DataTypeTemplates[]
}
