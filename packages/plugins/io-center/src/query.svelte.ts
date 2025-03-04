import type { IED } from "./ied/ied";
import { 
	NodeTypes, 
	type ObjectNodeLogicalDevice, 
	type ObjectTree, 
	type ObjectNodeDataObject,
	type ObjectNodeLogicalNode,
} from "./ied/object-tree.type.d";
import { store } from "./store.svelte";
import type { Nullable } from "./types";


/**
 * Note: the `store.editCount` is only there to trigger the effect. This is
 * how OpenSCD lets us know that the doucment has been updated.
 */
export function useQuery() {
	$effect( () => storeIEDs(store.doc, store.editCount))
	$effect( () => storeObjectTree(store.doc, store.selectedIED, store.editCount))
	$effect( () => storeLogicalConditioners(store.doc, store.selectedIED, store.editCount))
}

function storeIEDs(doc: Nullable<XMLDocument>, _: unknown) {
	if (!doc) {	return }

	const iedElements = Array.from(doc.querySelectorAll("IED"))
	const ieds: IED[] = iedElements.map(iedElementToIED)

	store.iedList = ieds
}

function storeLogicalConditioners(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
	if (!doc || !selectedIED) { console.warn("no doc or no ied selected"); return }

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)
	if (!iedElement) { console.warn(`IED (name:${selectedIED.name}) not found`); return }

	const lnElements = Array.from(iedElement.querySelectorAll('LN[lnClass="LRTD"], LN[lnClass="LRTI"], LN[lnClass="LRTB"]'))

	const lcs = lnElements.map( (el) => {
		return {
			type: el.getAttribute("lnType") || "",
			instance: el.getAttribute("inst") || ""
		}
	})

	store.logicalConditioners = lcs
}

function iedElementToIED(iedElement: Element): IED {
	return {
		name: iedElement.getAttribute("name") ?? "unknown"
	}
}


function storeObjectTree(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown){
	if (!doc || !selectedIED){ console.warn("no doc or no ied selected"); return}

	const IEDElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)
	if (!IEDElement){ console.warn(`IED (name:${selectedIED.name}) not found`); return}

	const objectTree: ObjectTree = {
		ied: {
			id: crypto.randomUUID(),
			name: IEDElement.getAttribute("name") || "unknown",
			children: [],
			_type: NodeTypes.ied,
		}
	}

	const lDeviceElements = Array.from(IEDElement.querySelectorAll("LDevice"))
	objectTree.ied.children = lDeviceElements.map( (ldDeviceElement) => {
		const ld: ObjectNodeLogicalDevice = {
			id: crypto.randomUUID(),
			inst: ldDeviceElement.getAttribute("inst") || "unknown",
			children: [],
			objectPath: {
				ied: { id: objectTree.ied.id, name: objectTree.ied.name }
			},
			_type: NodeTypes.logicalDevice
		}

		ld.children = Array.from(ldDeviceElement.querySelectorAll("LN")).map( (lnElement) => {
			const ln: ObjectNodeLogicalNode = {
				id: crypto.randomUUID(),
				lnClass: lnElement.getAttribute("lnClass") || "unknown",
				inst: lnElement.getAttribute("inst") || "unknown",
				children: [],
				objectPath: {
					ied: { id: objectTree.ied.id, name: objectTree.ied.name },
					lDevice: { id: ld.id, inst: ld.inst }
				},
				_type: NodeTypes.logicalNode
			}

			// jumping to the LNodeType to get the DOs
			const lnNodeType = store.doc.querySelector(`LNodeType[id="${lnElement.getAttribute("lnType") || ""}"]`);
			if(!lnNodeType){ 
				console.warn(`could not find LNodeType with id: ${lnElement.getAttribute("lnType")}`)
				return ln
			 }
			const dos = Array.from(lnNodeType.querySelectorAll("DO"))

			ln.children = dos.map( (doElement) => {
				if(!hasCDC(doElement, doc, TARGET_CDC)){
					return undefined
				}
				const dataObject: ObjectNodeDataObject = {
					id: crypto.randomUUID(),
					name: doElement.getAttribute("name") || "unknown",
					objectPath: {
						ied: { id: objectTree.ied.id, name: objectTree.ied.name },
						lDevice: { id: ld.id, inst: ld.inst },
						ln: { id: ln.id, lnClass: ln.lnClass, inst: ln.inst }
					},
					_type: NodeTypes.dataObject
				}
				return dataObject
			}).filter(Boolean) as ObjectNodeDataObject[]
			return ln
		})
		return ld
	})
	store.objectTreeV2 = objectTree
	
}

// TARGET_CDC: Only data objects with a cdc attribute included in targetCdc will be collected from the SCD document
// Currently hard-coded by the client request but in future we may make it dynamic and allow the user to fill the targetScd
const TARGET_CDC = ['sps', 'dps', 'dpc', 'inc', 'ins', 'pos']
function hasCDC(doElement: Element, doc: XMLDocument, targetCDC: string[]): boolean {
	
	const type = doElement.getAttribute("type") || "";
	if (type === "") {
		return false;
	}

	const doType = doc.querySelector(`DOType[id="${type}"]`);
	if (!doType) {
		return false;
	}

	const cdc = doType.getAttribute("cdc") || "";
	if (cdc === "" || !targetCDC.includes(cdc.toLowerCase())) {
		return false;
	}

	return true;
}