import { LC_TYPE, LP_TYPE, NODE_ELEMENT_TYPE, PORTS_CONFIG_PER_TYPE, TARGET_CDC_TYPES } from "./headless/constants";
import { findDataObject, findLogicalPhysical } from "./headless/utils";
import type { IED } from "./ied/ied";
import {
	NodeTypes,
	type ObjectNodeLogicalDevice,
	type ObjectTree,
	type ObjectNodeDataObject,
	type ObjectNodeLogicalNode,
	type ObjectNodeAccessPoint,
} from "./ied/object-tree.type.d";
import { store } from "./store.svelte";
import type { Nullable } from "./types";
import type { Connection, ConnectionPort, LogicalConditioner } from "./ui/components/canvas/types.canvas";
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
	// $effect(() => storeSelectedDataObject(store.doc, store.selectedIED, store.editCount))
	// $effect(() => storeSelectedLogicalPhysicals(store.doc, store.selectedIED, store.editCount))
	$effect(() => storeConnections(store.doc, store.selectedIED, store.selectedDataObject, store.editCount))
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
		numberOfLCIVPorts: Number.parseInt(lcElement.getAttribute("numberOfLCIVPorts") || "") || undefined,
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
	const iedName = iedElement.getAttribute("name") || "unknown"

	store.lpList = lpElements.map((el) => lpElementToLP(iedName, el))
}

function lpElementToLP(iedName: string, lpElement: Element): LpElement {

	const id = [
		iedName,
		lpElement.getAttribute("inst") || "",
		lpElement.getAttribute("lnClass") || "",
		lpElement.getAttribute("lnType") || "",
		lpElement.getAttribute("desc") || ""
	].join("-")

	return {
		id,
		type: lpElement.getAttribute("lnClass") as keyof typeof LP_TYPE || "unknown",
		name: `${lpElement.getAttribute("lnType") || ""}`,
		instance: `${lpElement.getAttribute("inst") || ""}`,
		description: `${lpElement.getAttribute("desc") || ""}`,
		isLinked: false,
		numberOfLPDOPorts: Number.parseInt(lpElement.getAttribute("numberOfLPDOPorts") || "") || undefined,
	}
}

function storeSelectedDataObject(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, _: unknown) {
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

	store.selectedDataObject = lnRefElementsWithDO.map(lnRefElement => {
		const refDO = lnRefElement.getAttribute("refDO") || "";
		const refLNClass = lnRefElement.getAttribute("refLNClass") || "";
		const refLNInst = lnRefElement.getAttribute("refLNInst") || "";
		const refLDInst = lnRefElement.getAttribute("refLDInst") || "";

		const dataObject = findDataObject(store.objectTree, refDO, selectedIED.name, refLDInst, refLNClass, refLNInst);

		if (dataObject) {
			dataObject.isLinked = true;
			return dataObject;
		}
		return null
	}).find(el => el !== null) || null;
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
			logicalPhysical.isLinked = true;
			uniqueObjects.push(logicalPhysical);
		}

		return uniqueObjects;
	}, [] as LpElement[]);
}

function storeConnections(doc: Nullable<XMLDocument>, selectedIED: Nullable<IED>, selectedDataObject: ObjectNodeDataObject | null, _: unknown) {
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

	const lpsToSelect: LpElement[] = []

	store.connections = lnRefElements.flatMap(
		lcElement => {
			return lcElement.dois.flatMap(
				doiElement => {
					const doiName = doiElement.doi.getAttribute("name");
					const connectionType = doiElement.doi.getAttribute("desc");

					if (!connectionType || !doiName) {
						console.warn("connection type or name not defined!");
						return;
					}

					if (!selectedDataObject) {
						return;
					}

					return doiElement.lnRefs.flatMap(
						lnRefElement => {
							const lcAttrs = lcElement.lc;
							const refDO = lnRefElement.getAttribute("refDO") || "";
							const refLDInst = lnRefElement.getAttribute("refLDInst") || "";
							const refLNClass = lnRefElement.getAttribute("refLNClass") || "";
							const refLNInst = lnRefElement.getAttribute("refLNInst") || "";
							const lnClass = lcAttrs.getAttribute("lnClass") || "";
							const inst = lcAttrs.getAttribute("inst") || "";

							const from = {
								name: connectionType === "output"
									? `${refDO}-right`
									: `${lnClass}-${inst}-right`,
								type: connectionType === "output" ? NODE_ELEMENT_TYPE.DO : NODE_ELEMENT_TYPE.LC,
								port: connectionType === "output" ? { name: refDO, side: "right" } as ConnectionPort : { name: doiName, side: "right" } as ConnectionPort
							};

							const to = {
								name: connectionType === "output"
									? `${lnClass}-${inst}-left`
									: `${refLNClass}-${refLNInst}-left`,
								type: connectionType === "output" ? NODE_ELEMENT_TYPE.LC : NODE_ELEMENT_TYPE.LP,
								port: connectionType === "output" ? PORTS_CONFIG_PER_TYPE[lnClass].filter(port => doiName.includes(port.name))[0] : { name: refDO, side: "left" } as ConnectionPort
							};

							const connection: Connection = {
								id: crypto.randomUUID(),
								from,
								to
							};

							if (
								connectionType === "output"
								&& refDO === selectedDataObject.name
								&& refLNClass === selectedDataObject.objectPath.ln?.lnClass
								&& refLNInst === selectedDataObject.objectPath.ln?.inst
								&& refLDInst === selectedDataObject.objectPath.lDevice?.inst
							) {
								return connection
							}

							if (connectionType === "input" && selectedDataObject) {
								const targetLP = store.findLP(refLNClass, refLNInst)

								if (!targetLP) {
									console.warn(`LP ${refLNClass}-${refLNInst} not found!`)
									return
								}

								const isConnectedLcConnectedToSelectedDo = Boolean(
									lcElement.lc.querySelector(
										`DOI[desc="output"] > LNRef[refLDInst="${selectedDataObject.objectPath.lDevice?.inst}"][refLNClass="${selectedDataObject.objectPath.ln?.lnClass}"][refLNInst="${selectedDataObject.objectPath.ln?.inst}"][refDO="${selectedDataObject.name}"]`
									)
								)

								if (isConnectedLcConnectedToSelectedDo) {
									if (!lpsToSelect.includes(targetLP)) {
										targetLP.isLinked = true
										lpsToSelect.push(targetLP)
									}
									return connection
								}
							}
						});
				});
		}).filter(connection => connection !== undefined);

	store._selectedLogicalPhysicals = lpsToSelect
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

	const accessPointElements = Array.from(IEDElement.querySelectorAll("AccessPoint"))
	objectTree.ied.children = accessPointElements.map((accessPoint) => {
		const ap: ObjectNodeAccessPoint = {
			id: crypto.randomUUID(),
			name: accessPoint.getAttribute("name") || "unknown",
			children: [],
			objectPath: {
				ied: { id: objectTree.ied.id, name: objectTree.ied.name }
			},
			_type: NodeTypes.accessPoint
		}
		const SelectorLDevicesWithoutLD0 = "LDevice:not([inst='LD0'])"
		ap.children = Array.from(accessPoint.querySelectorAll(SelectorLDevicesWithoutLD0)).map((ldElement) => {
			const ld: ObjectNodeLogicalDevice = {
				id: `${objectTree.ied.id}::LD_${ldElement.getAttribute("inst")}`,
				inst: ldElement.getAttribute("inst") || "unknown",
				children: [],
				objectPath: {
					ied: { id: objectTree.ied.id, name: objectTree.ied.name },
					accessPoint: { name: ap.name }
				},
				_type: NodeTypes.logicalDevice
			}

			ld.children = Array.from(ldElement.querySelectorAll("LN")).map((lnElement) => {
				const ln: ObjectNodeLogicalNode = {
					id: `${ld.id}::LN_${lnElement.getAttribute("lnClass")}+LN_${lnElement.getAttribute("inst")}`,
					lnClass: lnElement.getAttribute("lnClass") || "unknown",
					inst: lnElement.getAttribute("inst") || "unknown",
					children: [],
					objectPath: {
						ied: { id: objectTree.ied.id, name: objectTree.ied.name },
						accessPoint: { name: ap.name },
						lDevice: { id: ld.id, inst: ld.inst }
					},
					_type: NodeTypes.logicalNode
				}

				const lnNodeType = doc.querySelector(`LNodeType[id="${lnElement.getAttribute("lnType") || ""}"]`);
				if (!lnNodeType) {
					console.warn(`could not find LNodeType with id: ${lnElement.getAttribute("lnType")}`)
					return ln
				}
				const dos = Array.from(lnNodeType.querySelectorAll("DO"))

				ln.children = dos.map((doElement) => {
					const [isAllowedCDC, cdc] = hasCDC(doElement, doc, TARGET_CDC_TYPES)

				if (!isAllowedCDC) {
						return undefined
					}
	
				const dataObject: ObjectNodeDataObject = {
						id: `${ln.id}::DO_${doElement.getAttribute("name")}`,
						name: doElement.getAttribute("name") || "unknown",
						objectPath: {
							ied: { id: objectTree.ied.id, name: objectTree.ied.name },
							accessPoint: { name: ap.name },
							lDevice: { id: ld.id, inst: ld.inst },
							ln: { id: ln.id, lnClass: ln.lnClass, inst: ln.inst }
						},
						cdcType: cdc,
					_type: NodeTypes.dataObject
					}
					return dataObject
				}).filter(Boolean) as ObjectNodeDataObject[]
				return ln
			})
			return ld
		})
		return ap
	})
	store.objectTree = objectTree
}

function hasCDC(doElement: Element, doc: XMLDocument, targetCDC: string[]): [boolean, string] {
	const type = doElement.getAttribute("type") || "";
	if (type === "") {
		return [false, ""];
	}

	const doType = doc.querySelector(`DOType[id="${type}"]`);
	if (!doType) {
		return [false, ""];
	}

	const cdc = doType.getAttribute("cdc") || "";
	if (cdc === "" || !targetCDC.includes(cdc.toLowerCase())) {
		return [false, ""];
	}

	return [true, cdc.toLowerCase()];
}