import type { Networking } from "@oscd-plugins/core"
import { SCDQueries, UCNetworkInformation } from "@oscd-plugins/core"
import type { Replace } from "./editor-events"


export class EditorEventHandler {
	private readonly emptyCableName = "0"
	private readonly editorActionName = "editor-action"

	constructor(private readonly root: HTMLElement) {
	}


	dispatchDeleteCable(networking: Networking[]): void {
		const replaces = this.buildDeleteCableEvents(networking)
		const combinedEditorEvent = this.buildEditorActionEvent(replaces)

		this.root.dispatchEvent(combinedEditorEvent)
	}

	private buildDeleteCableEvents(networking: Networking[]): Replace[] {
		return networking.map(net => {
			// TODO: Clean this mess up
			const cableElement = new UCNetworkInformation(new SCDQueries(null as any))
				.extractPhysConnectionCable(net._physConnectionElement)
	
			if (!cableElement) {
				throw new Error(`Element for cable ${net.cable} not found`)
			}
			
			const modifiedCable = cableElement.element.cloneNode(true) as Element
			modifiedCable.innerHTML = this.emptyCableName
	
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
