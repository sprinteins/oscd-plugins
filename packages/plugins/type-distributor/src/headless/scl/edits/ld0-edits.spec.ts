import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('buildLD0Edits — kind: default', () => {
	describe('WHEN onlyMandatoryDOs is true', () => {
		it('creates a LDevice[inst="LD0"] Insert targeting server', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			const lDeviceEdit = edits[0] as Insert
			expect(nodeOf(lDeviceEdit).tagName).toBe('LDevice')
			expect(nodeOf(lDeviceEdit).getAttribute('inst')).toBe('LD0')
			expect(nodeOf(lDeviceEdit).getAttribute('ldName')).toBe('LD0')
			expect(lDeviceEdit.parent).toBe(server)
		})

		it('LDevice contains LN0[lnClass=LLN0] and LN[lnClass=LPHD]', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			const lDevice = nodeOf(edits[0] as Insert)
			const ln0 = lDevice.querySelector('LN0')
			const lphd = lDevice.querySelector('LN[lnClass="LPHD"]')

			expect(ln0?.getAttribute('lnClass')).toBe('LLN0')
			expect(ln0?.getAttribute('lnType')).toBe('LLN0_Default')
			expect(ln0?.getAttribute('inst')).toBe('')
			expect(lphd?.getAttribute('lnType')).toBe('LPHD_Default')
			expect(lphd?.getAttribute('inst')).toBe('1')
		})

		it('creates exactly 4 DOs in LLN0_Default LNodeType (mandatory only)', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			const lln0TypeInsert = edits.find(
				(e) => nodeOf(e as Insert).getAttribute?.('id') === 'LLN0_Default'
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

		it('creates exactly 5 DOs in LPHD_Default LNodeType (mandatory only)', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

			const lphdTypeInsert = edits.find(
				(e) => nodeOf(e as Insert).getAttribute?.('id') === 'LPHD_Default'
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

		it('emits DOType stubs only for types referenced by the mandatory DOs', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: true }
			})

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
		it('creates 13 DOs in LLN0_Default (4 mandatory + 9 optional)', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: false }
			})

			const lln0Inserts = edits.find(
				(e) => nodeOf(e as Insert).getAttribute?.('id') === 'LLN0_Default'
			) as Insert
			expect(nodeOf(lln0Inserts).querySelectorAll('DO')).toHaveLength(13)
		})

		it('creates 16 DOs in LPHD_Default (5 mandatory + 11 optional)', () => {
			const doc = makeDoc()
			const { server, dataTypeTemplates } = makeServerAndDTT(doc)

			const edits = buildLD0Edits({
				doc,
				server,
				dataTypeTemplates,
				source: { kind: 'default', onlyMandatoryDOs: false }
			})

			const lphdInsert = edits.find(
				(e) => nodeOf(e as Insert).getAttribute?.('id') === 'LPHD_Default'
			) as Insert
			expect(nodeOf(lphdInsert).querySelectorAll('DO')).toHaveLength(16)
		})
	})

	describe('WHEN LDevice[inst="LD0"] already exists', () => {
		it('returns an empty array (idempotent)', () => {
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
	})

	describe('WHEN LNodeType already exists in DataTypeTemplates', () => {
		it('skips the LNodeType Insert for that id', () => {
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
	})
})

// ---------------------------------------------------------------------------
// Function path
// ---------------------------------------------------------------------------

describe('buildLD0Edits — kind: function', () => {
	const lln0Template: FunctionTemplate = {
		uuid: 'func-uuid-1',
		name: 'LD0Func',
		lnodes: [
			{ lnClass: 'LLN0', lnType: 'LLN0_Custom', lnInst: '' },
			{ lnClass: 'LPHD', lnType: 'LPHD_Custom', lnInst: '1' }
		]
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('creates LDevice[inst="LD0"] Insert targeting server', () => {
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
		expect(nodeOf(lDeviceEdit).getAttribute('inst')).toBe('LD0')
		expect(lDeviceEdit.parent).toBe(server)
	})

	it('creates LN0 for LLN0 lnode and LN for others', () => {
		const doc = makeDoc()
		const { server, dataTypeTemplates } = makeServerAndDTT(doc)

		const edits = buildLD0Edits({
			doc,
			server,
			dataTypeTemplates,
			source: { kind: 'function', functionTemplate: lln0Template }
		})

		const lDevice = nodeOf(edits[0] as Insert)
		expect(lDevice.querySelector('LN0')?.getAttribute('lnClass')).toBe('LLN0')
		expect(lDevice.querySelector('LN')?.getAttribute('lnClass')).toBe('LPHD')
	})

	it('calls buildEditsForDataTypeTemplates with the function lnodes', async () => {
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

	it('returns empty array when LDevice[inst="LD0"] already exists (idempotent)', () => {
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
