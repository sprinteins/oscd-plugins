export function queryTemplateVoltageLevel(doc: XMLDocument): Element | null {
	return doc.querySelector(
		'Substation[name="TEMPLATE"] > VoltageLevel[name="TEMPLATE"]'
	)
}

export function queryNonTemplateBays(voltageLevel: Element): Element[] {
	return Array.from(
		voltageLevel.querySelectorAll('Bay:not([name="TEMPLATE"])')
	)
}

export function queryDataTypeTemplates(doc: XMLDocument): Element | null {
	return doc.querySelector('SCL > DataTypeTemplates')
}

export function queryTemplateBay(doc: XMLDocument): Element | null {
	return doc.querySelector(
		'Substation[name="TEMPLATE"] > VoltageLevel[name="TEMPLATE"] > Bay[name="TEMPLATE"]'
	)
}

export function queryFunctionsInTemplateBay(templateBay: Element): Element[] {
	return Array.from(templateBay.querySelectorAll(':scope > Function'))
}

export function queryConductingEquipmentInTemplateBay(
	templateBay: Element
): Element[] {
	return Array.from(
		templateBay.querySelectorAll(':scope > ConductingEquipment')
	)
}

export function queryLNodesInFunction(func: Element): Element[] {
	return Array.from(func.querySelectorAll('LNode'))
}

export function queryTerminalsInEquipment(ce: Element): Element[] {
	return Array.from(ce.querySelectorAll('Terminal'))
}

export function queryEqFunctionsInEquipment(ce: Element): Element[] {
	return Array.from(ce.querySelectorAll('EqFunction'))
}

export function queryLNodesInDataTypeTemplates(
	dataTypeTemplates: Element
): Element[] {
	return Array.from(dataTypeTemplates.querySelectorAll('LNodeType'))
}

export function queryDOsInsideLNodeType(lnodeType: Element): Element[] {
	return Array.from(lnodeType.querySelectorAll('DO'))
}

export function queryDOTypesInsideDataTypeTemplates(
	dataTypeTemplates: Element
): Element[] {
	return Array.from(dataTypeTemplates.querySelectorAll('DOType'))
}

export function queryDAsInsideDOType(doType: Element): Element[] {
    return Array.from(doType.querySelectorAll('DA'))
}

export function queryDATypesInsideDataTypeTemplates(dataTypeTemplates: Element): Element[] {
    return Array.from(dataTypeTemplates.querySelectorAll('DAType'))
}

export function queryEnumTypesInsideDataTypeTemplates(dataTypeTemplates: Element): Element[] {
    return Array.from(dataTypeTemplates.querySelectorAll('EnumType'))
}