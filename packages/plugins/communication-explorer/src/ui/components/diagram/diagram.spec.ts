// @vitest-environment jsdom

import type { IED } from '@oscd-plugins/core'
import { cleanup, render, screen } from '@testing-library/svelte'
import { get } from 'svelte/store'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculateLayout } from '../../../headless/services/_func-layout-calculation'
import type { Config } from '../../../headless/services/_func-layout-calculation/config'
import {
	defaultPreferences,
	preferences$
} from '../../../stores/_store-preferences'
import {
	defaultSelection,
	filterState,
	toggleMultiSelectionOfIED
} from '../../../stores/_store-view-filter'
import { Diagram } from '.'

const config: Config = {
	iedWidth: 150,
	iedHeight: 40,
	bayLabelHeight: 15,
	bayLabelGap: 2,
	spacingBase: 10,
	spacingBetweenNodes: 100
}

function ied(
	iedName: string,
	published: IED.PublishedMessage[] = [],
	received: IED.ReceivedMessage[] = []
): IED.CommunicationInfo {
	return {
		iedName,
		iedDetails: {
			logicalNodes: [],
			dataObjects: [],
			dataAttributes: []
		},
		bays: new Set(),
		published,
		received
	}
}

async function renderDiagram(ieds: IED.CommunicationInfo[]) {
	const rootNode = await calculateLayout(
		ieds,
		config,
		get(filterState),
		get(preferences$)
	)

	render(Diagram, {
		rootNode,
		handleIEDSelect: vi.fn(),
		handleBaySelect: vi.fn(),
		handleIEDAdditiveSelect: vi.fn(),
		handleConnectionClick: vi.fn(),
		handleClearClick: vi.fn()
	})

	return rootNode
}

beforeEach(() => {
	filterState.set(structuredClone(defaultSelection))
	preferences$.set({ ...defaultPreferences, groupByBay: false })
})

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('GIVEN a diagram', () => {
	it('WHEN one IED is provided THEN that IED renders', async () => {
		await renderDiagram([ied('IED_1-1')])

		expect(screen.getByTestId('ied-IED_1-1')).toBeTruthy()
	})

	it('WHEN multiple IEDs are provided THEN every IED renders', async () => {
		await renderDiagram([ied('IED_1-1'), ied('IED_2-1'), ied('IED_3-4')])

		expect(screen.getByTestId('ied-IED_1-1')).toBeTruthy()
		expect(screen.getByTestId('ied-IED_2-1')).toBeTruthy()
		expect(screen.getByTestId('ied-IED_3-4')).toBeTruthy()
	})

	it('WHEN MMS, Sampled Values, and GOOSE messages are provided THEN every connection renders', async () => {
		await renderDiagram([
			ied('IED_1-1', [
				{
					id: '0',
					name: 'published',
					targetIEDName: 'IED_2-1',
					serviceType: 'MMS',
					serviceCbName: '',
					serviceDatSet: ''
				}
			]),
			ied(
				'IED_2-1',
				[],
				[
					{
						iedName: 'IED_1-1',
						serviceType: 'SMV',
						srcCBName: 'SMV',
						data: [],
						datSet: ''
					},
					{
						iedName: 'IED_1-1',
						serviceType: 'GOOSE',
						srcCBName: 'GOOSE',
						data: [],
						datSet: ''
					}
				]
			),
			ied('IED_3-4')
		])

		expect(
			screen.getByTestId('connection-con_published_ied-1_ied-0_MMS__0')
		).toBeTruthy()
		expect(
			screen.getByTestId(
				'connection-con_received_ied-0_ied-1_SampledValues_0'
			)
		).toBeTruthy()
		expect(
			screen.getByTestId('connection-con_received_ied-0_ied-1_GOOSE_1')
		).toBeTruthy()
	})
})

describe('GIVEN diagram IED selection', () => {
	it('WHEN one IED is selected THEN only that IED has the selected class', async () => {
		const rootNode = await calculateLayout(
			[ied('IED_1-1'), ied('IED_1-2')],
			config,
			get(filterState),
			get(preferences$)
		)
		toggleMultiSelectionOfIED(rootNode.children[0])
		await renderDiagram([ied('IED_1-1'), ied('IED_1-2')])

		expect(
			screen.getByTestId('ied-IED_1-1').classList.contains('selected')
		).toBe(true)
		expect(
			screen.getByTestId('ied-IED_1-2').classList.contains('selected')
		).toBe(false)
	})

	it('WHEN multiple IEDs are selected THEN every selected IED has the selected class', async () => {
		const rootNode = await calculateLayout(
			[ied('IED_1-1'), ied('IED_1-2')],
			config,
			get(filterState),
			get(preferences$)
		)
		toggleMultiSelectionOfIED(rootNode.children[0])
		toggleMultiSelectionOfIED(rootNode.children[1])
		await renderDiagram([ied('IED_1-1'), ied('IED_1-2')])

		expect(
			screen.getByTestId('ied-IED_1-1').classList.contains('selected')
		).toBe(true)
		expect(
			screen.getByTestId('ied-IED_1-2').classList.contains('selected')
		).toBe(true)
	})

	it('WHEN no IED is selected THEN no IED has the selected class', async () => {
		await renderDiagram([ied('IED_1-1'), ied('IED_1-2')])

		expect(
			screen.getByTestId('ied-IED_1-1').classList.contains('selected')
		).toBe(false)
		expect(
			screen.getByTestId('ied-IED_1-2').classList.contains('selected')
		).toBe(false)
	})

	it('WHEN a selected IED is toggled again THEN that IED is no longer selected', async () => {
		const rootNode = await calculateLayout(
			[ied('IED_1-1'), ied('IED_1-2')],
			config,
			get(filterState),
			get(preferences$)
		)
		toggleMultiSelectionOfIED(rootNode.children[0])
		toggleMultiSelectionOfIED(rootNode.children[1])
		toggleMultiSelectionOfIED(rootNode.children[0])
		await renderDiagram([ied('IED_1-1'), ied('IED_1-2')])

		expect(
			screen.getByTestId('ied-IED_1-1').classList.contains('selected')
		).toBe(false)
		expect(
			screen.getByTestId('ied-IED_1-2').classList.contains('selected')
		).toBe(true)
	})

	it('WHEN an IED is selected THEN its incoming and outgoing connections are highlighted', async () => {
		const ieds = [
			ied('IED_1-1', [
				{
					id: '0',
					name: 'published',
					targetIEDName: 'IED_1-2',
					serviceType: 'MMS',
					serviceCbName: '',
					serviceDatSet: ''
				}
			]),
			ied('IED_1-2'),
			ied(
				'IED_1-3',
				[],
				[
					{
						iedName: 'IED_1-2',
						serviceType: 'GOOSE',
						srcCBName: 'GOOSE',
						data: [],
						datSet: ''
					}
				]
			)
		]
		const rootNode = await calculateLayout(
			ieds,
			config,
			get(filterState),
			get(preferences$)
		)
		toggleMultiSelectionOfIED(rootNode.children[1])
		await renderDiagram(ieds)

		expect(
			screen
				.getByTestId('connection-con_published_ied-1_ied-0_MMS__0')
				.classList.contains('ied-selected')
		).toBe(true)
		expect(
			screen
				.getByTestId('connection-con_received_ied-1_ied-2_GOOSE_0')
				.classList.contains('ied-selected')
		).toBe(true)
	})
})
