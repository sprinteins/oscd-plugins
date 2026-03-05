import type { Insert } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import type { FunctionTemplate, LNodeTemplate } from '@/headless/common-types'
import { buildEditsForDataTypeTemplates } from '@/headless/matching/scd-edits/data-types'
import { findInsertionReference } from '@/headless/matching/scd-edits/data-types/query-insertion-references'

export type LD0SourceFromFunction = {
	kind: 'function'
	functionTemplate: FunctionTemplate
}

export type LD0SourceDefault = {
	kind: 'default'
	onlyMandatoryDOs: boolean
}

export type LD0Source = LD0SourceFromFunction | LD0SourceDefault

type DODefinition = { name: string; type: string }

const LLN0_MANDATORY_DOS: DODefinition[] = [
	{ name: 'NamPlt', type: 'LPL' },
	{ name: 'Beh', type: 'ENS' },
	{ name: 'Health', type: 'ENS_Health' },
	{ name: 'Mod', type: 'ENC' }
]

const LLN0_OPTIONAL_DOS: DODefinition[] = [
	{ name: 'LocKey', type: 'SPS' },
	{ name: 'Loc', type: 'SPS' },
	{ name: 'LocSta', type: 'SPC' },
	{ name: 'Diag', type: 'SPC' },
	{ name: 'LEDRs', type: 'SPC' },
	{ name: 'SwModKey', type: 'SPC' },
	{ name: 'InRef', type: 'ORG' },
	{ name: 'GrRef', type: 'ORG' },
	{ name: 'MltLev', type: 'SPG' }
]

const LPHD_MANDATORY_DOS: DODefinition[] = [
	{ name: 'NamPlt', type: 'LPL' },
	{ name: 'PhyNam', type: 'DPL' },
	{ name: 'PhyHealth', type: 'ENS_Health' },
	{ name: 'Proxy', type: 'SPS' },
	{ name: 'MaxDl', type: 'ING' }
]

const LPHD_OPTIONAL_DOS: DODefinition[] = [
	{ name: 'OutOv', type: 'SPS' },
	{ name: 'InOv', type: 'SPS' },
	{ name: 'OpTmh', type: 'INS' },
	{ name: 'NumPwrUp', type: 'INS' },
	{ name: 'WrmStr', type: 'INS' },
	{ name: 'WacTrg', type: 'INS' },
	{ name: 'PwrUp', type: 'SPS' },
	{ name: 'PwrDn', type: 'SPS' },
	{ name: 'PwrSupAlm', type: 'SPS' },
	{ name: 'RsStat', type: 'SPC' },
	{ name: 'Sim', type: 'SPC' }
]

const DEFAULT_DO_TYPE_CDCS: Record<string, string> = {
	ENC: 'ENC',
	ENS: 'ENS',
	ENS_Health: 'ENS',
	LPL: 'LPL',
	SPS: 'SPS',
	DPL: 'DPL',
	SPC: 'SPC',
	ORG: 'ORG',
	SPG: 'SPG',
	INS: 'INS',
	ING: 'ING'
}

const LLN0_TYPE_ID_MANDATORY = 'LLN0_Default'
const LLN0_TYPE_ID_FULL = 'LLN0_Default_Full'
const LPHD_TYPE_ID_MANDATORY = 'LPHD_Default'
const LPHD_TYPE_ID_FULL = 'LPHD_Default_Full'

interface BuildLNodeTypeElementParams {
	doc: XMLDocument
	id: string
	lnClass: string
	dos: DODefinition[]
}

function buildLNodeTypeElement({
	doc,
	id,
	lnClass,
	dos
}: BuildLNodeTypeElementParams): Element {
	const lnType = createElement(doc, 'LNodeType', { id, lnClass })
	for (const { name, type } of dos) {
		const doEl = createElement(doc, 'DO', { name, type })
		lnType.appendChild(doEl)
	}
	return lnType
}

interface BuildDOTypeStubParams {
	doc: XMLDocument
	dataTypeTemplates: Element
	typeIds: Iterable<string>
	reference: Node | null
	queuedIds: Set<string>
}

function buildDOTypeStubs({
	doc,
	dataTypeTemplates,
	typeIds,
	reference,
	queuedIds
}: BuildDOTypeStubParams): Insert[] {
	const edits: Insert[] = []
	for (const id of typeIds) {
		if (dataTypeTemplates.querySelector(`DOType[id="${id}"]`)) continue
		if (queuedIds.has(id)) continue
		const cdc = DEFAULT_DO_TYPE_CDCS[id]
		if (!cdc) continue
		queuedIds.add(id)
		edits.push({
			node: createElement(doc, 'DOType', { id, cdc }),
			parent: dataTypeTemplates,
			reference
		})
	}
	return edits
}

function collectDOTypeIds(dos: DODefinition[]): Set<string> {
	return new Set(dos.map((d) => d.type))
}

type BuildLD0EditsParams = {
	doc: XMLDocument
	server: Element
	dataTypeTemplates: Element
	source: LD0Source
}

export function buildLD0Edits({
	doc,
	server,
	dataTypeTemplates,
	source
}: BuildLD0EditsParams): Insert[] {
	if (server.querySelector('LDevice[inst="LD0"]')) {
		console.warn(
			'[buildLD0Edits] LDevice[inst="LD0"] already exists in Server — skipping'
		)
		return []
	}

	if (source.kind === 'function') {
		return buildLD0EditsFromFunction({
			doc,
			server,
			dataTypeTemplates,
			source
		})
	}
	return buildLD0EditsFromDefault({ doc, server, dataTypeTemplates, source })
}

interface BuildLD0EditsFromFunctionParams {
	doc: XMLDocument
	server: Element
	dataTypeTemplates: Element
	source: LD0SourceFromFunction
}

function buildLD0EditsFromFunction({
	doc,
	server,
	dataTypeTemplates,
	source
}: BuildLD0EditsFromFunctionParams): Insert[] {
	const edits: Insert[] = []

	const lDevice = createElement(doc, 'LDevice', {
		inst: source.functionTemplate.name,
		ldName: source.functionTemplate.name
	})

	for (const lnode of source.functionTemplate.lnodes) {
		lDevice.appendChild(buildLNElement(doc, lnode))
	}

	edits.push({ node: lDevice, parent: server, reference: null })

	const typeEdits = buildEditsForDataTypeTemplates(
		doc,
		dataTypeTemplates,
		source.functionTemplate.lnodes
	)
	edits.push(...typeEdits)

	return edits
}

function buildLNElement(doc: XMLDocument, lnode: LNodeTemplate): Element {
	const tag = lnode.lnClass === 'LLN0' ? 'LN0' : 'LN'
	return createElement(doc, tag, {
		lnClass: lnode.lnClass,
		lnType: lnode.lnType,
		inst: lnode.lnInst
	})
}

interface BuildLD0EditsFromDefaultParams {
	doc: XMLDocument
	server: Element
	dataTypeTemplates: Element
	source: LD0SourceDefault
}

function buildLD0EditsFromDefault({
	doc,
	server,
	dataTypeTemplates,
	source
}: BuildLD0EditsFromDefaultParams): Insert[] {
	const edits: Insert[] = []

	const lln0TypeId = source.onlyMandatoryDOs
		? LLN0_TYPE_ID_MANDATORY
		: LLN0_TYPE_ID_FULL
	const lphdTypeId = source.onlyMandatoryDOs
		? LPHD_TYPE_ID_MANDATORY
		: LPHD_TYPE_ID_FULL

	const lDevice = createElement(doc, 'LDevice', {
		inst: 'LD0',
		ldName: 'LD0'
	})

	const ln0 = createElement(doc, 'LN0', {
		lnClass: 'LLN0',
		inst: '',
		lnType: lln0TypeId
	})
	lDevice.appendChild(ln0)

	const lphd = createElement(doc, 'LN', {
		lnClass: 'LPHD',
		inst: '1',
		lnType: lphdTypeId
	})
	lDevice.appendChild(lphd)

	edits.push({ node: lDevice, parent: server, reference: null })

	const lln0Dos = source.onlyMandatoryDOs
		? LLN0_MANDATORY_DOS
		: [...LLN0_MANDATORY_DOS, ...LLN0_OPTIONAL_DOS]

	const lphdDos = source.onlyMandatoryDOs
		? LPHD_MANDATORY_DOS
		: [...LPHD_MANDATORY_DOS, ...LPHD_OPTIONAL_DOS]

	const lnTypeRef = findInsertionReference(dataTypeTemplates, 'LNodeType')
	const doTypeRef = findInsertionReference(dataTypeTemplates, 'DOType')

	const queuedDOTypeIds = new Set<string>()

	if (!dataTypeTemplates.querySelector(`LNodeType[id="${lln0TypeId}"]`)) {
		edits.push({
			node: buildLNodeTypeElement({
				doc,
				id: lln0TypeId,
				lnClass: 'LLN0',
				dos: lln0Dos
			}),
			parent: dataTypeTemplates,
			reference: lnTypeRef
		})
	}

	if (!dataTypeTemplates.querySelector(`LNodeType[id="${lphdTypeId}"]`)) {
		edits.push({
			node: buildLNodeTypeElement({
				doc,
				id: lphdTypeId,
				lnClass: 'LPHD',
				dos: lphdDos
			}),
			parent: dataTypeTemplates,
			reference: lnTypeRef
		})
	}

	const referencedDOTypeIds = collectDOTypeIds([...lln0Dos, ...lphdDos])
	edits.push(
		...buildDOTypeStubs({
			doc,
			dataTypeTemplates,
			typeIds: referencedDOTypeIds,
			reference: doTypeRef,
			queuedIds: queuedDOTypeIds
		})
	)

	return edits
}
