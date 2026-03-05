import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildLD0Edits } from './ld0-edits'
import type { Insert } from '@openscd/oscd-api'
import type { FunctionTemplate } from '@/headless/common-types'

// The function-path delegates type copying to the existing utility which reads
// from ssdImportStore internally. We mock it to keep tests pure.
vi.mock('@/headless/matching/scd-edits/data-types', () => ({
	buildEditsForDataTypeTemplates: vi.fn().mockReturnValue([])
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeDoc(innerXml = ''): XMLDocument {
	return new DOMParser().parseFromString(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">${innerXml}</SCL>`,
		'application/xml'
	)
}

function makeServerAndDTT(doc: XMLDocument): {
	server: Element
	dataTypeTemplates: Element
} {
	const server = doc.createElement('Server')
	const dataTypeTemplates = doc.createElement('DataTypeTemplates')
	doc.documentElement.appendChild(dataTypeTemplates)
	return { server, dataTypeTemplates }
}

function nodeOf(edit: Insert): Element {
	return edit.node as Element
}

// ---------------------------------------------------------------------------
// Default path
// ---------------------------------------------------------------------------

describe('GIVEN buildLD0Edits is called with kind "default"', () => {
	describe('WHEN onlyMandatoryDOs is true', () => {
		let doc: XMLDocument
		let server: Element
		let dataTypeTemplates: Element
		let edits: ReturnType<typeof buildLD0Edits>

		beforeEach(() => {
			doc = makeDoc()
			;({ server, dataTypeTemplates } = makeServerAndDTT(doc))
			edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})
		})

		afterEach(() => {
			vi.restoreAllMocks()
		})

		it('THEN it creates a LDevice[inst="LD0"] Insert targeting server', () => {
			const lDeviceEdit = edits[0] as Insert
			expect(nodeOf(lDeviceEdit).tagName).toBe('LDevice')
			expect(nodeOf(lDeviceEdit).getAttribute('inst')).toBe('LD0')
			expect(nodeOf(lDeviceEdit).getAttribute('ldName')).toBe('LD0')
			expect(lDeviceEdit.parent).toBe(server)
		})

		it('THEN LDevice contains LN0[lnClass=LLN0] and LN[lnClass=LPHD]', () => {
			const lDevice = nodeOf(edits[0] as Insert)
			const ln0 = lDevice.querySelector('LN0')
			const lphd = lDevice.querySelector('LN[lnClass="LPHD"]')

			expect(ln0?.getAttribute('lnClass')).toBe('LLN0')
			expect(ln0?.getAttribute('lnType')).toBe('LLN0_Default')
			expect(ln0?.getAttribute('inst')).toBe('')
			expect(lphd?.getAttribute('lnType')).toBe('LPHD_Default')
			expect(lphd?.getAttribute('inst')).toBe('1')
		})

		it('THEN it creates exactly 4 DOs in LLN0_Default LNodeType (mandatory only)', () => {
			const lln0TypeInsert = edits.find(
				(e) =>
					nodeOf(e as Insert).getAttribute?.('id') === 'LLN0_Default'
			) as Insert
			const dos = nodeOf(lln0TypeInsert).querySelectorAll('DO')
			expect(dos).toHaveLength(4)
			expect(Array.from(dos).map((d) => d.getAttribute('name'))).toEqual([
				'NamPlt',
				'Beh',
				'Health',
				'Mod'
			])
		})

		it('THEN it creates exactly 5 DOs in LPHD_Default LNodeType (mandatory only)', () => {
			const lphdTypeInsert = edits.find(
				(e) =>
					nodeOf(e as Insert).getAttribute?.('id') === 'LPHD_Default'
			) as Insert
			const dos = nodeOf(lphdTypeInsert).querySelectorAll('DO')
			expect(dos).toHaveLength(5)
			expect(Array.from(dos).map((d) => d.getAttribute('name'))).toEqual([
				'NamPlt',
				'PhyNam',
				'PhyHealth',
				'Proxy',
				'MaxDl'
			])
		})

		it('THEN it emits DOType stubs only for types referenced by the mandatory DOs', () => {
			const doTypeIds = edits
				.map((e) => nodeOf(e as Insert))
				.filter((el) => el.tagName === 'DOType')
				.map((el) => el.getAttribute('id'))
				.sort()

			// Mandatory LLN0: LPL, ENS, ENS_Health, ENC
			// Mandatory LPHD: LPL (dup), DPL, ENS_Health (dup), SPS, ING
			expect(doTypeIds).toEqual(
				['DPL', 'ENC', 'ENS', 'ENS_Health', 'ING', 'LPL', 'SPS'].sort()
			)
		})
	})

	describe('WHEN onlyMandatoryDOs is false', () => {
		let doc: XMLDocument
		let server: Element
		let dataTypeTemplates: Element
		let edits: ReturnType<typeof buildLD0Edits>

		beforeEach(() => {
			doc = makeDoc()
			;({ server, dataTypeTemplates } = makeServerAndDTT(doc))
			edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: false }
			})
		})

		afterEach(() => {
			vi.restoreAllMocks()
		})

		it('THEN LN0 lnType is LLN0_Default_Full and LPHD lnType is LPHD_Default_Full', () => {
			const lDevice = nodeOf(edits[0] as Insert)
			expect(lDevice.querySelector('LN0')?.getAttribute('lnType')).toBe(
				'LLN0_Default_Full'
			)
			expect(
				lDevice
					.querySelector('LN[lnClass="LPHD"]')
					?.getAttribute('lnType')
			).toBe('LPHD_Default_Full')
		})

		it('THEN it creates 13 DOs in LLN0_Default_Full (4 mandatory + 9 optional)', () => {
			const lln0Insert = edits.find(
				(e) =>
					nodeOf(e as Insert).getAttribute?.('id') ===
					'LLN0_Default_Full'
			) as Insert
			expect(nodeOf(lln0Insert).querySelectorAll('DO')).toHaveLength(13)
		})

		it('THEN it creates 16 DOs in LPHD_Default_Full (5 mandatory + 11 optional)', () => {
			const lphdInsert = edits.find(
				(e) =>
					nodeOf(e as Insert).getAttribute?.('id') ===
					'LPHD_Default_Full'
			) as Insert
			expect(nodeOf(lphdInsert).querySelectorAll('DO')).toHaveLength(16)
		})
	})

	it('WHEN LDevice[inst="LD0"] already exists in server THEN it returns an empty array (idempotent)', () => {
		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)
		const existing = doc.createElement('LDevice')
		existing.setAttribute('inst', 'LD0')
		server.appendChild(existing)

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'default', onlyMandatoryDOs: true }
		})

		expect(edits).toHaveLength(0)
	})

	it('WHEN a LNodeType already exists in DataTypeTemplates THEN it skips the Insert for that id', () => {
		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)

		const existingLLN0 = doc.createElement('LNodeType')
		existingLLN0.setAttribute('id', 'LLN0_Default')
		dataTypeTemplates.appendChild(existingLLN0)

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'default', onlyMandatoryDOs: true }
		})

		const lln0Inserts = edits.filter(
			(e) => nodeOf(e as Insert).getAttribute?.('id') === 'LLN0_Default'
		)
		expect(lln0Inserts).toHaveLength(0)
	})

	describe('WHEN DataTypeTemplates ordering must be preserved', () => {
		it('THEN LNodeType inserts reference before a pre-existing DOType (not appended at end)', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const existingDOType = doc.createElement('DOType')
			existingDOType.setAttribute('id', 'SomeExistingType')
			dataTypeTemplates.appendChild(existingDOType)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			const lnTypeInserts = edits.filter(
				(e) => nodeOf(e as Insert).tagName === 'LNodeType'
			) as Insert[]

			// Both LNodeType inserts must reference the existing DOType,
			// meaning they land before it — not appended at end.
			expect(lnTypeInserts.length).toBeGreaterThan(0)
			for (const edit of lnTypeInserts) {
				expect(edit.reference).toBe(existingDOType)
			}
		})

		it('THEN DOType stub inserts land after existing DOTypes (not before them)', () => {
			// This is the core scenario from the bug: when a function path has already
			// committed $multi DOTypes (and possibly EnumTypes), a subsequent default
			// path must append its stubs after the existing DOTypes — not anchor them
			// to the LNodeType boundary, which would interleave them before the stubs.
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			// Simulate existing DOTypes committed by a previous function-path run
			const existingDOType1 = doc.createElement('DOType')
			existingDOType1.setAttribute('id', 'ExistingDO_1')
			dataTypeTemplates.appendChild(existingDOType1)

			const existingDOType2 = doc.createElement('DOType')
			existingDOType2.setAttribute('id', 'ExistingDO_2')
			dataTypeTemplates.appendChild(existingDOType2)

			const existingEnumType = doc.createElement('EnumType')
			existingEnumType.setAttribute('id', 'ExistingEnum')
			dataTypeTemplates.appendChild(existingEnumType)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			const doTypeInserts = edits.filter(
				(e) => nodeOf(e as Insert).tagName === 'DOType'
			) as Insert[]

			// Stubs must reference existingDOType2.nextSibling (= existingEnumType),
			// meaning they land after all existing DOTypes, before the EnumType —
			// NOT anchored to the LNodeType boundary.
			expect(doTypeInserts.length).toBeGreaterThan(0)
			for (const edit of doTypeInserts) {
				expect(edit.reference).toBe(existingEnumType)
			}
		})

		it('THEN DOType stub inserts reference before a pre-existing DAType', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const existingLNodeType = doc.createElement('LNodeType')
			existingLNodeType.setAttribute('id', 'SomeExistingLNodeType')
			dataTypeTemplates.appendChild(existingLNodeType)

			const existingDAType = doc.createElement('DAType')
			existingDAType.setAttribute('id', 'SomeDaType')
			dataTypeTemplates.appendChild(existingDAType)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			const doTypeInserts = edits.filter(
				(e) => nodeOf(e as Insert).tagName === 'DOType'
			) as Insert[]

			// All DOType stubs must reference before the existing DAType.
			expect(doTypeInserts.length).toBeGreaterThan(0)
			for (const edit of doTypeInserts) {
				expect(edit.reference).toBe(existingDAType)
			}
		})

		it('THEN type-only edits are ordered: all LNodeTypes before all DOTypes', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			// Exclude the LDevice edit; only look at type inserts
			const typeEdits = edits.filter((e) => {
				const tag = nodeOf(e as Insert).tagName
				return tag === 'LNodeType' || tag === 'DOType'
			})

			const tags = typeEdits.map((e) => nodeOf(e as Insert).tagName)
			const firstDOType = tags.indexOf('DOType')
			const lastLNodeType = tags.lastIndexOf('LNodeType')

			// Every LNodeType must appear before every DOType
			expect(lastLNodeType).toBeLessThan(firstDOType)
		})
	})

	it('WHEN DataTypeTemplates is freshly created (not yet committed) THEN all type inserts have reference null and LNodeTypes appear before DOTypes', () => {
		const doc = makeDoc()
		const server = doc.createElement('Server')
		// Simulate ensureDataTypeTemplates: element created but NOT appended to doc yet
		const dataTypeTemplates = doc.createElement('DataTypeTemplates')

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'default', onlyMandatoryDOs: true }
		})

		const typeEdits = edits
			.slice(1) // skip LDevice
			.map((e) => e as Insert)

		// All inserts must reference null (append-order), since DTT is empty
		for (const edit of typeEdits) {
			expect(edit.reference).toBeNull()
		}

		// LNodeType inserts must come before DOType inserts
		const tags = typeEdits.map((e) => nodeOf(e).tagName)
		const firstDOType = tags.indexOf('DOType')
		const lastLNodeType = tags.lastIndexOf('LNodeType')
		expect(lastLNodeType).toBeLessThan(firstDOType)
	})

	it('WHEN called THEN it produces no duplicate LNodeType or DOType IDs within a single call', () => {
		// Each buildLD0Edits call is self-contained: within one call, the same
		// type ID is never emitted twice (e.g. LPL is shared by LLN0 & LPHD DOs).
		// Cross-call deduplication (two calls, same dataTypeTemplates, no commit
		// in between) is the CALLER's responsibility — the same limitation exists
		// in buildEditsForDataTypeTemplates.
		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'default', onlyMandatoryDOs: true }
		})

		const typeInserts = edits.filter((e) => {
			const tag = nodeOf(e as Insert).tagName
			return tag === 'LNodeType' || tag === 'DOType'
		})

		const ids = typeInserts.map((e) =>
			nodeOf(e as Insert).getAttribute('id')
		)
		const uniqueIds = new Set(ids)

		// Every type ID must appear exactly once within the single call
		expect(ids.length).toBe(uniqueIds.size)
	})
})

// ---------------------------------------------------------------------------
// Function path
// ---------------------------------------------------------------------------

describe('GIVEN buildLD0Edits is called with kind "function"', () => {
	const lln0Template: FunctionTemplate = {
		uuid: 'func-uuid-1',
		name: 'LD0Func',
		lnodes: [
			{ lnClass: 'LLN0', lnType: 'LLN0_Custom', lnInst: '' },
			{ lnClass: 'LPHD', lnType: 'LPHD_Custom', lnInst: '1' }
		]
	}

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('WHEN LDevice does not yet exist THEN it creates LDevice[inst="LD0Func"] targeting server', () => {
		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'function', functionTemplate: lln0Template }
		})

		const lDeviceEdit = edits[0] as Insert
		expect(nodeOf(lDeviceEdit).tagName).toBe('LDevice')
		expect(nodeOf(lDeviceEdit).getAttribute('inst')).toBe('LD0Func')
		expect(lDeviceEdit.parent).toBe(server)
	})

	it('WHEN the template has LLN0 and LPHD lnodes THEN it creates LN0 for LLN0 and LN for other lnClasses', () => {
		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'function', functionTemplate: lln0Template }
		})

		const lDevice = nodeOf(edits[0] as Insert)
		expect(lDevice.querySelector('LN0')?.getAttribute('lnClass')).toBe(
			'LLN0'
		)
		expect(lDevice.querySelector('LN')?.getAttribute('lnClass')).toBe(
			'LPHD'
		)
	})

	it('WHEN called THEN it delegates data type building to buildEditsForDataTypeTemplates', async () => {
		const { buildEditsForDataTypeTemplates } = await import(
			'@/headless/matching/scd-edits/data-types'
		)

		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)

		buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'function', functionTemplate: lln0Template }
		})

		expect(buildEditsForDataTypeTemplates).toHaveBeenCalledWith(
			doc,
			dataTypeTemplates,
			lln0Template.lnodes
		)
	})

	it('WHEN LDevice[inst="LD0"] already exists THEN it returns an empty array (idempotent)', () => {
		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)
		const existing = doc.createElement('LDevice')
		existing.setAttribute('inst', 'LD0')
		server.appendChild(existing)

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'function', functionTemplate: lln0Template }
		})

		expect(edits).toHaveLength(0)
	})
})
