import {expect, suite, test} from "vitest"
import { elementToInputExtRef, SelectorInputExtRef } from "./input-extref.xml"
import { InputExtRef } from "./input-extref"

suite("InputExtRef", () => {
	test("convert element to InputExtRef", () => {
		// 
		// Arrange
		// 
		const xmlStr = "<ExtRef iedName=\"IED1\" serviceType=\"GOOSE\" ldInst=\"CircuitBreaker_CB1\" lnClass=\"XCBR\" lnInst=\"1\" prefix=\"test_\" doName=\"Pos\" daName=\"stVal\" srcLDInst=\"CircuitBreaker_CB1\" srcPrefix=\"test01_\" srcLNClass=\"LLN0\" srcCBName=\"GCB\"/>"
		const parser = new DOMParser()
		const doc = parser.parseFromString(xmlStr, "text/xml") as unknown as Element
		const el = doc.querySelector(SelectorInputExtRef)
		if(el === null){
			throw new Error("msg='could not find Input ExtRef element'")
		}

		const expectedInputExtRef = new InputExtRef({
			iedName:     "IED1",
			serviceType: "GOOSE",
			ldInst:      "CircuitBreaker_CB1",
			lnClass:     "XCBR",
			lnInst:      "1",
			prefix:      "test_",
			doName:      "Pos",
			daName:      "stVal",
			srcLDInst:   "CircuitBreaker_CB1",
			srcPrefix:   "test01_",
			srcLNClass:  "LLN0",
			srcCBName:   "GCB",
		})

		// 
		// Action
		// 
		const actualInputExtRef = elementToInputExtRef(el)

		// 
		// Assert
		// 
		expect(actualInputExtRef).toEqual(expectedInputExtRef)
	})
})