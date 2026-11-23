import { webcrypto } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RawLogical } from '@/headless/stores'
import {
	getLogical,
	removeLogical,
	updateLogical
} from './common-crud-operation.helper'

const mocks = vi.hoisted(() => {
	const iedStore = {
		selectedIED: undefined as { element: Element } | undefined,
		createIedRequiredElements: vi.fn(),
		get currentIedSubElements() {
			return {
				lDevice:
					this.selectedIED?.element.querySelector(
						'LDevice[inst="LD0"]'
					) || undefined
			}
		}
	}

	const pluginLocalStore = {
		rootElement: undefined as Element | undefined,
		rootSubElements: {
			dataTypeTemplates: undefined as Element | undefined
		},
		createElement: vi.fn(
			(params: {
				tagName: string
				attributes?: Record<string, string | null>
				innerHTML?: string
				parent: Element
			}) => {
				const element = params.parent.ownerDocument.createElement(
					params.tagName
				)
				for (const [name, value] of Object.entries(
					params.attributes ?? {}
				)) {
					if (value !== null) element.setAttribute(name, value)
				}
				if (params.innerHTML) element.innerHTML = params.innerHTML
				params.parent.append(element)
				return element
			}
		)
	}

	const pluginGlobalStore = {
		xmlDocument: undefined as Document | undefined,
		host: undefined as EventTarget | undefined,
		updateElement: vi.fn(
			(params: {
				element: Element
				attributes: Record<string, string | null>
			}) => {
				for (const [name, value] of Object.entries(params.attributes))
					if (value !== null) params.element.setAttribute(name, value)
			}
		)
	}

	return {
		iedStore,
		pluginLocalStore,
		pluginGlobalStore,
		logicalStore: {
			hasLNodeTypeOfClass: vi.fn(() => true)
		}
	}
})

vi.mock('@/headless/stores', () => ({
	iedStore: mocks.iedStore,
	pluginLocalStore: mocks.pluginLocalStore,
	logicalStore: mocks.logicalStore
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	createAndDispatchEditEvent: vi.fn(
		({
			edit
		}: {
			edit:
				| { node: Element }
				| { element: Element; attributes: Record<string, string> }
				| Array<
						| { node: Element }
						| {
								element: Element
								attributes: Record<string, string>
						  }
				  >
		}) => {
			for (const operation of Array.isArray(edit) ? edit : [edit]) {
				if ('node' in operation) {
					operation.node.remove()
				} else {
					for (const name of operation.element.getAttributeNames())
						operation.element.removeAttribute(name)
					for (const [name, value] of Object.entries(
						operation.attributes
					))
						operation.element.setAttribute(name, value)
				}
			}
		}
	),
	getAttributes: vi.fn((element: Element) =>
		Object.fromEntries(
			element
				.getAttributeNames()
				.map((name) => [name, element.getAttribute(name)])
		)
	)
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: mocks.pluginGlobalStore
}))

let document: Document

beforeEach(() => {
	vi.stubGlobal('crypto', webcrypto)

	document = new DOMParser().parseFromString(
		`<SCL>
			<DataTypeTemplates>
				<LNodeType id="IOCenter.LCIV" lnClass="LCIV" />
			</DataTypeTemplates>
			<IED name="IED1">
				<AccessPoint>
					<Server>
						<LDevice inst="LD0">
							<LN uuid="ln-lciv-1" lnClass="LCIV" inst="1" lnType="IOCenter.LCIV" numberOfPorts="2" desc="Old" prefix="P">
								<DOI uuid="doi-0" name="In-0" />
								<DOI uuid="doi-1" name="In-1" />
							</LN>
							<LN uuid="ln-lciv-3" lnClass="LCIV" inst="3" lnType="IOCenter.LCIV" />
						</LDevice>
					</Server>
				</AccessPoint>
			</IED>
		</SCL>`,
		'application/xml'
	)
	const ied = document.querySelector('IED')
	const dataTypeTemplates = document.querySelector('DataTypeTemplates')
	if (!ied || !dataTypeTemplates) throw new Error('Expected SCD fixture')
	mocks.iedStore.selectedIED = { element: ied }
	mocks.iedStore.createIedRequiredElements.mockClear()
	mocks.pluginLocalStore.rootElement = document.documentElement
	mocks.pluginLocalStore.rootSubElements.dataTypeTemplates = dataTypeTemplates
	mocks.pluginLocalStore.createElement.mockClear()
	mocks.pluginGlobalStore.xmlDocument = document
	mocks.pluginGlobalStore.host = new EventTarget()
	mocks.pluginGlobalStore.updateElement.mockClear()
})

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

describe('GIVEN an existing logical', () => {
	let logical: RawLogical<'LCIV'>

	beforeEach(() => {
		;[logical] = getLogical({
			logicalKind: 'conditioner',
			logicalClass: ['LCIV']
		})
	})

	it('WHEN optional values are cleared THEN empty attributes are removed', () => {
		updateLogical({
			...logical,
			attributes: {
				...logical.attributes,
				desc: null,
				prefix: null
			}
		})

		expect(logical.element.hasAttribute('desc')).toBe(false)
		expect(logical.element.hasAttribute('prefix')).toBe(false)
	})

	it('WHEN it is removed THEN later instances of the same class are renumbered', () => {
		removeLogical(logical)

		expect(
			Array.from(
				document.querySelectorAll(
					'LDevice[inst="LD0"] > LN[lnClass="LCIV"]'
				)
			).map((element) => element.getAttribute('inst'))
		).toEqual(['2'])
	})
})
