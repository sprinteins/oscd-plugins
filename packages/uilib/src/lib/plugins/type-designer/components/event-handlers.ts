// event-handlers.ts
import { ldNodeName } from "../constants/type-names";
import { EditorEventHandler } from "../editor-events/editor-event-handler";
import { 
    type CreateBayEvent, 
    type CreateSubstationEvent, 
    type CreateLDeviceEvent, 
    type CreateIEDEvent, 
    type CreateVoltageLevelEvent 
} from "../editor-events/event-types";

export function onCreateBay(event: CustomEvent<CreateBayEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateBay:", event.detail.type.name);
    editEventHandler.dispatchCreateBay(event.detail);
}

export function onCreateSubstation(event: CustomEvent<CreateSubstationEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateSubstation:", event.detail.type.name);
    editEventHandler.dispatchCreateSubstation(event.detail);
}

export function onCreateLDevice(event: CustomEvent<CreateLDeviceEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateLDevice:", event.detail.type.inst);
    editEventHandler.dispatchCreateLDevice(event.detail);
}

export function onCreateIED(event: CustomEvent<CreateIEDEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateIED:", event.detail.type.name);
    editEventHandler.dispatchCreateIED(event.detail);
}

export function onCreateVoltageLevel(event: CustomEvent<CreateVoltageLevelEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateVoltageLevel:", event.detail.type.name);
    editEventHandler.dispatchCreateVoltageLevel(event.detail);
}

type EventTypes = 
    | CreateBayEvent
    | CreateSubstationEvent
    | CreateLDeviceEvent
    | CreateIEDEvent
    | CreateVoltageLevelEvent;

// looks shady, my inspiration - https://stackoverflow.com/questions/60067100/why-is-the-infer-keyword-needed-in-typescript
// TODO refactor
type EventDetail<T> = T extends { bay: infer U } ? U :
                      T extends { substation: infer U } ? U :
                      T extends { lDevice: infer U } ? U :
                      T extends { ied: infer U } ? U :
                      T extends { vLevel: infer U } ? U : never;

export function handleCreateEvent<T extends EventTypes>(eventType: string, detail: EventDetail<T>, editEventHandler: EditorEventHandler) {
    const event = new CustomEvent<T>(eventType, {
        detail: detail as T,
        bubbles: true,
        composed: true
    });

    switch (eventType) {
        case 'CreateBayEvent':
            onCreateBay(event as CustomEvent<CreateBayEvent>, editEventHandler);
            break;
        case 'CreateSubstationEvent':
            onCreateSubstation(event as CustomEvent<CreateSubstationEvent>, editEventHandler);
            break;
        case 'CreateLDeviceEvent':
            // TODO ohne force property spread gehts nicht
            console.log("[enter] LDEvent", event.detail);
            const random = new CustomEvent<CreateLDeviceEvent>(eventType, {
                detail: { type: { inst: event.detail.inst, desc: event.detail.desc, id: event.detail.id } },
                bubbles: true,
                composed: true
            });
            onCreateLDevice(random as CustomEvent<CreateLDeviceEvent>, editEventHandler);
            break;
        case 'CreateIEDEvent':
            onCreateIED(event as CustomEvent<CreateIEDEvent>, editEventHandler);
            break;
        case 'CreateVoltageLevelEvent':
            onCreateVoltageLevel(event as CustomEvent<CreateVoltageLevelEvent>, editEventHandler);
            break;
        default:
            throw new Error(`Unknown event type: ${eventType}`);
    }
}