import type {
	LNodeType,
	DOType,
	DAType,
	EnumType
} from '@/headless/common-types'
import {
	queryDAsInsideDOType,
	queryDataTypeTemplates,
	queryDATypesInsideDataTypeTemplates,
	queryDOsInsideLNodeType,
	queryDOTypesInsideDataTypeTemplates,
	queryEnumTypesInsideDataTypeTemplates,
	queryLNodesInDataTypeTemplates
} from '@/headless/xml-querries'

export function parseDataTypeTemplates(doc: XMLDocument) {
	const dataTypeTemplates = queryDataTypeTemplates(doc)

	if (!dataTypeTemplates) {
		return {
			lnodeTypes: [] as LNodeType[],
			doTypes: [] as DOType[],
			daTypes: [] as DAType[],
			enumTypes: [] as EnumType[]
		}
	}

	const lnodeTypes = queryLNodesInDataTypeTemplates(dataTypeTemplates).map(
		(el) => ({
			id: el.getAttribute('id') || '',
			lnClass: el.getAttribute('lnClass') || '',
			desc: el.getAttribute('desc') || undefined,
			dataObjects: queryDOsInsideLNodeType(el).map((doEl) => ({
				name: doEl.getAttribute('name') || '',
				type: doEl.getAttribute('type') || '',
				accessControl: doEl.getAttribute('accessControl') || undefined,
				transient: doEl.getAttribute('transient') === 'true',
				desc: doEl.getAttribute('desc') || undefined
			}))
		})
	)

	const doTypes = queryDOTypesInsideDataTypeTemplates(dataTypeTemplates).map(
		(el) => ({
			id: el.getAttribute('id') || '',
			cdc: el.getAttribute('cdc') || '',
			dataAttributes: queryDAsInsideDOType(el).map((daEl) => ({
				name: daEl.getAttribute('name') || '',
				bType: daEl.getAttribute('bType') || '',
				fc: daEl.getAttribute('fc') || '',
				type: daEl.getAttribute('type') || undefined,
				sAddr: daEl.getAttribute('sAddr') || undefined,
				valKind: daEl.getAttribute('valKind') || undefined,
				count: daEl.getAttribute('count') || undefined,
				valImport: daEl.getAttribute('valImport') === 'true',
				dchg: daEl.getAttribute('dchg') === 'true',
				qchg: daEl.getAttribute('qchg') === 'true',
				dupd: daEl.getAttribute('dupd') === 'true',
				desc: daEl.getAttribute('desc') || undefined
			}))
		})
	)

	const daTypes = queryDATypesInsideDataTypeTemplates(dataTypeTemplates).map(
		(el) => ({ id: el.getAttribute('id') || '' })
	)

	const enumTypes = queryEnumTypesInsideDataTypeTemplates(
		dataTypeTemplates
	).map((el) => ({ id: el.getAttribute('id') || '' }))

	return { lnodeTypes, doTypes, daTypes, enumTypes }
}
