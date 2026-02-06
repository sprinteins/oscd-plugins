import { queryDataTypeTemplates } from "../xml-querries"

export function queryIEDInsertionReference(root: XMLDocument): Element | null {
	const existingIEDs = root.querySelectorAll(':scope > IED')
	const dataTypeTemplates = queryDataTypeTemplates(root)

	if (dataTypeTemplates) return dataTypeTemplates
	if (existingIEDs.length > 0) {
		const lastIED = existingIEDs[existingIEDs.length - 1]
		return lastIED.nextElementSibling
	}
	return null
}
