/**
 * Source from: https://github.com/ca-d/oscd-template-generator/blob/main/generate-templates.js
 */

function describeEnumType(element: Element) {
	let _a, _b
	const vals: {[key: string]: unknown} = {}

	for (const val of Array.from(element.children)
		.filter(child => child.tagName === "EnumVal")
		.sort((v1, v2) => {
			let _a, _b
			return parseInt((_a = v1.getAttribute("ord")) !== null && _a !== void 0 ? _a : "", 10) -
            parseInt((_b = v2.getAttribute("ord")) !== null && _b !== void 0 ? _b : "", 10)
		}))
		vals[(_a = val.getAttribute("ord")) !== null && _a !== void 0 ? _a : ""] = (_b = val.textContent) !== null && _b !== void 0 ? _b : ""
	
	return { vals }
}

function describeDAType(element: Element) {
	let _a
	const bdas: {[key: string]: unknown} = {}
	for (const bda of Array.from(element.children)
		.filter(child => child.tagName === "BDA")
		.sort((c1, c2) => c1.outerHTML.localeCompare(c2.outerHTML))) {
		const [bType, type, dchg, dupd, qchg] = [
			"bType",
			"type",
			"dchg",
			"dupd",
			"qchg",
		].map(attr => bda.getAttribute(attr))
		bdas[(_a = bda.getAttribute("name")) !== null && _a !== void 0 ? _a : ""] = { bType, type, dchg, dupd, qchg }
	}
	return { bdas }
}
function describeDOType(element: Element) {
	const sdos: {[key: string]: unknown} = {}
	for (const sdo of Array.from(element.children)
		.filter(child => child.tagName === "SDO")
		.sort((c1, c2) => c1.outerHTML.localeCompare(c2.outerHTML))) {
		const [name, type, transient] = ["name", "type", "transient"].map(attr => sdo.getAttribute(attr))
		sdos[name !== null && name !== void 0 ? name : ""] = { type, transient }
	}
	const das: {[key: string]: unknown} = {}
	for (const da of Array.from(element.children)
		.filter(child => child.tagName === "DA")
		.sort((c1, c2) => c1.outerHTML.localeCompare(c2.outerHTML))) {
		const [name, fc, bType, type, dchg, dupd, qchg] = [
			"name",
			"fc",
			"bType",
			"type",
			"dchg",
			"dupd",
			"qchg",
		].map(attr => da.getAttribute(attr))
		das[name !== null && name !== void 0 ? name : ""] = {
			fc,
			bType,
			type,
			dchg,
			dupd,
			qchg,
		}
	}
	return {
		sdos,
		das,
		cdc: element.getAttribute("cdc"),
	}
}
function describeLNodeType(element: Element){
	const dos: {[key: string]: unknown} = {}
	for (const doElement of Array.from(element.children)
		.filter(child => child.tagName === "DO")
		.sort((c1, c2) => c1.outerHTML.localeCompare(c2.outerHTML))) {
		const [name, type, transient] = ["name", "type", "transient"].map(attr => doElement.getAttribute(attr))
		dos[name !== null && name !== void 0 ? name : ""] = { type, transient }
	}
	return {
		dos,
		lnClass: element.getAttribute("lnClass"),
	}
}

type DescriberFn = (element: Element) => any
const typeDescriptions: {[key: string]: DescriberFn } = {
	EnumType:  describeEnumType,
	DAType:    describeDAType,
	DOType:    describeDOType,
	LNodeType: describeLNodeType,
}
export function describeElement(element: Element) {
	let _a, _b
	return ((_b = (_a = typeDescriptions[element.tagName]) === null || _a === void 0 ? void 0 : _a.call(typeDescriptions, element)) !== null && _b !== void 0 ? _b : { xml: element.outerHTML })
}
