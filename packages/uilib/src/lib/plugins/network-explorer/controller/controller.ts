import type { Edge, Node } from "@xyflow/svelte"
import { writable } from "svelte/store"


export class DiagramController {
	public nodes = writable<Node[]>([])
	public edges = writable<Edge[]>([])
}