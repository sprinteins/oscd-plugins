import type { BayTypeElement, IEDTypeElement, LDeviceTypeElement, VoltageLevelTypeElement } from "@oscd-plugins/core"
import { CreateBayEvent, CreateIEDEvent, CreateLDeviceEvent, CreateSubstationEvent, CreateVoltageLevelEvent } from "./event-types"
import { type Create, type Delete } from "./editor-events"
import { Node } from "../components"
import { bayNodeName, IEDNodeName, ldNodeName, substationNodeName, vlNodeName } from "../constants/type-names"
import { BayType, IEDType, LDeviceType, VoltageLevelType } from "../types"

export class EditorEventHandler {
    private readonly editorActionName = "editor-action"

    constructor(private readonly root: HTMLElement, private readonly dataTemplates: Element) {
    }

    public dispatchCreateBay(event: CreateBayEvent): void {
        const newBay = this.buildNewNode(event.type, bayNodeName);
        const replaces = this.buildCreateEvents(newBay)
        const combinedEditorEvent = this.buildEditorActionEvent(replaces)

        // TODO wird unter dem namen "bay" gespeichert, erwartet BayType, case sensitive
        this.root.dispatchEvent(combinedEditorEvent)
    }

    // TODO z.19 gilt für alle dispatchCreate*
    public dispatchCreateSubstation(event: CreateSubstationEvent): void {
        const newSubstation = this.buildNewNode(event.type, substationNodeName);
        const replaces = this.buildCreateEvents(newSubstation);
        const combinedEditorEvent = this.buildEditorActionEvent(replaces);

        this.root.dispatchEvent(combinedEditorEvent);
    }

    public dispatchCreateLDevice(event: CreateLDeviceEvent): void {
        const newLDevice = this.buildNewNode(event.type, ldNodeName);
        const replaces = this.buildCreateEvents(newLDevice);
        const combinedEditorEvent = this.buildEditorActionEvent(replaces);

        this.root.dispatchEvent(combinedEditorEvent);
    }

    public dispatchCreateIED(event: CreateIEDEvent): void {
        const newIED = this.buildNewNode(event.type, IEDNodeName);
        const replaces = this.buildCreateEvents(newIED);
        const combinedEditorEvent = this.buildEditorActionEvent(replaces);

        this.root.dispatchEvent(combinedEditorEvent);
    }

    public dispatchCreateVoltageLevel(event: CreateVoltageLevelEvent): void {
        const newVoltageLevel = this.buildNewNode(event.type, vlNodeName);
        const replaces = this.buildCreateEvents(newVoltageLevel);
        const combinedEditorEvent = this.buildEditorActionEvent(replaces);

        this.root.dispatchEvent(combinedEditorEvent);
    }

    private buildCreateEvents(newElement: Element): Create[] {
        return [{
            new: { parent: this.dataTemplates, element: newElement },
        }];
    }

    // TODO bay is type BayTypeElement - wrong, contains element, two types for the same node?
    private buildNewNode(node: BayType | IEDType | LDeviceType | VoltageLevelType, nodeName: string): HTMLElement {
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

    // TODO out of #61 scope - contact Illia when implementation is needed
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
}