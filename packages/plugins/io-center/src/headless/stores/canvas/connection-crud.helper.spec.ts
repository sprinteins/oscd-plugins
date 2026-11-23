import { webcrypto } from 'node:crypto'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { PORT_KIND, PORT_SIDE } from '@/headless/constants'
import type { PortConfig } from '@/headless/stores'
import { createConnection, getConnectionsUuids } from './connection-crud.helper'

const mocks = vi.hoisted(() => ({
	canvasStore: {
		currentPortSource: null as PortConfig | null,
		currentPortTarget: null as PortConfig | null,
		connectionUuids: [] as Array<{
			dOISource: string
			lNRefTarget: string
		}>
	},
	iedStore: {
		selectedIED: undefined as { element: Element } | undefined,
		selectedDataObjects: [] as Array<{ ports: PortConfig[] }>
	},
	pluginLocalStore: {
		rootSubElements: {
			ied: undefined as HTMLCollectionOf<Element> | undefined
		},
		createElement: vi.fn(
			(params: {
				tagName: string
				attributes?: Record<string, string | null>
				parent: Element
			}) => {
				const document = params.parent.ownerDocument
				const element = document.createElement(params.tagName)
				for (const [name, value] of Object.entries(
					params.attributes ?? {}
				)) {
					if (value !== null) element.setAttribute(name, value)
				}
				params.parent.append(element)
				return element
			}
		)
	},
	pluginGlobalStore: {
		host: undefined as EventTarget | undefined
	}
}))

vi.mock('@/headless/stores', () => ({
	canvasStore: mocks.canvasStore,
	iedStore: mocks.iedStore,
	pluginLocalStore: mocks.pluginLocalStore,
	logicalStore: {}
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: mocks.pluginGlobalStore
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	createAndDispatchEditEvent: vi.fn(),
	typeGuard: {
		isPropertyOfObject: (value: PropertyKey, object: object) =>
			Object.hasOwn(object, value),
		isTuplesIncludingString: (value: string, tuple: readonly string[]) =>
			tuple.includes(value)
	}
}))

const spsDataObject: PortConfig = {
	kind: PORT_KIND.dataObject,
	allowedTarget: {
		kind: PORT_KIND.logicalConditioner,
		side: PORT_SIDE.left
	},
	name: 'Pos',
	side: PORT_SIDE.right,
	index: 0,
	commonDataClass: 'sps',
	payload: {
		uuid: 'data-object-port',
		ldInst: 'LD1',
		lnUuid: 'source-ln',
		lnClass: '',
		lnInst: '1'
	}
}

const lcbiConditioner: PortConfig = {
	kind: PORT_KIND.logicalConditioner,
	allowedTarget: {
		kind: PORT_KIND.dataObject,
		side: PORT_SIDE.right
	},
	name: 'OutInd',
	side: PORT_SIDE.left,
	index: 0,
	payload: {
		uuid: 'conditioner-port',
		ldInst: 'LD0',
		lnUuid: 'conditioner-ln',
		lnClass: 'LCBI',
		lnInst: '1'
	}
}

let document: Document

beforeEach(() => {
	vi.stubGlobal('crypto', webcrypto)
	document = new DOMParser().parseFromString(
		`<SCL>
			<IED name="IED1">
				<AccessPoint>
					<Server>
						<LDevice inst="LD0">
							<LN uuid="conditioner-ln" lnClass="LCBI" inst="1" />
						</LDevice>
					</Server>
				</AccessPoint>
			</IED>
		</SCL>`,
		'application/xml'
	)
	const ied = document.querySelector('IED')
	if (!ied) throw new Error('Expected IED fixture')
	mocks.iedStore.selectedIED = {
		element: ied
	}
	mocks.iedStore.selectedDataObjects = [{ ports: [spsDataObject] }]
	mocks.pluginLocalStore.rootSubElements.ied =
		document.getElementsByTagName('IED')
	mocks.pluginLocalStore.createElement.mockClear()
	mocks.pluginGlobalStore.host = new EventTarget()
	mocks.canvasStore.currentPortSource = lcbiConditioner
	mocks.canvasStore.currentPortTarget = spsDataObject
	mocks.canvasStore.connectionUuids = []
})

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

it('GIVEN an SPS data object and an LCBI conditioner WHEN a connection is created THEN DOI and LNRef elements describe the connection', async () => {
	mocks.canvasStore.currentPortSource = spsDataObject
	mocks.canvasStore.currentPortTarget = lcbiConditioner

	await createConnection({
		source: spsDataObject,
		target: lcbiConditioner
	})

	const doi = document.querySelector(
		'LN[uuid="conditioner-ln"] > DOI[uuid="conditioner-port"]'
	)
	const lnRef = doi?.querySelector('LNRef')

	expect(doi?.getAttribute('name')).toBe('OutInd-0')
	expect(doi?.getAttribute('desc')).toBe('output')
	expect(lnRef?.getAttribute('uuid')).toBe('data-object-port')
	expect(lnRef?.getAttribute('doName')).toBe('Pos')
	expect(lnRef?.getAttribute('lnUuid')).toBe('source-ln')
	expect(lnRef?.getAttribute('lnClass')).toBe('')
})

it('GIVEN an existing connection WHEN the same connection is created THEN it is rejected', async () => {
	mocks.canvasStore.currentPortSource = spsDataObject
	mocks.canvasStore.currentPortTarget = lcbiConditioner
	mocks.canvasStore.connectionUuids = [
		{
			dOISource: 'conditioner-port',
			lNRefTarget: 'data-object-port'
		}
	]

	await expect(
		createConnection({
			source: spsDataObject,
			target: lcbiConditioner
		})
	).rejects.toThrow('Connection already exists')
})

it('GIVEN DOI and LNRef UUIDs WHEN connections are read THEN semantic source-target pairs are returned', () => {
	const ied = mocks.iedStore.selectedIED?.element
	if (!ied) throw new Error('Expected selected IED')
	const doi = document.createElement('DOI')
	doi.setAttribute('uuid', 'conditioner-port')
	const lnRef = document.createElement('LNRef')
	lnRef.setAttribute('uuid', 'data-object-port')
	doi.append(lnRef)
	ied.append(doi)

	expect(getConnectionsUuids()).toEqual([
		{
			dOISource: 'conditioner-port',
			lNRefTarget: 'data-object-port'
		}
	])
})

it('GIVEN a DOI without a UUID WHEN connections are read THEN the malformed SCD is rejected', () => {
	const ied = mocks.iedStore.selectedIED?.element
	if (!ied) throw new Error('Expected selected IED')
	ied.innerHTML = '<DOI><LNRef uuid="data-object-port" /></DOI>'

	expect(() => getConnectionsUuids()).toThrow('DOI uuid not found')
})
