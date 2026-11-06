import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockCreateAndDispatchEditEvent, mockPluginGlobalStore, mockUuid } =
	vi.hoisted(() => ({
		mockCreateAndDispatchEditEvent:
			vi.fn<
				(params: {
					host: EventTarget
					edit: {
						parent?: Element
						node: Element
						reference?: Element | null
					}
				}) => void
			>(),
		mockPluginGlobalStore: {
			host: null as EventTarget | null
		},
		mockUuid: vi.fn(() => 'new-terminal-uuid')
	}))

vi.mock('uuid', () => ({
	v4: mockUuid
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	createAndDispatchEditEvent: mockCreateAndDispatchEditEvent
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: mockPluginGlobalStore
}))

import { setConductingEquipmentTerminalCount } from './terminal-crud-operation.helper'

function createXmlDocument(): XMLDocument {
	return document.implementation.createDocument(null, 'SCL', null)
}

beforeEach(() => {
	vi.clearAllMocks()
	mockPluginGlobalStore.host = {} as EventTarget
})

afterEach(() => {
	vi.restoreAllMocks()
})

describe('setConductingEquipmentTerminalCount', () => {
	it('GIVEN one Terminal followed by SubEquipment and EqFunction WHEN the count changes to two THEN a cloned Terminal is dispatched before SubEquipment', () => {
		const xmlDocument = createXmlDocument()
		const equipmentElement = xmlDocument.createElement(
			'ConductingEquipment'
		)
		const existingTerminal = xmlDocument.createElement('Terminal')
		existingTerminal.setAttribute('connectivityNode', 'node-path')
		const subEquipment = xmlDocument.createElement('SubEquipment')
		const eqFunction = xmlDocument.createElement('EqFunction')
		equipmentElement.append(existingTerminal, subEquipment, eqFunction)

		setConductingEquipmentTerminalCount({
			equipmentElement,
			value: 2
		})

		expect(mockUuid).toHaveBeenCalledOnce()
		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledOnce()
		const edit = mockCreateAndDispatchEditEvent.mock.calls[0]?.[0].edit
		expect(edit?.parent).toBe(equipmentElement)
		expect(edit?.reference).toBe(subEquipment)
		expect(edit?.node).not.toBe(existingTerminal)
		expect(edit?.node.localName).toBe('Terminal')
		expect(edit?.node.getAttribute('connectivityNode')).toBe('node-path')
		expect(edit?.node.getAttribute('uuid')).toBe('new-terminal-uuid')
	})

	it('GIVEN two Terminals WHEN the count changes to one THEN the second Terminal is dispatched for removal', () => {
		const xmlDocument = createXmlDocument()
		const equipmentElement = xmlDocument.createElement(
			'ConductingEquipment'
		)
		const firstTerminal = xmlDocument.createElement('Terminal')
		const secondTerminal = xmlDocument.createElement('Terminal')
		equipmentElement.append(firstTerminal, secondTerminal)

		setConductingEquipmentTerminalCount({
			equipmentElement,
			value: 1
		})

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockPluginGlobalStore.host,
			edit: {
				node: secondTerminal
			}
		})
		expect(mockUuid).not.toHaveBeenCalled()
	})

	it('GIVEN one Terminal and no later child families WHEN the count changes to two THEN the cloned Terminal is appended', () => {
		const xmlDocument = createXmlDocument()
		const equipmentElement = xmlDocument.createElement(
			'ConductingEquipment'
		)
		equipmentElement.append(xmlDocument.createElement('Terminal'))

		setConductingEquipmentTerminalCount({
			equipmentElement,
			value: 2
		})

		expect(
			mockCreateAndDispatchEditEvent.mock.calls[0]?.[0].edit.reference
		).toBeNull()
	})

	it.each([
		{ terminalCount: 1, value: 1 },
		{ terminalCount: 2, value: 2 },
		{ terminalCount: 1, value: 3 }
	])('GIVEN $terminalCount Terminals and requested count $value WHEN the count is updated THEN no edit is dispatched', ({
		terminalCount,
		value
	}) => {
		const xmlDocument = createXmlDocument()
		const equipmentElement = xmlDocument.createElement(
			'ConductingEquipment'
		)
		for (let index = 0; index < terminalCount; index++)
			equipmentElement.append(xmlDocument.createElement('Terminal'))

		setConductingEquipmentTerminalCount({
			equipmentElement,
			value
		})

		expect(mockCreateAndDispatchEditEvent).not.toHaveBeenCalled()
	})

	it('GIVEN no host WHEN the terminal count is updated THEN an error is thrown', () => {
		mockPluginGlobalStore.host = null

		expect(() =>
			setConductingEquipmentTerminalCount({
				equipmentElement: createXmlDocument().createElement(
					'ConductingEquipment'
				),
				value: 2
			})
		).toThrow('Host not found')

		expect(mockCreateAndDispatchEditEvent).not.toHaveBeenCalled()
	})
})
