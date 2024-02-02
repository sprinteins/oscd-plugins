import type { IEDNetworkInfoV3 } from "@oscd-plugins/core"
import type { Edge, Node } from "@xyflow/svelte"
import { writable } from "svelte/store"


export class DiagramStore {
	public nodes = writable<Node[]>([])
	public edges = writable<Edge[]>([])
	
	public selectedNodes = writable<SelectedNode[]>([])

	public iedNetworkInfos = writable<IEDNetworkInfoV3[]>([])
}

export type SelectedNode = IEDNetworkInfoV3

export const buildCablePortId = (cable: string, port: string): string => `${cable}-${port}`
