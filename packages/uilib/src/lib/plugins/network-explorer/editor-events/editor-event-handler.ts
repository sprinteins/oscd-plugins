import type { Networking, SCDElement } from "@oscd-plugins/core"
import { SCDQueries, UCNetworkInformation } from "@oscd-plugins/core"
import type { Replace } from "./editor-events"
import type { CreateCableEvent } from "./network-events"
import { emptyCableName } from "../constants"


export class EditorEventHandler {
	private readonly editorActionName = "editor-action"

	constructor(private readonly root: HTMLElement) {
	}

	public dispatchCreateCable(event: CreateCableEvent): void {
		const replaces = this.buildCreateCableEvents(event)
		const combinedEditorEvent = this.buildEditorActionEvent(replaces)

		this.root.dispatchEvent(combinedEditorEvent)
		console.log(combinedEditorEvent)
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

			const cableElement = this.extractPhysConnectionCable(networking)
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
			const cableElement = this.extractPhysConnectionCable(net)
			const modifiedCable = cableElement.element.cloneNode(true) as Element
			modifiedCable.innerHTML = emptyCableName
	
			return {
				old: { element: cableElement.element },
				new: { element: modifiedCable },
			}
		})
	}

	private extractPhysConnectionCable(net: Networking): SCDElement {
		// TODO: Clean this mess up
		const cableElement = new UCNetworkInformation(new SCDQueries(null as any))
			.extractPhysConnectionCable(net._physConnectionElement)

		if (!cableElement) {
			throw new Error(`Element for cable ${net.cable} not found`)
		}

		return cableElement
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
