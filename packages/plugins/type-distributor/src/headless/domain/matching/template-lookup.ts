import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'

export function getConductingEquipmentTemplate(
	templates: ConductingEquipmentTemplate[],
	uuid: string
): ConductingEquipmentTemplate | undefined {
	return templates.find((t) => t.uuid === uuid)
}

export function getFunctionTemplate(
	templates: FunctionTemplate[],
	uuid: string
): FunctionTemplate | undefined {
	return templates.find((t) => t.uuid === uuid)
}
