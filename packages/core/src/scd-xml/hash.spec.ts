import { describe, expect, it } from "vitest"
import { hash } from "./hash"
import { describeElement } from "./describers"

describe("Hashing", () => {
	describe("Different Element Types", () => {
		type XMLTypeDescription = {
			tagName:   string,
			testCases: TestCase[],
		}
		type TestCase = {
			desc:           string,
			element1:       string,
			element2:       string,
			differentHash?: boolean,
		}

		const xmlTypeDescriptions: XMLTypeDescription[] = [
			{
				tagName:   "EnumType",
				testCases: [
					{
						desc:     "same element",
						element1: `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
						</EnumType>`,
						element2: `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
						</EnumType>`,
					},
					{
						desc:     "same children but different child order does not matter",
						element1: `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
						</EnumType>`,
						element2: `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
						</EnumType>`,
					},
					{
						desc:          "different number of children produces different hash",
						differentHash: true,
						element1:      `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only_1</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
						</EnumType>`,
						element2: `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only_2</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
						</EnumType>`,
					},
					{
						desc:          "same number but different children produces different hash",
						differentHash: true,
						element1:      `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only_1</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
						</EnumType>`,
						element2: `
						<EnumType id="Dummy_ctlModel">
							<EnumVal ord="0">status-only_2</EnumVal>
							<EnumVal ord="1">direct-with-normal-security</EnumVal>
							<EnumVal ord="2">sbo-with-normal-security</EnumVal>
						</EnumType>`,
					},
				],
			},
			{
				tagName:   "DAType",
				testCases: [
					{
						desc:     "exact same element",
						element1: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="ctlNum" bType="INT8U"/>
						</DAType>`,
						element2: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="ctlNum" bType="INT8U"/>
						</DAType>`,
					},
					{
						desc:     "same children, different order",
						element1: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="ctlNum" bType="INT8U"/>
						</DAType>`,
						element2: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="ctlNum" bType="INT8U"/>
						</DAType>`,
					},
					{
						desc:          "different number of children produces different hash",
						differentHash: true,
						element1:      `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="ctlNum" bType="INT8U"/>
						</DAType>`,
						element2: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="ctlNum" bType="INT8U"/>
							<BDA name="Test" bType="BOOLEAN"/>
						</DAType>`,
					},
					{
						desc:          "same number of children but different ones produces different hash",
						differentHash: true,
						element1:      `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="ctlNum" bType="INT8U"/>
						</DAType>`,
						element2: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA name="ctlVal" bType="BOOLEAN"/>
							<BDA name="origin" bType="Struct" type="Dummy_origin"/>
							<BDA name="Test" bType="BOOLEAN"/>
						</DAType>`,
					},
					{
						desc:     "the order of BDAs' attributes does not matter",
						element1: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA 
								name="1" 
								bType="2" 
								type="3" 
								dhcg="4"
								dupd="5"
								qchg="6"
							/>
						</DAType>`,
						element2: `
						<DAType id="Dummy.LPHD1.Sim.SBOw">
							<BDA 
								bType="2" 
								name="1" 
								qchg="6"
								dhcg="4"
								dupd="5"
								type="3" 
							/>
						</DAType>`,
					},
				],
			},
			{
				tagName:   "DOType",
				testCases: [
					{
						desc:     "exact same element",
						element1: `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="MX" qchg="true" name="q" bType="Quality"/>
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
						</DOType>`,
						element2: `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="MX" qchg="true" name="q" bType="Quality"/>
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
						</DOType>`,
					},
					{
						desc:     "same children, different order",
						element1: `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="MX" qchg="true" name="q" bType="Quality"/>
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
						</DOType>`,
						element2: `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="MX" qchg="true" name="q" bType="Quality"/>
						</DOType>`,
					},
					// TODO: currently the <Val> element is ignored by the hash function
					// and therefore the hash of the following two elements is the same.
					// {
					// 	desc:     "same children, but one has a value element",
					// 	element1: `
					// 	<DOType cdc="SAV" id="DummySAV">
					// 		<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
					// 		<DA fc="MX" qchg="true" name="q" bType="Quality"/>
					// 		<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel">
					// 			<Val>sbo-with-enhanced-security</Val>
					// 		</DA>
					// 	</DOType>`,
					// 	element2: `
					// 	<DOType cdc="SAV" id="DummySAV">
					// 		<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
					// 		<DA fc="MX" qchg="true" name="q" bType="Quality"/>
					// 		<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel" />
					// 	</DOType>`,
					// },
					{
						desc:          "different number of children produces different hash",
						differentHash: true,
						element1:      `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="MX" qchg="true" name="q" bType="Quality"/>
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
						</DOType>`,
						element2: `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="MX" qchg="true" name="q" bType="Quality"/>
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
							<DA fc="CO" name="SBO" bType="ObjRef"/>
						</DOType>`,
					},
					{
						desc:          "same number of children but different ones produces different hash",
						differentHash: true,
						element1:      `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="MX" qchg="true" name="q" bType="Quality"/>
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
						</DOType>`,
						element2: `
						<DOType cdc="SAV" id="DummySAV">
							<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
							<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
							<DA fc="CO" name="SBO" bType="ObjRef"/>
						</DOType>`,
					},
					{
						desc:     "the order of DAs' attributes does not matter",
						element1: `
						<DOType cdc="SAV" id="DummySAV">
							<DA 
								name="1"
								fc="2"
								bType="3"
								type="4"
								dchg="5"
								dupd="6"
								qchg="7"
							/>
						</DOType>`,
						element2: `
						<DOType cdc="SAV" id="DummySAV">
							<DA 
								fc="2"
								bType="3"
								type="4"
								qchg="7"
								dupd="6"
								name="1"
								dchg="5"
							/>
						</DOType>`,
					},
				],
			},
			{
				tagName:   "LNodeType",
				testCases: [
					{
						desc:     "exact same element",
						element1: `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
							<DO name="Beh" type="Dummy.LLN0.Beh"/>
						</LNodeType>`,
						element2: `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
							<DO name="Beh" type="Dummy.LLN0.Beh"/>
						</LNodeType>`,
					},
					{
						desc:     "same children, different order",
						element1: `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
							<DO name="Beh" type="Dummy.LLN0.Beh"/>
						</LNodeType>`,
						element2: `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Beh" type="Dummy.LLN0.Beh"/>
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
						</LNodeType>`,
					},
					{
						desc:          "different number of children produces different hash",
						differentHash: true,
						element1:      `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
							<DO name="Beh" type="Dummy.LLN0.Beh"/>
						</LNodeType>`,
						element2: `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Beh" type="Dummy.LLN0.Beh"/>
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>	
							<DO name="Proxy" type="Dummy.SPS"/>
						</LNodeType>`,
					},
					{
						desc:          "same number of children but different ones produces different hash",
						differentHash: true,
						element1:      `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
							<DO name="Beh" type="Dummy.LLN0.Beh"/>
						</LNodeType>`,
						element2: `
						<LNodeType lnClass="LLN0" id="Dummy.LLN0">
							<DO name="Mod" type="Dummy.LLN0.Mod"/>
							<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
							<DO name="Proxy" type="Dummy.SPS"/>
						</LNodeType>`,
					},
					{
						desc:     "the order of DOs' attributes does not matter",
						element1: `
						<DOType cdc="SAV" id="DummySAV">
							<DO 
								name="1" 
								type="2"
								transient="3"
							/>
						</DOType>`,
						element2: `
						<DOType cdc="SAV" id="DummySAV">
							<DO 
								type="2"
								transient="3"
								name="1" 
							/>
						</DOType>`,
					},
				],
			},
		]

		xmlTypeDescriptions.forEach(describeFeature)

		function describeFeature(xmlDesc: XMLTypeDescription){
			describe(xmlDesc.tagName, () => {
				xmlDesc.testCases.forEach(testFeature)
			})
		}

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Arrange
				// parse xml
				const parser = new DOMParser()
				const xml1 = parser.parseFromString(tc.element1, "application/xml")
				const xml2 = parser.parseFromString(tc.element2, "application/xml")
				
				// Act
				const desc1 = describeElement(xml1.documentElement)
				const desc2 = describeElement(xml2.documentElement)
				const hash1 = await hash(JSON.stringify(desc1))
				const hash2 = await hash(JSON.stringify(desc2))
				
				// Assert
				if(tc.differentHash) {
					expect(hash1).not.toEqual(hash2)
				}else{
					expect(hash1).toEqual(hash2)	
				}
			})
		}

		
	}) // Different Element Types

}) // Hashing