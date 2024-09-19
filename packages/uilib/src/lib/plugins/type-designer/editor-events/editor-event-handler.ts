import type { BayTypeElement, IEDTypeElement, LDeviceTypeElement, VoltageLevelTypeElement } from "@oscd-plugins/core"
import { CreateBayEvent } from "./event-types"
import { type Create, type Delete } from "./editor-events"
import { Node } from "../components"
import { bayNodeName } from "../constants/type-names"

export class EditorEventHandler {
    private readonly editorActionName = "editor-action"

    constructor(private readonly root: HTMLElement, private readonly dataTemplates: Element) {
    }

    public dispatchCreateBay(event: CreateBayEvent): void {
        const newBay = this.buildNewNode(event.bay, bayNodeName);
        const replaces = this.buildCreateBayEvents(newBay)
        const combinedEditorEvent = this.buildEditorActionEvent(replaces)

        // TODO wird unter dem namen "bay" gespeichert, erwartet BayType, case sensitive
        this.root.dispatchEvent(combinedEditorEvent)
    }

    // TODO 19.09
    // public dispatchDeleteBay(event: DeleteBayEvent): void {
    //     const deletes = this.buildDeleteBayEvents(event)
    //     const combinedEditorEvent = this.buildEditorActionEvent(deletes)

    //     this.root.dispatchEvent(combinedEditorEvent)
    // }
    // private buildDeleteBayEvents(event: DeleteBayEvent): Delete[] {
    //     const bayToRemove = this.findBayInScd(event.bay.id)
    //     return [{
    //         element: { parent: bayToRemove.parentElement, element: bayToRemove },
    //     }]
    // }

    private buildCreateBayEvents(newBay: Element): Create[] {
        return [{
            new: { parent: this.dataTemplates, element: newBay },
        }]
    }

    // TODO bay is type BayTypeElement - wrong, contains element, two types for the same node?
    private buildNewNode(node: BayTypeElement | IEDTypeElement | LDeviceTypeElement | VoltageLevelTypeElement, nodeName: string): HTMLElement {
        const container = document.createElement('div');
    
        new Node({
            target: container,
            props: {
                componentData: Object.entries(node).map(([key, value]) => ({ key, value })),
                componentName: nodeName,
                componentId: node.id,
            }
        });
    
        return container;
    }

    private buildEditorActionEvent(actions: (Create | Delete)[]) {
        const detail = {
            action: {
                actions: actions,
            },
        }
    
        return new CustomEvent(this.editorActionName, {
            detail,
            composed: true,
            bubbles:  true,
        })
    }
}