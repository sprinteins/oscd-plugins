import type { Networking } from "@oscd-plugins/core"
import type { Replace } from "./editor-events"
import type { IED } from "../diagram/networking"
import type { CreateCableEvent, UpdateCableEvent } from "./network-events"
import { emptyCableName } from "../constants"
import { extractPhysConnectionCable } from "../diagram/networking"


export class EditorEventHandler {
	private readonly editorActionName = "editor-action"

	constructor(private readonly root: HTMLElement) {
	}

	public dispatchCreateCable(event: CreateCableEvent): void {
		const replaces = this.buildCreateCableEvents(event)
		const combinedEditorEvent = this.buildEditorActionEvent(replaces)

		this.root.dispatchEvent(combinedEditorEvent)
	}

	public dispatchUpdateCable(event: UpdateCableEvent): void {
		const replaces = this.buildUpdateCableEvents(event)
		const combinedEditorEvent = this.buildEditorActionEvent(replaces)

		this.root.dispatchEvent(combinedEditorEvent)
	}

	public dispatchDeleteCable(networking: Networking[]): void {
		const replaces = this.buildDeleteCableEvents(networking)
		const combinedEditorEvent = this.buildEditorActionEvent(replaces)

		this.root.dispatchEvent(combinedEditorEvent)
	}

	private buildCreateCableEvents(event: CreateCableEvent): Replace[] {
		const iedAndPorts = [ event.source, event.target ]
		return iedAndPorts.map(({ ied, port }) => this.buildSetCableToPortReplace(ied, event.cable, port))
	}

	private buildUpdateCableEvents(event: UpdateCableEvent): Replace[] {
		const replaces: Replace[] = []
		
		const sourceAndTarget = [ event.source, event.target ]
		sourceAndTarget.forEach(({ ied, oldPort, newPort }) => {
			const networkingToEmpty = ied.networking.find(net => net.port === oldPort)
			if (!networkingToEmpty) {
				throw new Error(`Trying to empty cable for port ${oldPort}, but networking was not found`)
			}

			if (oldPort !== newPort) {
				const emptyOldPort = this.buildEmptyPortReplace(networkingToEmpty)
				replaces.push(emptyOldPort)
			}

			const setNewPort = this.buildSetCableToPortReplace(ied, event.cable, newPort)
			replaces.push(setNewPort)
		})

		return replaces
	}

	private buildEmptyPortReplace(net: Networking): Replace {
		const cableElement = extractPhysConnectionCable(net._physConnectionElement, net)
		const modifiedCable = cableElement.element.cloneNode(true) as Element
		modifiedCable.innerHTML = emptyCableName

		return {
			old: { element: cableElement.element },
			new: { element: modifiedCable },
		}
	}

	private buildSetCableToPortReplace(ied: IED, cable: string, port: string): Replace {
		const networking = ied.networking.find(n => n.port === port)

		if (!networking) {
			throw new Error(`Networking for port ${port} not found in IED ${ied.name}`)
		}

		const cableElement = extractPhysConnectionCable(networking._physConnectionElement, networking)
		const modifiedCable = cableElement.element.cloneNode(true) as Element
		modifiedCable.innerHTML = cable

		return {
			old: { element: cableElement.element },
			new: { element: modifiedCable },
		}
	}

	private buildDeleteCableEvents(networking: Networking[]): Replace[] {
		return networking.map(net => this.buildEmptyPortReplace(net))
	}

	private buildEditorActionEvent(replaces: Replace[]) {
		const detail = {
			action: {
				actions: replaces,
			},
		}
	
		return new CustomEvent(this.editorActionName, {
			detail,
			composed: true,
			bubbles:  true,
		})
	}
	
}
