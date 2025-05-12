import { untrack } from 'svelte'
// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// HELPERS
import {
	isConnectionAllowed,
	getConnectionsUuids,
	getCurrentConnectedUuidsAndAddLogicalToSelection,
	isPortConnected,
	isAtLeastOnePortConnected,
	isPortDisabled,
	deleteConnection
} from './connection-crud.helper'
import {
	startDrawing,
	stopDrawing,
	getSVGCoordinates,
	getConnectionsCoordinates
} from './drawing.helper'
// TYPES
import type { ConnectionId, PortConfig } from '@/headless/stores'

export class CanvasStore {
	//====== INITIALIZATION ======//

	//====== STATES

	// connections
	currentConnectedDataObjectAndLogicalUuids = $state<string[]>([])
	currentPortSource = $state<PortConfig | null>(null)
	currentPortTarget = $state<PortConfig | null>(null)

	// canvas
	mousePosition = $state({ x: 0, y: 0 })
	windowSize = $state({
		width: 0,
		height: 0
	})
	svgElement = $state<SVGGraphicsElement | null>(null)
	drawnLineSource = $state<{ x: number; y: number } | null>(null)
	portHTMLElementByUuids = $state<Record<string, Element>>({})

	//====== DERIVED

	// connections
	connectionUuids = $derived.by<ConnectionId[]>(() => {
		if (`${pluginGlobalStore.editCount}`)
			return untrack(() => getConnectionsUuids())
		return []
	})

	// canvas
	currentSvgDPath = $derived(
		this.drawnLineSource &&
			`M ${this.drawnLineSource.x},${this.drawnLineSource.y} L ${this.mousePosition.x},${this.mousePosition.y}`
	)
	filteredPortHTMLElementByUuids = $derived.by(() => {
		if (Object.keys(this.portHTMLElementByUuids).length)
			return Object.fromEntries(
				Object.entries(this.portHTMLElementByUuids).filter(
					([key, element]) => element
				)
			)
		return {}
	})
	connectionsCoordinates = $derived(
		getConnectionsCoordinates(
			this.connectionUuids,
			this.filteredPortHTMLElementByUuids,
			this.windowSize.width,
			this.windowSize.height
		)
	)

	//====== WATCHERS ======//

	//====== ACTIONS ======//

	setWindowSize(params: { width: number; height: number }) {
		this.windowSize.width = params.width
		this.windowSize.height = params.height
	}

	resetCurrentPorts() {
		this.currentPortSource = null
		this.currentPortTarget = null
	}

	resetStates() {
		this.currentConnectedDataObjectAndLogicalUuids = []
		this.resetCurrentPorts()
		this.drawnLineSource = null
		this.portHTMLElementByUuids = {}
	}

	//====== PROXY ======//

	// connections
	isConnectionAllowed = isConnectionAllowed
	getCurrentConnectedUuidsAndAddLogicalToSelection =
		getCurrentConnectedUuidsAndAddLogicalToSelection
	isPortConnected = isPortConnected
	isAtLeastOnePortConnected = isAtLeastOnePortConnected
	isPortDisabled = isPortDisabled
	deleteConnection = deleteConnection
	// drawing
	startDrawing = startDrawing
	stopDrawing = stopDrawing
	getSVGCoordinates = getSVGCoordinates
}

export const canvasStore = new CanvasStore()
