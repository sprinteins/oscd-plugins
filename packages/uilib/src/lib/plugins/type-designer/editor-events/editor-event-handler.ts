import { CreateBayEvent, CreateIEDEvent, CreateLDeviceEvent, CreateSubstationEvent, CreateVoltageLevelEvent } from "./event-types"
import { type Create, type Delete } from "./editor-events"
import { Node } from "../components"
import { bayNodeName, IEDNodeName, ldNodeName, substationNodeName, vlNodeName } from "../constants/type-names"
import { BayType, IEDType, LDeviceType, VoltageLevelType } from "../types"
import { SubstationType } from "../types/nodes"

export class EditorEventHandler {
    private readonly editorActionName = "editor-action"

    constructor(private readonly root: HTMLElement, private readonly dataTemplates: Element) {
    }

    // TODO wird in allen dispatchCreate* unter dem namen "bay" (oder ld usw.) gespeichert, erwartet BayType, case sensitive
    public dispatchCreateBay(event: CreateBayEvent): void {
        this.dispatchCreate(event);
    }

    public dispatchCreateSubstation(event: CreateSubstationEvent): void {
        this.dispatchCreate(event);
    }

    public dispatchCreateLDevice(event: CreateLDeviceEvent): void {
        this.dispatchCreate(event);
    }

    public dispatchCreateIED(event: CreateLDeviceEvent): void {
        this.dispatchCreate(event);
    }

    public dispatchCreateVoltageLevel(event: CreateLDeviceEvent): void {
        this.dispatchCreate(event);
    }

    private dispatchCreate(event: CreateBayEvent | CreateIEDEvent | CreateVoltageLevelEvent | CreateLDeviceEvent | CreateSubstationEvent): void {
        console.log(`[!] onCreate:`, event); 
        const newNode = this.buildNewNode(event.type);
        const replaces = this.buildCreateEvents(newNode);
        const combinedEditorEvent = this.buildEditorActionEvent(replaces);
        this.root.dispatchEvent(combinedEditorEvent);
    }

    private buildCreateEvents(newElement: Element): Create[] {
        return [{
            new: { parent: this.dataTemplates, element: newElement },
        }];
    }

    private buildNewNode(node: BayType | IEDType | LDeviceType | VoltageLevelType | SubstationType): Element {
        const nodeName = this.getNodeName(node);
        const xmlString = this.createXmlString(nodeName, node);
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, "application/xml");
        return doc.documentElement;
    }

    private createXmlString(nodeName: string, node: BayType | IEDType | LDeviceType | VoltageLevelType | SubstationType): string {
        const attributes = Object.entries(node)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ");
        return `<${nodeName} ${attributes}></${nodeName}>`;
    }

    private getNodeName(node: BayType | IEDType | LDeviceType | VoltageLevelType | SubstationType): string {
        if ('inst' in node) return 'LDeviceType';
        if ('manufacturer' in node) return 'IEDType';
        if ('nomFreq' in node) return 'VoltageLevelType';
        if ('name' in node && 'desc' in node) return 'BayType';
        return 'SubstationType';
    }

    private buildEditorActionEvent(actions: (Create | Delete)[]): CustomEvent {
        const detail = {
            action: {
                actions: actions,
            },
        };
    
        return new CustomEvent(this.editorActionName, {
            detail,
            composed: true,
            bubbles: true,
        });
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