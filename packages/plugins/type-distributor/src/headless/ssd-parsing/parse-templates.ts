import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	GeneralEquipmentTemplate,
	LNodeTemplate
} from '@/headless/common-types'

export function parseFunctionTemplate(element: Element): FunctionTemplate {
	return {
		uuid: element.getAttribute('uuid') || '',
		name: element.getAttribute('name') || 'Unnamed Function',
		type: element.getAttribute('type') || undefined,
		desc: element.getAttribute('desc') || undefined,
		lnodes: Array.from(element.querySelectorAll(':scope > LNode')).map(
			(ln) => ({
				lnClass: ln.getAttribute('lnClass') || '',
				lnInst: ln.getAttribute('lnInst') || '',
				lnType: ln.getAttribute('lnType') || '',
				uuid: ln.getAttribute('uuid') || '',
				iedName: ln.getAttribute('iedName') || undefined,
				ldInst: ln.getAttribute('ldInst') || undefined,
				prefix: ln.getAttribute('prefix') || undefined
			})
		)
	}
}

export function parseGeneralEquipmentTemplate(
	element: Element,
	functionTemplates: FunctionTemplate[]
): GeneralEquipmentTemplate {
	return {
		uuid: element.getAttribute('uuid') || '',
		name: element.getAttribute('name') || 'Unnamed General Equipment',
		type: element.getAttribute('type') || '',
		desc: element.getAttribute('desc') || undefined,
		eqFunctions: Array.from(element.querySelectorAll('EqFunction')).map(
			(eqFunc) => {
				const templateUuid = eqFunc.getAttribute('templateUuid')
				let name = eqFunc.getAttribute('name') || 'Unnamed EqFunction'
				let desc = eqFunc.getAttribute('desc') || undefined
				let templateLnodes: LNodeTemplate[] = []

				if (templateUuid) {
					const template = functionTemplates.find(
						(t) => t.uuid === templateUuid
					)
					if (template) {
						name = template.name
						desc = desc || template.desc
						templateLnodes = template.lnodes
					}
				}

				return {
					uuid: eqFunc.getAttribute('uuid') || '',
					name,
					desc,
					lnodes: templateLnodes
				}
			}
		)
	}
}

export function parseConductingEquipmentTemplate(
	element: Element,
	functionTemplates: FunctionTemplate[]
): ConductingEquipmentTemplate {
	return {
		uuid: element.getAttribute('uuid') || '',
		name: element.getAttribute('name') || 'Unnamed Equipment',
		type: element.getAttribute('type') || '',
		desc: element.getAttribute('desc') || undefined,
		virtual: element.getAttribute('virtual') === 'true',
		terminals: Array.from(element.querySelectorAll('Terminal')).map(
			(term) => ({
				uuid: term.getAttribute('uuid') || '',
				name: term.getAttribute('name') || '',
				connectivityNode: term.getAttribute('connectivityNode') || '',
				cNodeName: term.getAttribute('cNodeName') || ''
			})
		),
		eqFunctions: Array.from(element.querySelectorAll('EqFunction')).map(
			(eqFunc) => {
				const templateUuid = eqFunc.getAttribute('templateUuid')
				let name = eqFunc.getAttribute('name') || 'Unnamed EqFunction'
				let desc = eqFunc.getAttribute('desc') || undefined
				let templateLnodes: LNodeTemplate[] = []

				if (templateUuid) {
					const template = functionTemplates.find(
						(t) => t.uuid === templateUuid
					)
					if (template) {
						name = template.name
						desc = desc || template.desc
						templateLnodes = template.lnodes
					}
				}

				return {
					uuid: eqFunc.getAttribute('uuid') || '',
					name,
					desc,
					lnodes: templateLnodes
				}
			}
		)
	}
}

export function parseTemplates(doc: XMLDocument) {
	const templateBay = doc.querySelector(
		'Substation[name="TEMPLATE"] > VoltageLevel[name="TEMPLATE"] > Bay[name="TEMPLATE"]'
	)

	if (!templateBay) {
		return {
			functionTemplates: [] as FunctionTemplate[],
			generalEquipmentTemplates: [] as GeneralEquipmentTemplate[],
			conductingEquipmentTemplates: [] as ConductingEquipmentTemplate[]
		}
	}

	const functionTemplates = Array.from(
		templateBay.querySelectorAll(':scope > Function')
	).map((func) => parseFunctionTemplate(func))

	const generalEquipmentTemplates = Array.from(
		templateBay.querySelectorAll(':scope > GeneralEquipment')
	).map((ge) => parseGeneralEquipmentTemplate(ge, functionTemplates))

	const conductingEquipmentTemplates = Array.from(
		templateBay.querySelectorAll(':scope > ConductingEquipment')
	).map((ce) => parseConductingEquipmentTemplate(ce, functionTemplates))

	return {
		functionTemplates,
		generalEquipmentTemplates,
		conductingEquipmentTemplates
	}
}
