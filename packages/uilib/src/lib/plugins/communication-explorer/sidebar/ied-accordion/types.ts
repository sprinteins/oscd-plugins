import type { MessageType } from "@oscd-plugins/core"
import type { IEDNode } from "../../../../components/diagram/nodes"


export type ServiceTypeGroup = Map<string, ServiceObject[]>;

export enum ConnectionTypeDirection {
	INCOMING = "INCOMING",
    OUTGOING = "OUTGOING",
}


export type ServiceObject = {
    node: IEDNode;
    serviceType: MessageType | "Unknown";
    serviceTypeLabel?: string;
    connectionDirection: ConnectionTypeDirection;
};
