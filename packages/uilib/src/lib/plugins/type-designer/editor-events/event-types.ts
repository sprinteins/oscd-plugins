import { BayTypeElement, IEDTypeElement } from "@oscd-plugins/core";

export interface CreateBayEvent {
    bay: BayTypeElement;
}

export interface DeleteBayEvent {
    bay: BayTypeElement;
}