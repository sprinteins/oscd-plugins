// event-handlers.ts
import { EditorEventHandler } from "../editor-events/editor-event-handler";
import { 
    type CreateBayEvent, 
    type CreateSubstationEvent, 
    type CreateLDeviceEvent, 
    type CreateIEDEvent, 
    type CreateVoltageLevelEvent 
} from "../editor-events/event-types";

export function onCreateBay(event: CustomEvent<CreateBayEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateBay:", event.detail.bay.name);
    editEventHandler.dispatchCreateBay(event.detail);
}

export function onCreateSubstation(event: CustomEvent<CreateSubstationEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateSubstation:", event.detail.substation.name);
    editEventHandler.dispatchCreateSubstation(event.detail);
}

export function onCreateLDevice(event: CustomEvent<CreateLDeviceEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateLDevice:", event.detail.lDevice.inst);
    editEventHandler.dispatchCreateLDevice(event.detail);
}

export function onCreateIED(event: CustomEvent<CreateIEDEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateIED:", event.detail.ied.name);
    editEventHandler.dispatchCreateIED(event.detail);
}

export function onCreateVoltageLevel(event: CustomEvent<CreateVoltageLevelEvent>, editEventHandler: EditorEventHandler) {
    console.log("onCreateVoltageLevel:", event.detail.vLevel.name);
    editEventHandler.dispatchCreateVoltageLevel(event.detail);
}