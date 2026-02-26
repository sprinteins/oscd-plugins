import type { Insert } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import type { FunctionTemplate, LNodeTemplate } from '@/headless/common-types'
import { buildEditsForDataTypeTemplates } from '@/headless/matching/scd-edits/data-types'

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Use an SSD-derived Function template that contains an LLN0 LNode.
 * All its LNodes are inserted into a new LDevice[inst="LD0"].
 * Referenced LNodeTypes + DOTypes are copied from the SSD document.
 */
export type LD0SourceFromFunction = {
	kind: 'function'
	functionTemplate: FunctionTemplate
}

/**
 * Create a default LD0 using the built-in IEC 61850-7-4 definitions (LLN0 + LPHD).
 * `onlyMandatoryDOs`: when true only mandatory DOs from the standard are added;
 * when false all optional DOs from the reference XML are included as well.
 */
export type LD0SourceDefault = {
	kind: 'default'
	onlyMandatoryDOs: boolean
}

export type LD0Source = LD0SourceFromFunction | LD0SourceDefault

// ---------------------------------------------------------------------------
// IEC 61850-7-4 default DO definitions (from reference XML)
// ---------------------------------------------------------------------------

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

/** Minimal CDC-only DOType stubs — covers all DO types referenced by default LLN0 + LPHD */
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

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildLNodeTypeElement(
	doc: XMLDocument,
	id: string,
	lnClass: string,
	dos: DODefinition[]
): Element {
	const lnType = createElement(doc, 'LNodeType', { id, lnClass })
	for (const { name, type } of dos) {
		const doEl = createElement(doc, 'DO', { name, type })
		lnType.appendChild(doEl)
	}
	return lnType
}

function buildDOTypeStubs(
	doc: XMLDocument,
	dataTypeTemplates: Element,
	typeIds: Iterable<string>
): Insert[] {
	const edits: Insert[] = []
	for (const id of typeIds) {
		// Skip if already in the document
		if (dataTypeTemplates.querySelector(`DOType[id="${id}"]`)) continue
		const cdc = DEFAULT_DO_TYPE_CDCS[id]
		if (!cdc) continue
		edits.push({
			node: createElement(doc, 'DOType', { id, cdc }),
			parent: dataTypeTemplates,
			reference: null
		})
	}
	return edits
}

function collectDOTypeIds(dos: DODefinition[]): Set<string> {
	return new Set(dos.map((d) => d.type))
}

// ---------------------------------------------------------------------------
// buildLD0Edits
// ---------------------------------------------------------------------------

type BuildLD0EditsParams = {
	doc: XMLDocument
	/** Server element that will parent the new LDevice */
	server: Element
	/** DataTypeTemplates element (must already exist) */
	dataTypeTemplates: Element
	source: LD0Source
}

/**
 * Build Insert edits to create an LD0 LDevice inside `server`.
 *
 * Returns an empty array when LDevice[inst="LD0"] already exists in `server`
 * (idempotent).
 *
 * This function is pure: it never calls `editor.commit()`.
 * The caller is responsible for committing the returned edits.
 */
export function buildLD0Edits({
	doc,
	server,
	dataTypeTemplates,
	source
}: BuildLD0EditsParams): Insert[] {
	// Guard: LD0 already present
	if (server.querySelector('LDevice[inst="LD0"]')) {
		return []
	}

	if (source.kind === 'function') {
		return buildLD0EditsFromFunction(doc, server, dataTypeTemplates, source)
	}

	return buildLD0EditsFromDefault(doc, server, dataTypeTemplates, source)
}

// ---------------------------------------------------------------------------
// kind: 'function' path
// ---------------------------------------------------------------------------

function buildLD0EditsFromFunction(
	doc: XMLDocument,
	server: Element,
	dataTypeTemplates: Element,
	source: LD0SourceFromFunction
): Insert[] {
	const edits: Insert[] = []

	const lDevice = createElement(doc, 'LDevice', { inst: 'LD0' })

	for (const lnode of source.functionTemplate.lnodes) {
		lDevice.appendChild(buildLNElement(doc, lnode))
	}

	edits.push({ node: lDevice, parent: server, reference: null })

	// Copy referenced LNodeTypes + DOTypes from the SSD document.
	// buildEditsForDataTypeTemplates reads ssdImportStore.loadedSSDDocument
	// internally — acceptable coupling in the current pre-refactor state.
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

// ---------------------------------------------------------------------------
// kind: 'default' path
// ---------------------------------------------------------------------------

function buildLD0EditsFromDefault(
	doc: XMLDocument,
	server: Element,
	dataTypeTemplates: Element,
	source: LD0SourceDefault
): Insert[] {
	const edits: Insert[] = []

	// --- LDevice with LN0 + LPHD built in-memory ---
	const lDevice = createElement(doc, 'LDevice', { inst: 'LD0', ldName: 'LD0' })

	const ln0 = createElement(doc, 'LN0', {
		lnClass: 'LLN0',
		inst: '',
		lnType: 'LLN0_Default'
	})
	lDevice.appendChild(ln0)

	const lphd = createElement(doc, 'LN', {
		lnClass: 'LPHD',
		inst: '1',
		lnType: 'LPHD_Default'
	})
	lDevice.appendChild(lphd)

	edits.push({ node: lDevice, parent: server, reference: null })

	// --- LNodeTypes (skip if already in document) ---
	const lln0Dos = source.onlyMandatoryDOs
		? LLN0_MANDATORY_DOS
		: [...LLN0_MANDATORY_DOS, ...LLN0_OPTIONAL_DOS]

	const lphdDos = source.onlyMandatoryDOs
		? LPHD_MANDATORY_DOS
		: [...LPHD_MANDATORY_DOS, ...LPHD_OPTIONAL_DOS]

	if (!dataTypeTemplates.querySelector('LNodeType[id="LLN0_Default"]')) {
		edits.push({
			node: buildLNodeTypeElement(doc, 'LLN0_Default', 'LLN0', lln0Dos),
			parent: dataTypeTemplates,
			reference: null
		})
	}

	if (!dataTypeTemplates.querySelector('LNodeType[id="LPHD_Default"]')) {
		edits.push({
			node: buildLNodeTypeElement(doc, 'LPHD_Default', 'LPHD', lphdDos),
			parent: dataTypeTemplates,
			reference: null
		})
	}

	// --- DOType stubs for all DO types referenced by the chosen set of DOs ---
	const referencedDOTypeIds = collectDOTypeIds([...lln0Dos, ...lphdDos])
	edits.push(...buildDOTypeStubs(doc, dataTypeTemplates, referencedDOTypeIds))

	return edits
}
