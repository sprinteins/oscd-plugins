import type {
	FunctionTemplate,
	ConductingEquipmentTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import {
	queryTemplateBay,
	queryFunctionsInTemplateBay,
	queryConductingEquipmentInTemplateBay,
	queryLNodesInFunction,
	queryTerminalsInEquipment,
	queryEqFunctionsInEquipment
} from '@/headless/xml-querries/xml-querries'

export function parseFunctionTemplate(element: Element): FunctionTemplate {
	return {
		uuid: element.getAttribute('uuid') || '',
		name: element.getAttribute('name') || 'Unnamed Function',
		desc: element.getAttribute('desc') || undefined,
		lnodes: queryLNodesInFunction(element).map((ln) => ({
			lnClass: ln.getAttribute('lnClass') || '',
			lnInst: ln.getAttribute('lnInst') || '',
			lnType: ln.getAttribute('lnType') || '',
			uuid: ln.getAttribute('uuid') || '',
			iedName: ln.getAttribute('iedName') || undefined,
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
		terminals: queryTerminalsInEquipment(element).map(
			(term) => ({
				uuid: term.getAttribute('uuid') || '',
				name: term.getAttribute('name') || '',
				connectivityNode: term.getAttribute('connectivityNode') || '',
				cNodeName: term.getAttribute('cNodeName') || ''
			})
		),
		eqFunctions: queryEqFunctionsInEquipment(element).map(
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
	const templateBay = queryTemplateBay(doc)

	if (!templateBay) {
		return {
			functionTemplates: [] as FunctionTemplate[],
			conductingEquipmentTemplates: [] as ConductingEquipmentTemplate[]
		}
	}

	const functionTemplates = queryFunctionsInTemplateBay(templateBay).map((func) =>
		parseFunctionTemplate(func)
	)

	const conductingEquipmentTemplates = queryConductingEquipmentInTemplateBay(
		templateBay
	).map((ce) => parseConductingEquipmentTemplate(ce, functionTemplates))

	return { functionTemplates, conductingEquipmentTemplates }
}
