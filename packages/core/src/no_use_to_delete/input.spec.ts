import { expect, suite, test } from "vitest"
import { Input } from "./input"
import { elementToInputs, SelectorInputs } from "./input.xml"
import { InputExtRef } from "./input-extref"


suite("Input", () => {
	suite("convert element to Input", () => {
		
		interface TestCase {
			desc:   	    string
			xmlStr: 	    string
			expectedInputs: Input[]
		}
		
		const featureTests: TestCase[] = [
			{
				desc:   "one external reference",
				xmlStr: `<Inputs>
					<ExtRef iedName="IED1" serviceType="GOOSE" ldInst="CircuitBreaker_CB1" lnClass="XCBR" lnInst="1" prefix="test_" doName="Pos" daName="stVal" srcLDInst="CircuitBreaker_CB1" srcPrefix="test01_" srcLNClass="LLN0" srcCBName="GCB"/>
				</Inputs>`,
				expectedInputs: [new Input({
					iedName: "IED1",
					extRefs: [new InputExtRef({
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
					})],
				})],
			},
			{
				desc:   "one IED multiple ExtRefs",
				xmlStr: `<Inputs>
					<ExtRef iedName="IED1" serviceType="GOOSE" ldInst="CircuitBreaker_CB1" lnClass="XCBR" lnInst="1" prefix="test_" doName="Pos" daName="stVal" srcLDInst="CircuitBreaker_CB1" srcPrefix="test01_" srcLNClass="LLN0" srcCBName="GCB"/>
					<ExtRef iedName="IED1" serviceType="GOOSE" ldInst="CircuitBreaker_CB2" lnClass="XCBR" lnInst="2" prefix="test_" doName="Pos" daName="stVal" srcLDInst="CircuitBreaker_CB1" srcPrefix="test01_" srcLNClass="LLN0" srcCBName="GCB"/>
				</Inputs>`,
				expectedInputs: [new Input({
					iedName: "IED1",
					extRefs: [
						new InputExtRef({
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
						}),
						new InputExtRef({
							iedName:     "IED1",
							serviceType: "GOOSE",
							ldInst:      "CircuitBreaker_CB2",
							lnClass:     "XCBR",
							lnInst:      "2",
							prefix:      "test_",
							doName:      "Pos",
							daName:      "stVal",
							srcLDInst:   "CircuitBreaker_CB1",
							srcPrefix:   "test01_",
							srcLNClass:  "LLN0",
							srcCBName:   "GCB",
						}),
					],
				})],
			},
			{
				desc:   "two IEDs",
				xmlStr: `<Inputs>
					<ExtRef iedName="IED1" serviceType="GOOSE" ldInst="CircuitBreaker_CB1" lnClass="XCBR" lnInst="1" prefix="test_" doName="Pos" daName="stVal" srcLDInst="CircuitBreaker_CB1" srcPrefix="test01_" srcLNClass="LLN0" srcCBName="GCB"/>
					<ExtRef iedName="IED2" serviceType="GOOSE" ldInst="CircuitBreaker_CB1" lnClass="XCBR" lnInst="1" prefix="test_" doName="Pos" daName="stVal" srcLDInst="CircuitBreaker_CB1" srcPrefix="test01_" srcLNClass="LLN0" srcCBName="GCB"/>
				</Inputs>`,
				expectedInputs: [
					new Input({
						iedName: "IED1",
						extRefs: [new InputExtRef({
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
						})],
					}),
					new Input({
						iedName: "IED2",
						extRefs: [new InputExtRef({
							iedName:     "IED2",
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
						})],
					}),
				],
			},
		]
		
		featureTests.forEach(testFeature)
		
		function testFeature(tc: TestCase) {
			test(tc.desc, () => {
				
				// 
				// Arrange
				// 
				const parser = new DOMParser()
				const doc = parser.parseFromString(tc.xmlStr, "text/xml") as unknown as Element
				const el = doc.querySelector(SelectorInputs)
				if(el === null){
					throw new Error("msg='could not find Input element'")
				}
				
				// 
				// Action
				// 
				const actualInput = elementToInputs(el)
				
				// 
				// Assert
				// 
				expect(actualInput).toEqual(tc.expectedInputs)
				
			})
		}
		
	})
})