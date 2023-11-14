export class SCDQueries {
	constructor(
		private readonly root: Element,
	){}

	
	public static SelectorGSE = "GSE"
	public searchGSEs(options?:CommonOptions): GSEElement[]{
		return this.searchElement<GSEElement>(SCDQueries.SelectorGSE, ["ldInst", "cbName"], options)
	}

	public static SelectorIED = "IED"
	public static AttributeListIED: AttributeList<IEDElement>[] = ["name"]
	public searchIEDs(options?:CommonOptions): IEDElement[]{
		return this.searchElement<IEDElement>(SCDQueries.SelectorIED, SCDQueries.AttributeListIED, options)
	}

	public getBaysByIEDName(name: string): Set<string> {
		const root = this.determineRoot()
		const selector = `SCL Substation VoltageLevel Bay LNode[iedName='${name}']`
		// const selector = `SCL > Substation > VoltageLevel > Bay > LNode[iedName='${name}']`

		const lnodes = Array.from(root.querySelectorAll(selector))
		const connections = new Set<string>

		for (const lnode of lnodes) {
			if (lnode != null){
				const bay = lnode.closest("Bay")
				const bayName = bay?.getAttribute("name") 

				if (bayName != null)
					connections.add(bayName)
			}
		}

		return connections
	}

	public getSubnetworksByIEDName(name: string): Set<Element> {
		const root = this.determineRoot()
		const selector = `SCL > Communication > SubNetwork > ConnectedAP[iedName='${name}']`

		const connectedAPs = Array.from(root.querySelectorAll(selector))
		const connections = new Set<Element>

		for (const connectedAP of connectedAPs) {
			if (connectedAP != null){
				const bay = connectedAP.closest("SubNetwork")

				if (bay != null)
					connections.add(bay)
			}
		}

		return connections
	}

	public static SelectorGSEControl = "GSEControl"
	public searchGSEControls(options?:CommonOptions): GSEControlElement[] {
		return this.searchElement<GSEControlElement>(
			SCDQueries.SelectorGSEControl,
			["name", "datSet"],
			options,
		)
	}

	public searchGSEControlByIEDNameAndName(iedName: string, cbName: string, options?:CommonOptions): GSEControlElement {
		return this.searchElement<GSEControlElement>(
			`SCL > IED[name='${iedName}'] GSEControl[name='${cbName}']`,
			["name", "datSet"],
			options,
		)[0]
	}

	public static SelectorInput = "Inputs"
	public searchInputs(options?: CommonOptions): InputElement[] {
		return this.searchElement<InputElement>(SCDQueries.SelectorInput,[],options)
	}

	

	public static SelectorExtRef = "ExtRef"
	public static AttributeListExtRef: AttributeList<InputExtRefElement>[] = [
		"iedName",
		"serviceType",
		// "ldInst",
		// "lnClass",
		// "lnInst",
		// "prefix",
		// "doName",
		// "daName",
		// "srcLDInst",
		// "srcPrefix",
		"srcCBName",
	]
	public searchExtRef(options?: CommonOptions): InputExtRefElement[]{
		return this.searchElement<InputExtRefElement>( 
			SCDQueries.SelectorExtRef, 
			SCDQueries.AttributeListExtRef, 
			options,
		)
	}

	
	public static SelectorDataSet = "DataSet"
	public searchDataSetByName(name:string, options?:CommonOptions): Optional<DataSetElement>{
		const selector = `${SCDQueries.SelectorDataSet}[name="${name}"]`
		const elements = this.searchElement<DataSetElement>(
			selector,
			["name"],
			options,
		)
		if(elements.length !== 1){
			console.log({level: "error", msg: "we found not exactly one element", length: elements.length})
			return
		}
		return elements[0]
	}

	// public searchSubNetworkByGOOSE( iedName: string, ldInst: string, gseControlName: string){

	// }

	// We don't use the the standard functions because we look for parent elements
	public static SelectorLD = "LDevice"
	public searchElementsLDParent(element: Element): Optional<LDeviceElement>{
		const el = element.closest(SCDQueries.SelectorLD)
		if(!el){
			console.log({level: "error", msg: "could not find LD parent", element})
			return
		}
		const ld = createElement<LDeviceElement>(el,["inst"])
		return ld
	}

	public static SelectorGSEElement = "GSE"
	public searchGSE(ldInst:string, cbName:string, options?:CommonOptions): Optional<GSEElement>{
		const selector = `${SCDQueries.SelectorGSEElement}[ldInst='${ldInst}'][cbName='${cbName}']`
		const elements = this.searchElement<GSEElement>(selector,["cbName","ldInst"], options)
		if(elements.length !== 1){
			console.error({
				level:  "error", 
				msg:    "we did not found exaclty one GSE element", 
				length: elements.length, 
				ldInst,
				cbName,
				selector,
				root:   this.root,
				options,
			})
			return
		}

		return elements[0]
	}

	public static SelectorSubNetwork = "SubNetwork"
	public searchElementsParentSubnetwork(element: Element): Optional<SubNetworkElement>{
		const el = element.closest(SCDQueries.SelectorSubNetwork)
		if(!el){
			console.error({level: "error", msg: "could not find SubNetwork parent", element})
			return
		}

		const subNetowk = createElement<SubNetworkElement>(el, ["name"])
		return subNetowk
	}

	public static SelectorDOType = "DOType"
	public searchDOTypes(options?:CommonOptions): DOTypeElement[]{
		return this.searchElement<DOTypeElement>(SCDQueries.SelectorDOType, ["id"], options)
	}

	public static SelectorDAType = "DAType"
	public searchDATypes(options?:CommonOptions): DATypeElement[]{
		return this.searchElement<DATypeElement>(SCDQueries.SelectorDAType, ["id"], options)
	}	
	
	public static SelectorEnumType = "EnumType"
	public searchEnumTypes(options?:CommonOptions): EnumTypeElement[]{
		return this.searchElement<EnumTypeElement>(SCDQueries.SelectorEnumType, ["id"], options)
	}	

	public static SelectorDO = "DO"
	public searchDOsByType(type: string, options?:CommonOptions): DOElement[]{
		const selector = `${SCDQueries.SelectorDO}[type='${type}']`
		return this.searchElement<DOElement>(selector, ["name", "type"], options)
	}

	public static SelectorLNodeType = "LNodeType"
	public searchLNodeTypes(options?:CommonOptions): LNodeTypeElement[]{
		return this.searchElement<LNodeTypeElement>(SCDQueries.SelectorLNodeType, ["id", "lnClass"], options)
	}

	public static SelectorReportControl = "ReportControl"
	public searchReportControls(options?:CommonOptions): ReportControlElement[]{
		return this.searchElement<ReportControlElement>(SCDQueries.SelectorReportControl, ["rptID", "name", "datSet"], options)
	}

	public searchElementsParentIED(element: Element): Optional<IEDElement>{
		const parentSelector = SCDQueries.SelectorIED
		const parentIED = this.searchElementParent<IEDElement>(element, parentSelector, SCDQueries.AttributeListIED)

		return parentIED
	}

	public static SelectorClientLN = "ClientLN"
	public searcClientLNs(options?:CommonOptions): ClientLNElement[]{
		return this.searchElement<ClientLNElement>(SCDQueries.SelectorClientLN, ["iedName"], options)
	}

	public searchElementsByTypeAttr(type: string, options?: CommonOptions): SCDElement[]{
		const selector = `[type='${type}']`
		return this.searchElement<SCDElement>(selector, [], options)
	}
	
	public searchElementsByLnTypeAttr(type: string, options?: CommonOptions): SCDElement[]{
		const selector = `[lnType='${type}']`
		return this.searchElement<SCDElement>(selector, [], options)
	}

	
	// 
	// Privates
	// 
	private searchElement<T extends SCDElement>(selector: string, attributeList: AttributeList<T>[], options?:CommonOptions): T[]{
		const root = this.determineRoot(options)
		const elements = Array.from( root.querySelectorAll(selector) ) 
		const els = elements.map( el => createElement<T>(el, attributeList) )
		return els
	}

	private determineRoot(options?: CommonOptions): Element {
		if(!options?.root){ 
			return this.root 
		}

		return options.root
	}

	private searchElementParent<T extends SCDElement>(
		element:Element, 
		parentSelector: string, 
		attributeList: AttributeList<T>[],
	): Optional<T>{
		const parentEl = element.closest(parentSelector)
		if(!parentEl){
			return
		}

		return createElement<T>(parentEl, attributeList)
	}
}


// function createElement<T extends SCDElement>(el: Element, attributeList: (keyof T)[]): T{
function createElement<T extends SCDElement>(el: Element, attributeList: AttributeList<T>[]): T{
	const obj: {[key: string]: unknown} = { element: el }
	for(const attr of attributeList){
		const key = attr as string
		obj[key] = el.getAttribute(key) ?? ""
	}

	return obj as T
}

export type DOTypeElement = SCDElement & {
	id: string
	cdc: string
}

export type DATypeElement = SCDElement & {
	id: string
}
export type EnumTypeElement = SCDElement & {
	id: string
}

export type DOElement = SCDElement & {
	name: string
	type: string
}

export type LNodeTypeElement = SCDElement & {
	id: string
	lnClass: string
}

export type CommonOptions = {
	root?: Element
}

export type SCDElement = {
	element: Element
}

export type IdentifiableElement = SCDElement & {
	id: string
}

export type GSEElement = SCDElement & {
	ldInst: string
	cbName: string
}

export type IEDElement = SCDElement & {
	name: string
}

export type GSEControlElement = SCDElement & {
	name: string
	datSet: string
}

export type DataSetElement = SCDElement & {
	name: string
}

export type LDeviceElement = SCDElement & {
	inst: string
}

export type SubNetworkElement = SCDElement & {
	name: string
}

export type ReportControlElement = SCDElement & {
	rptID: string
	name: string
	datSet: string
}

export type ClientLNElement = SCDElement & {
	iedName: string
}

export type InputElement = SCDElement

export type InputExtRefElement = SCDElement & {	
	iedName: 	 string,
	serviceType: string,
	ldInst: 	 string,
	lnClass: 	 string,
	lnInst:  	 string,
	prefix:  	 string,
	doName:  	 string,
	daName:  	 string,
	srcLDInst: 	 string,
	srcPrefix: 	 string,
	srcCBName: 	 string,
}

export type InputExtRefElementWithDatSet = InputExtRefElement & {
	datSet: string
}

export type Optional<T> = T | undefined
export type AttributeList<T extends SCDElement> = Exclude<keyof T, keyof SCDElement>