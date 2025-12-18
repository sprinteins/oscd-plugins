import type {
	FunctionTemplate,
	ConductingEquipmentTemplate,
	LNodeRef
} from '@/headless/types'

export function parseFunctionTemplate(element: Element): FunctionTemplate {
	return {
		uuid: element.getAttribute('uuid') || '',
		name: element.getAttribute('name') || 'Unnamed Function',
		desc: element.getAttribute('desc') || undefined,
		lnodes: Array.from(element.querySelectorAll('LNode')).map((ln) => ({
			lnClass: ln.getAttribute('lnClass') || '',
			lnInst: ln.getAttribute('lnInst') || '',
			lnType: ln.getAttribute('lnType') || '',
			iedName: ln.getAttribute('iedName') || undefined,
			uuid: ln.getAttribute('uuid') || undefined
		}))
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
				let templateLnodes: LNodeRef[] = []

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

export function parseTemplates(doc?: XMLDocument | null) {
	if (!doc)
		return {
			functionTemplates: [],
			conductingEquipmentTemplates: []
		}

	const templateBay = doc.querySelector(
		'Substation[name="TEMPLATE"] > VoltageLevel[name="TEMPLATE"] > Bay[name="TEMPLATE"]'
	)

	if (!templateBay) {
		return {
			functionTemplates: [] as FunctionTemplate[],
			conductingEquipmentTemplates: [] as ConductingEquipmentTemplate[]
		}
	}

	const functionTemplates = Array.from(
		templateBay.querySelectorAll(':scope > Function')
	).map((func) => parseFunctionTemplate(func))

	const conductingEquipmentTemplates = Array.from(
		templateBay.querySelectorAll(':scope > ConductingEquipment')
	).map((ce) => parseConductingEquipmentTemplate(ce, functionTemplates))

	return { functionTemplates, conductingEquipmentTemplates }
}
