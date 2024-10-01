import { Input } from "./input"
import { InputExtRef } from "./input-extref"
import { elementToInputExtRef, SelectorInputExtRef } from "./input-extref.xml"

export const SelectorInputs = "Inputs"

export function elementToInputs(el: Element): Input[]{
	const extRefsElements = Array.from( el?.querySelectorAll(SelectorInputExtRef) ?? [] )
	const extRefs = extRefsElements.map(elementToInputExtRef)

	const extRefBuckets: {[iedName: string]: InputExtRef[]} = {}
	for(const extRef of extRefs){
		if(!extRefBuckets[extRef.iedName]){
			extRefBuckets[extRef.iedName] = []
		}
		extRefBuckets[extRef.iedName].push(extRef)
	}
	const inputs = Object.keys(extRefBuckets).map( (iedName) => {
		return new Input({
			iedName,
			extRefs: extRefBuckets[iedName],
		})
	})

	return inputs
}