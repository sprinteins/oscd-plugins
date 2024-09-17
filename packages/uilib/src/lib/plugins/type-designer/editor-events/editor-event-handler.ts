import type { BayTypeElement } from "@oscd-plugins/core"
import { CreateBayEvent, DeleteBayEvent } from "./event-types"
import { type Create, type Delete } from "./editor-events"

export class EditorEventHandler {
    // binded htmlroot
    private readonly editorActionName = "editor-action"

    constructor(private readonly root: HTMLElement, private readonly dataTemplates: Element) {
    }

    public dispatchCreateBay(event: CreateBayEvent): void {
        const replaces = this.buildCreateBayEvents(event)
        const combinedEditorEvent = this.buildEditorActionEvent(replaces)

        this.root.dispatchEvent(combinedEditorEvent)
    }

    // TODO
    // public dispatchDeleteBay(event: DeleteBayEvent): void {
    //     const deletes = this.buildDeleteBayEvents(event)
    //     const combinedEditorEvent = this.buildEditorActionEvent(deletes)

    //     this.root.dispatchEvent(combinedEditorEvent)
    // }

    private buildCreateBayEvents(event: CreateBayEvent): Create[] {
        const newBay = this.buildNewBay(event.bay)
        return [{
            new: { parent: this.dataTemplates, element: newBay },
        }]
    }

    // private buildDeleteBayEvents(event: DeleteBayEvent): Delete[] {
    //     const bayToRemove = this.findBayInScd(event.bay.id)
    //     return [{
    //         element: { parent: bayToRemove.parentElement, element: bayToRemove },
    //     }]
    // }

    private buildNewBay(bay: BayTypeElement): Element {
        const newBay = document.createElement('Bay');
        newBay.setAttribute('id', "kajsdhlfksanjkjlf");
        newBay.setAttribute('name', "new");
        newBay.setAttribute('desc', "bay");
        return newBay;
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