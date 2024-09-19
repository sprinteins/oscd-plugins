import { CreateBayEvent, CreateIEDEvent, CreateLDeviceEvent, CreateSubstationEvent, CreateVoltageLevelEvent } from "./event-types"
import { type Create, type Delete } from "./editor-events"
import { Node } from "../components"
import { bayNodeName, IEDNodeName, ldNodeName, substationNodeName, vlNodeName } from "../constants/type-names"
import { BayType, IEDType, LDeviceType, VoltageLevelType } from "../types"

export class EditorEventHandler {
    private readonly editorActionName = "editor-action"

    constructor(private readonly root: HTMLElement, private readonly dataTemplates: Element) {
    }

    // TODO wird in allen dispatchCreate* unter dem namen "bay" (oder ld usw.) gespeichert, erwartet BayType, case sensitive
    public dispatchCreateBay(event: CreateBayEvent): void {
        this.dispatchCreate(event, bayNodeName);
    }

    public dispatchCreateSubstation(event: CreateSubstationEvent): void {
        this.dispatchCreate(event, substationNodeName);
    }

    public dispatchCreateLDevice(event: CreateLDeviceEvent): void {
        this.dispatchCreate(event, ldNodeName);
    }

    public dispatchCreateIED(event: CreateLDeviceEvent): void {
        this.dispatchCreate(event, IEDNodeName);
    }

    public dispatchCreateVoltageLevel(event: CreateLDeviceEvent): void {
        this.dispatchCreate(event, vlNodeName);
    }

    private dispatchCreate(event: CreateBayEvent | CreateIEDEvent | CreateVoltageLevelEvent | CreateLDeviceEvent | CreateSubstationEvent, nodeName: string): void {
        const newNode = this.buildNewNode(event.type, nodeName);
        const replaces = this.buildCreateEvents(newNode);
        const combinedEditorEvent = this.buildEditorActionEvent(replaces);
        this.root.dispatchEvent(combinedEditorEvent);
    }

    private buildCreateEvents(newElement: Element): Create[] {
        return [{
            new: { parent: this.dataTemplates, element: newElement },
        }];
    }

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