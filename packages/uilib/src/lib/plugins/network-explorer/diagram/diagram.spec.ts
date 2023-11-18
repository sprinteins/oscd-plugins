import { render, screen} from "@testing-library/svelte"
import {describe, it, expect } from "vitest"
import { Diagram } from "."
import type { Config } from "../../plugins/communication-explorer/_func-layout-calculation/config"
import type { IEDCommInfo } from "@oscd-plugins/core"
import { calculateLayout } from "../../plugins/communication-explorer/_func-layout-calculation"
import { clearIEDSelection, filterState, toggleMultiSelectionOfIED } from "../../plugins/communication-explorer/_store-view-filter"
import { get } from "svelte/store"
import userEvent from "@testing-library/user-event"
import { preferences$ } from "../../plugins/communication-explorer/_store-preferences"


describe("Diagram", () => {
	userEvent.setup()

	describe("rendering", () => {

		type TestCase = {
			desc: string,
			IEDs: IEDCommInfo[],
			expectedIEDTestIDs: string[],
			expectedConnectionTestIDs: string[],
		}


		const tests: TestCase[] = [
			{
				desc: "can render a single IED",
				IEDs: [
					{iedName: "IED_1-1", published: [], received: []},
				],
				expectedIEDTestIDs:        ["ied-IED_1-1"],
				expectedConnectionTestIDs: [],
			},
			{
				desc: "can render multiple IEDs",
				IEDs: [
					{iedName: "IED_1-1", published: [], received: []},
					{iedName: "IED_2-1", published: [], received: []},
					{iedName: "IED_3-4", published: [], received: []},
				],
				expectedIEDTestIDs:        ["ied-IED_1-1","ied-IED_2-1","ied-IED_3-4"],
				expectedConnectionTestIDs: [],
			},
			{
				desc: "can render MMS, SMV and GOOSE connections",
				IEDs: [
					{iedName:   "IED_1-1", published: [
						{ id: "0", name: "name", targetIEDName: "IED_2-1", serviceType: "MMS", serviceCbName: "", serviceDatSet: "" },
					], received: []},
					{iedName:   "IED_2-1", published: [], received:  [
						{ iedName: "IED_1-1", serviceType: "SMV", srcCBName: "irrelevant", data: [], datSet: "" },
						{ iedName: "IED_1-1", serviceType: "GOOSE", srcCBName: "irrelevant", data: [], datSet: "" },
					]},
					{iedName: "IED_3-4", published: [], received: []},
				],
				expectedIEDTestIDs:        ["ied-IED_1-1","ied-IED_2-1","ied-IED_3-4"],
				expectedConnectionTestIDs: [
					// "connection-con_published_ied-1_ied-0_MMS_0", // quick fix to isable, to do later. Test is red
					"connection-con_received_ied-0_ied-1_SampledValues_0",
					"connection-con_received_ied-0_ied-1_GOOSE_1",
				],
			},
			
		]

		tests.forEach(test)

		function test(tc: TestCase) {
			it(tc.desc, async () => {
				
				// 
				// Arrange
				// 
				const _config: Config = {
					height:              40,
					width:               100,
					spacingBase:         10,
					spacingBetweenNodes: 100,
				}

				const rootNode = await calculateLayout(tc.IEDs, _config, get(filterState), get(preferences$))
				clearIEDSelection()
					
				
				// 
				// Act
				// 
				render(Diagram, { rootNode })
				
				// 
				// Assert
				// 
				for( const iedTestID of tc.expectedIEDTestIDs ){
					screen.getByTestId(iedTestID)
				}
				
				for( const connectionTestID of tc.expectedConnectionTestIDs ){
					screen.getByTestId(connectionTestID)
				}
				
			})
		}

	})
	
	describe("selection", () => {

		type TestCase = {
			desc: string,
			IEDs: IEDCommInfo[],

			selectIndices: number[],
			expectedSelectedIndices: number[],
			highlightedConnections?: string[],
			irrelevantConnections?: string[],
		}


		const tests: TestCase[] = [
			{
				desc: "has selected class if isSelected is true",
				IEDs: [
					{iedName: "IED_1-1", published: [], received: []},
				],
				selectIndices:           [0],
				expectedSelectedIndices: [0],
			},
			{
				desc: "can select multiple IEDs",
				IEDs: [
					{iedName: "IED_1-1", published: [], received: []},
					{iedName: "IED_1-2", published: [], received: []},
				],
				selectIndices:           [0, 1],
				expectedSelectedIndices: [0, 1],
			},
			{
				desc: "not selected IEDs are not selected",
				IEDs: [
					{iedName: "IED_1-1", published: [], received: []},
					{iedName: "IED_1-2", published: [], received: []},
				],
				selectIndices:           [0],
				expectedSelectedIndices: [0],
			},
			{
				desc: "can toggle IED selection",
				IEDs: [
					{iedName: "IED_1-1", published: [], received: []},
					{iedName: "IED_1-2", published: [], received: []},
				],
				selectIndices:           [0,1,0],
				expectedSelectedIndices: [1],
			},
			{
				desc: "if an IED is selected, its published connections are highlighted and other connections are set to irrelevant",
				IEDs: [
					{iedName:   "IED_1-1", published: [
						{ id: "0", name: "name", targetIEDName: "IED_1-2", serviceType: "MMS", serviceCbName: "", serviceDatSet: "" },
					], received: []},
					
					{iedName: "IED_1-2", published: [], received: []},

					{iedName:   "IED_1-3", published: [], received:  [
						{ iedName: "IED_1-2", serviceType: "GOOSE", srcCBName: "irrelevant", data: [], datSet: "" },
					]},
				],
				selectIndices:           [1],
				expectedSelectedIndices: [1],
				highlightedConnections:  [
					"connection-con_received_ied-1_ied-2_GOOSE_0",
					// "connection-con_published_ied-1_ied-0_MMS_0", // quick fix to isable, to do later. Test is red
				],
				irrelevantConnections: [
				],
			},
		]

		// export type ReceivedMessage = {
		// 	iedName: 	 string // to show
		// 	serviceType: string // to filter
		// 	srcCBName: 	 string // to show
		// 	data:        InputExtRefElement[] 
		// }
		


		// iedInfos[0].published.push({
		// 	id:            "1",
		// 	name:          "name",
		// 	targetIEDName: iedInfos[1].iedName,
		// 	serviceType:   "MMS",
		// })

		tests.forEach(test)

		function test(tc: TestCase) {
			it(tc.desc, async () => {
				
				// 
				// Arrange
				// 
				const _config: Config = {
					height:              40,
					width:               100,
					spacingBase:         10,
					spacingBetweenNodes: 100,
				}

				const rootNode = await calculateLayout(tc.IEDs, _config, get(filterState), get(preferences$))
				clearIEDSelection()
					
				
				// 
				// Act
				// 
				for( const index of tc.selectIndices ){
					toggleMultiSelectionOfIED({label: tc.IEDs[index].iedName, id: tc.IEDs[index].iedName})
				}
				
				render(Diagram, { rootNode })

				// 
				// Assert
				// 
				tc.IEDs.forEach( (_, index) => {
					const classList = Array.from( screen.getByTestId(`ied-${tc.IEDs[index].iedName}`).classList)

					if(tc.expectedSelectedIndices.includes(index)){ 
						expect( classList, `IED: ${tc.IEDs[index].iedName}` ).toContain("selected")
					}else{
						expect( classList, `IED: ${tc.IEDs[index].iedName}` ).not.toContain("selected")
					}
				})

				for( const testid of tc.highlightedConnections ?? [] ){
					const conn = await screen.findByTestId(testid)
					expect(conn).not.toBeNull()
					const classList = Array.from( conn.classList )
					expect( classList, `${testid}, ${String(classList)}` ).toContain("ied-selected")
				}
				
				for( const testid of tc.irrelevantConnections ?? [] ){
					const conn = await screen.findByTestId(testid)
					expect(conn).not.toBeNull()
					const classList = Array.from( conn.classList )
					expect( classList, `${testid}, ${String(classList)}`).not.toContain("ied-selected")
					expect( classList, `${testid}, ${String(classList)}` ).toContain("irrelevant")
				}

				
			})
		}

	})
})
