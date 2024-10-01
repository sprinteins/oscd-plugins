import { InputExtRef } from "./input-extref"

export const SelectorInputExtRef = "ExtRef"

export function elementToInputExtRef(el: Element): InputExtRef{
	return new InputExtRef({
		iedName: 	   el.getAttribute("iedName")     ?? "",
		serviceType: el.getAttribute("serviceType") ?? "",
		ldInst:    	 el.getAttribute("ldInst") 	    ?? "",
		lnClass: 	   el.getAttribute("lnClass") 	?? "",
		lnInst: 	    el.getAttribute("lnInst") 	    ?? "",
		prefix: 	    el.getAttribute("prefix") 	    ?? "",
		doName: 	    el.getAttribute("doName") 	    ?? "",
		daName: 	    el.getAttribute("daName") 	    ?? "",
		srcLNClass:  el.getAttribute("srcLNClass") 	?? "",
		srcLDInst: 	 el.getAttribute("srcLDInst")   ?? "",
		srcPrefix: 	 el.getAttribute("srcPrefix")   ?? "",
		srcCBName: 	 el.getAttribute("srcCBName")   ?? "",
	})
}