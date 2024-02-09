import type { Networking } from "@oscd-plugins/core"
import type { Replace } from "./editor-events"
import type { CreateCableEvent } from "./network-events"
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

	public dispatchDeleteCable(networking: Networking[]): void {
		const replaces = this.buildDeleteCableEvents(networking)
		const combinedEditorEvent = this.buildEditorActionEvent(replaces)

		this.root.dispatchEvent(combinedEditorEvent)
	}

	private buildCreateCableEvents(event: CreateCableEvent): Replace[] {
		const iedAndPorts = [ event.source, event.target ]

		return iedAndPorts.map(({ ied, port }) => {
			const networking = ied.networking.find(n => n.port === port)

			if (!networking) {
				throw new Error(`Networking for port ${port} not found in IED ${ied.name}`)
			}

			const cableElement = extractPhysConnectionCable(networking._physConnectionElement, networking)
			const modifiedCable = cableElement.element.cloneNode(true) as Element
			modifiedCable.innerHTML = event.cable

			return {
				old: { element: cableElement.element },
				new: { element: modifiedCable },
			}
		})
	}

	private buildDeleteCableEvents(networking: Networking[]): Replace[] {
		return networking.map(net => {
			const cableElement = extractPhysConnectionCable(net._physConnectionElement, net)
			const modifiedCable = cableElement.element.cloneNode(true) as Element
			modifiedCable.innerHTML = emptyCableName
	
			return {
				old: { element: cableElement.element },
				new: { element: modifiedCable },
			}
		})
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
