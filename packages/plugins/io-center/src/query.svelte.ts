import { LC_TYPE, LP_TYPE, NODE_ELEMENT_TYPE } from "./headless/constants";
import { findDataObject, findLogicalPhysical } from "./headless/utils";
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
import type { Connection, ConnectionPoint, LogicalConditioner } from "./ui/components/canvas/types.canvas";
import type { LpElement } from "./ui/components/lp-list/types.lp-list";


/**
 * Note: the `store.editCount` is only there to trigger the effect. This is
 * how OpenSCD lets us know that the doucment has been updated.
 */
export function useQuery() {
	$effect(() => storeIEDs(store.doc, store.editCount))
	$effect(() => storeObjectTree(store.doc, store.selectedIED, store.editCount))
	$effect(() => storeLogicalConditioners(store.doc, store.selectedIED, store.editCount))
	$effect(() => storeLogicalPhysicals(store.doc, store.selectedIED, store.editCount))
	$effect(() => storeSelectedDataObjects(store.doc, store.selectedIED, store.editCount))
	$effect(() => storeSelectedLogicalPhysicals(store.doc, store.selectedIED, store.editCount))
	$effect(() => storeConnections(store.doc, store.selectedIED, store.editCount))
}

function storeIEDs(doc: Nullable<XMLDocument>, _: unknown) {
	if (!doc) { return }

	const iedElements = Array.from(doc.querySelectorAll("IED"))
	const ieds: IED[] = iedElements.map(iedElementToIED)

	store.iedList = ieds
}

function iedElementToIED(iedElement: Element): IED {
	return {
		name: iedElement.getAttribute("name") ?? "unknown"
	}
}

function storeLogicalConditioners(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
	if (!doc || !selectedIED) { console.warn("no doc or no ied selected"); return }

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) { console.warn(`IED (name:${selectedIED.name}) not found`); return }

	const lcQuery = Object.values(LC_TYPE)
		.map(lcType => `AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lcType}"]`)
		.join(",")

	const lcElements = Array.from(iedElement.querySelectorAll(lcQuery));

	store.logicalConditioners = lcElements.map(lcElementToLC)
}

function lcElementToLC(lcElement: Element): LogicalConditioner {
	return {
		id: crypto.randomUUID(),
		type: lcElement.getAttribute("lnClass") as keyof typeof LC_TYPE || "unknown",
		instance: `${lcElement.getAttribute("inst") || ""}`,
		isLinked: false,
	}
}

export function storeLogicalPhysicals(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
	if (!doc || !selectedIED) return

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) { console.warn(`IED (name:${selectedIED.name}) not found`); return }

	const lpQuery = Object.values(LP_TYPE)
		.map(lpType => `AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lpType}"]`)
		.join(",")

	const lpElements = Array.from(iedElement.querySelectorAll(lpQuery));

	store.lpList = lpElements.map(lpElementToLP)
}

function lpElementToLP(lpElement: Element): LpElement {
	return {
		id: crypto.randomUUID(),
		type: lpElement.getAttribute("lnClass") as keyof typeof LP_TYPE || "unknown",
		name: `${lpElement.getAttribute("lnType") || ""}`,
		instance: `${lpElement.getAttribute("inst") || ""}`,
		description: `${lpElement.getAttribute("desc") || ""}`,
		isLinked: false,
	}
}

function storeSelectedDataObjects(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
	if (!doc || !selectedIED) { console.warn("no doc or no ied selected"); return }

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) { console.warn(`IED (name:${selectedIED.name}) not found`); return }

	const lcQuery = Object.values(LC_TYPE)
		.map(lcType => `AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lcType}"]`)
		.join(",")


	const lnRefElementsWithDO = Array.from(iedElement.querySelectorAll(lcQuery)).flatMap(
		lcElement => Array.from(lcElement.querySelectorAll("DOI[desc='output']")).flatMap(
			doiElement => Array.from(doiElement.querySelectorAll("LNRef"))
		));

	store.selectedDataObjects = lnRefElementsWithDO.reduce((uniqueObjects, lnRefElement) => {
		const refDO = lnRefElement.getAttribute("refDO") || "";
		const refLNClass = lnRefElement.getAttribute("refLNClass") || "";
		const refLNInst = lnRefElement.getAttribute("refLNInst") || "";
		const refLDInst = lnRefElement.getAttribute("refLDInst") || "";

		const dataObject = findDataObject(store.objectTreeV2, refDO, selectedIED.name, refLDInst, refLNClass, refLNInst);

		if (dataObject && !uniqueObjects.some(doObject => doObject.id === dataObject.id)) {
			uniqueObjects.push(dataObject);
		}

		return uniqueObjects;
	}, [] as ObjectNodeDataObject[]);
}

function storeSelectedLogicalPhysicals(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
	if (!doc || !selectedIED) { console.warn("no doc or no ied selected"); return }

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) { console.warn(`IED (name:${selectedIED.name}) not found`); return }

	const lcQuery = Object.values(LC_TYPE)
		.map(lcType => `AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lcType}"]`)
		.join(",")


	const lnRefElementsWithLP = Array.from(iedElement.querySelectorAll(lcQuery)).flatMap(
		lcElement => Array.from(lcElement.querySelectorAll("DOI[desc='input']")).flatMap(
			doiElement => Array.from(doiElement.querySelectorAll("LNRef"))
		));

	store.selectedLogicalPhysicals = lnRefElementsWithLP.reduce((uniqueObjects, lnRefElement) => {
		const refLNClass = lnRefElement.getAttribute("refLNClass") || "";
		const refLNInst = lnRefElement.getAttribute("refLNInst") || "";

		const logicalPhysical = findLogicalPhysical(store.lpList, refLNClass, refLNInst);

		if (logicalPhysical && !uniqueObjects.some(lp => lp.id === logicalPhysical.id)) {
			uniqueObjects.push(logicalPhysical);
		}

		return uniqueObjects;
	}, [] as LpElement[]);
}

function storeConnections(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
	if (!doc || !selectedIED) { console.warn("no doc or no ied selected"); return }

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) { console.warn(`IED (name:${selectedIED.name}) not found`); return }

	const lcQuery = Object.values(LC_TYPE)
		.map(lcType => `AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lcType}"]`)
		.join(",")

	const lnRefElements = Array.from(iedElement.querySelectorAll(lcQuery)).map(lcElement => ({
		lc: lcElement,
		dois: Array.from(lcElement.querySelectorAll("DOI")).map(doiElement => ({
			doi: doiElement,
			lnRefs: Array.from(doiElement.querySelectorAll("LNRef"))
		}))
	}));

	store.connections = lnRefElements.flatMap(lcElement => {
		return lcElement.dois.flatMap(doiElement => {
			const connectionType = doiElement.doi.getAttribute("desc");

			if (!connectionType) {
				console.warn("Connection type not found");
				return;
			}

			return doiElement.lnRefs.flatMap((lnRefElement, index) => {
				const lcAttrs = lcElement.lc;
				const refDO = lnRefElement.getAttribute("refDO") || "";
				const refLNClass = lnRefElement.getAttribute("refLNClass") || "";
				const refLNInst = lnRefElement.getAttribute("refLNInst") || "";
				const lnClass = lcAttrs.getAttribute("lnClass") || "";
				const inst = lcAttrs.getAttribute("inst") || "";

				const from = {
					name: connectionType === "output"
						? `${refDO}-right`
						: `${lnClass}-${inst}-right`,
					index,
					type: connectionType === "output" ? NODE_ELEMENT_TYPE.DO : NODE_ELEMENT_TYPE.LC
				};

				const to = {
					name: connectionType === "output"
						? `${lnClass}-${inst}-left`
						: `${refLNClass}-${refLNInst}-left`,
					index,
					type: connectionType === "output" ? NODE_ELEMENT_TYPE.LC : NODE_ELEMENT_TYPE.LP
				};

				const connection: Connection = {
					id: crypto.randomUUID(),
					from,
					to
				};

				return connection
			});
		});
	}).filter(connection => connection !== undefined);
}

function storeObjectTree(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
	if (!doc || !selectedIED) { console.warn("no doc or no ied selected"); return }

	const IEDElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)
	if (!IEDElement) { console.warn(`IED (name:${selectedIED.name}) not found`); return }

	const objectTree: ObjectTree = {
		ied: {
			id: `IED_${IEDElement.getAttribute("name")}`,
			name: IEDElement.getAttribute("name") || "unknown",
			children: [],
			_type: NodeTypes.ied,
		}
	}

	const SelectorLDevicesWithoutLD0 = "LDevice:not([inst='LD0'])"
	const lDeviceElements = Array.from(IEDElement.querySelectorAll(SelectorLDevicesWithoutLD0))
	objectTree.ied.children = lDeviceElements.map((ldDeviceElement) => {
		const ld: ObjectNodeLogicalDevice = {
			id: `${objectTree.ied.id}::LD_${ldDeviceElement.getAttribute("inst")}`,
			inst: ldDeviceElement.getAttribute("inst") || "unknown",
			children: [],
			objectPath: {
				ied: { id: objectTree.ied.id, name: objectTree.ied.name }
			},
			_type: NodeTypes.logicalDevice
		}

		ld.children = Array.from(ldDeviceElement.querySelectorAll("LN")).map((lnElement) => {
			const ln: ObjectNodeLogicalNode = {
				id: `${ld.id}::LN_${lnElement.getAttribute("lnClass")}+LN_${lnElement.getAttribute("inst")}`,
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
			if (!lnNodeType) {
				console.warn(`could not find LNodeType with id: ${lnElement.getAttribute("lnType")}`)
				return ln
			}
			const dos = Array.from(lnNodeType.querySelectorAll("DO"))

			ln.children = dos.map((doElement) => {
				if (!hasCDC(doElement, doc, TARGET_CDC)) {
					return undefined
				}
				const dataObject: ObjectNodeDataObject = {
					id: `${ln.id}::DO_${doElement.getAttribute("name")}`,
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
