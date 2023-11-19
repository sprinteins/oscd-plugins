import type { IEDNetworkInfoV3 } from "@oscd-plugins/core"
import type { Edge, Node } from "@xyflow/svelte"
import { writable } from "svelte/store"


export class DiagramController {
	public nodes = writable<Node[]>([])
	public edges = writable<Edge[]>([])
	
	public selectedNode = writable<IEDNetworkInfoV3 | undefined>(undefined)
}