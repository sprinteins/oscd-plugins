import type { LNodeType, DOType, DAType, EnumType } from '@/headless/types'

export function parseDataTypeTemplates(doc: XMLDocument) {
	const dataTypeTemplates = doc.querySelector('SCL > DataTypeTemplates')

	if (!dataTypeTemplates) {
		return {
			lnodeTypes: [] as LNodeType[],
			doTypes: [] as DOType[],
			daTypes: [] as DAType[],
			enumTypes: [] as EnumType[]
		}
	}

	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	).map((el) => ({
		id: el.getAttribute('id') || '',
		lnClass: el.getAttribute('lnClass') || '',
		desc: el.getAttribute('desc') || undefined,
		dataObjects: Array.from(el.querySelectorAll('DO')).map((doEl) => ({
			name: doEl.getAttribute('name') || '',
			type: doEl.getAttribute('type') || '',
			accessControl: doEl.getAttribute('accessControl') || undefined,
			transient: doEl.getAttribute('transient') === 'true',
			desc: doEl.getAttribute('desc') || undefined
		}))
	}))

	const doTypes = Array.from(
		dataTypeTemplates.querySelectorAll('DOType')
	).map((el) => ({
		id: el.getAttribute('id') || '',
		cdc: el.getAttribute('cdc') || '',
		dataAttributes: Array.from(el.querySelectorAll('DA')).map((daEl) => ({
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
	}))

	const daTypes = Array.from(
		dataTypeTemplates.querySelectorAll('DAType')
	).map((el) => ({ id: el.getAttribute('id') || '' }))

	const enumTypes = Array.from(
		dataTypeTemplates.querySelectorAll('EnumType')
	).map((el) => ({ id: el.getAttribute('id') || '' }))

	return { lnodeTypes, doTypes, daTypes, enumTypes }
}
