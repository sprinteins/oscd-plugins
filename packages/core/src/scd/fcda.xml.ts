import { FCDA } from "./fcda"

export const SelectorFCDA = "FCDA"

export function elementToFCDA(el: Element): FCDA{
	return new FCDA({
		ldInst:  el.getAttribute( "ldInst" )  ?? "",
		prefix:  el.getAttribute( "prefix" )  ?? "",
		lnClass: el.getAttribute( "lnClass" ) ?? "",
		lnInst:  el.getAttribute( "lnInst" )  ?? "",
		doName:  el.getAttribute( "doName" )  ?? "",
		daName:  el.getAttribute( "daName" )  ?? "",
		fc: 	    el.getAttribute( "fc" ) 	  ?? "",
	})
}