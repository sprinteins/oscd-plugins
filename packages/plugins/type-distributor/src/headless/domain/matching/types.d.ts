export type EquipmentLookupItem = {
	bayTypeEquipment: ConductingEquipmentType
	template: ConductingEquipmentTemplate
}

export type TemplateCountMismatch = {
	templateUuid: string
	required: number
	selected: number
}
