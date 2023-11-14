import { expect, describe, it } from "vitest"
import { InputExtRefElement, SCDQueries } from "../scd/scd-query"
import { 
	IEDCommInfo, 
	UCCommunicationInformation, 
	groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName,
	ReceivedMessage,
} from "./uc-communication-information"
import { xmlStr } from "../../testfiles/simple_v5"

describe("UCCommunicationInformation", () => {
	it("IEDCommInfos", () => {

		// 
		// Arrange
		// 
		const parser = new DOMParser()
		const doc = parser.parseFromString(xmlStr, "text/xml") as unknown as Element
		const scdQueries = new SCDQueries(doc)
		const ucci = new UCCommunicationInformation(scdQueries)


		// Note: use this if you want to debug the document in browser
		// globalThis.scd = doc

		//
		// Action
		// 
		const iedCommInfos: IEDCommInfo[] = ucci.IEDCommInfos()
		
		// 
		// Assert
		// 
		const expectedIEDCommInfos: IEDCommInfo[] = [
			{
				iedName:   "IED2",
				published: [
					{
						id:            "IED2/CBSW/XSWI/SwitchGearBRCB_1",
						name:          "ReportCb",
						targetIEDName: "IED1",
						serviceType:   "MMS",
					},
					{
						id:            "IED2/CBSW/XSWI/SwitchGearBRCB_2",
						name:          "ReportCb",
						targetIEDName: "IED1",
						serviceType:   "MMS",
					},
				],
				received: [],
			},
			// {
			// 	iedName: "IED2",
			// 	published: [
			// 		gseCont
			// 	],
			// }
		]
		
		// we don't check it yet
		for(const iedCommInfo of iedCommInfos){
			iedCommInfo.received = []
		}
		expectedIEDCommInfos.forEach( expectedInfo => expect(iedCommInfos).toContainEqual(expectedInfo) )
	})


	describe("groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName", () => {
		type TestCase = {
            desc: 	  string
			elements: InputExtRefElement[] 
			expectedGroups: ReceivedMessage[]
        }

		const testCases: TestCase[] = [
			{
				desc:     "find a message",
				elements: [
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB"}),
				],
				expectedGroups: [
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB"}),
					]},
				],
			},
			{
				desc:     "group data of the same message",
				elements: [
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB", daName: "q"}),
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB", daName: "stVal"}),
				],
				expectedGroups: [
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB", daName: "q"}),
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB", daName: "stVal"}),
					]},
				],
			},
			{
				desc:     "separate data of different messages",
				elements: [
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_1"}),
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_2"}),
				],
				expectedGroups: [
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB_1", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_1"}),
					]},
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB_2", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_2"}),
					]},
				],
			},
			{
				desc:     "group the data of the same message and separate data of different messages",
				elements: [
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB"}),
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB"}),
					makeInputExtRefElement({iedName: "IED2", serviceType: "SMV", srcCBName: "MSVCB01"}),
					makeInputExtRefElement({iedName: "IED2", serviceType: "SMV", srcCBName: "MSVCB01"}),
				],
				expectedGroups: [
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB"}),
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB"}),
					]},
					{iedName:     "IED2", serviceType: "SMV", srcCBName:   "MSVCB01", data:        [
						makeInputExtRefElement({iedName: "IED2", serviceType: "SMV", srcCBName: "MSVCB01"}),
						makeInputExtRefElement({iedName: "IED2", serviceType: "SMV", srcCBName: "MSVCB01"}),
					]},
				],
			},
			{
				desc:     "seperate data of different messages even if same service type",
				elements: [
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_1"}),
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_2"}),
					makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_3"}),
				],
				expectedGroups: [
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB_1", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_1"}),
					]},
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB_2", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_2"}),
					]},
					{iedName:     "IED1", serviceType: "GOOSE", srcCBName:   "GCB_3", data:        [
						makeInputExtRefElement({iedName: "IED1", serviceType: "GOOSE", srcCBName: "GCB_3"}),
					]},
				],
			},
		]

		testCases.forEach(testFeature)

		function testFeature(tc: TestCase){
			it(tc.desc, () => {
				const messages = groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(tc.elements)
				expect(messages).toEqual(tc.expectedGroups)
			})
		}

	})


})


const defaultExtRef: InputExtRefElement = {
	iedName:     "string",
	serviceType: "string",
	ldInst:      "string",
	lnClass:     "string",
	lnInst:      "string",
	prefix:      "string",
	doName:      "string",
	daName:      "string",
	srcLDInst:   "string",
	srcPrefix:   "string",
	srcCBName:   "string",
	element:     document.createElement("ExtRef"),
}
function makeInputExtRefElement( extRef: Partial<InputExtRefElement>){
	return {...defaultExtRef, ...extRef}
}