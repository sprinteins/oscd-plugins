export const ssdMockA = `<?xml version="1.0" encoding="UTF-8"?>
	<SCL version="2007" revision="B" release="4">
	<Header id="project"/>
	<Substation xmlns="" name="TEMPLATE">
		<VoltageLevel name="TEMPLATE">
			<Bay name="TEMPLATE">
				<Function name="Func_1" uuid="0e552aee-9656-4f5b-befd-005a74a6f9c6">
					<LNode lnType="Dummy.LLN0"/>
				</Function>
				<Function name="Func_2" uuid="af05ef82-fac1-42ed-8c47-57d117e7083e">
					<LNode lnType="Dummy.LLN0.two"/>
					<LNode lnType="Dummy.XCBR1"/>
				</Function>
				<Function name="Func_3" uuid="5f411a34-4991-4f15-98cc-6c39a334b23c">
					<LNode lnType="Dummy.CSWI"/>
				</Function>
				<GeneralEquipment name="Valves_1" type="VLV" uuid="5f02e91e-76b0-411b-8694-d5110aae66f0">
					<EqFunction templateUuid="0e552aee-9656-4f5b-befd-005a74a6f9c6"/>
				</GeneralEquipment>
				<GeneralEquipment name="Valves_2" type="VLV" uuid="e8c51756-06d5-44e9-aafc-f7c083f65818">
					<EqFunction templateUuid="5f411a34-4991-4f15-98cc-6c39a334b23c"/>
				</GeneralEquipment>
				<ConductingEquipment name="Power Cable_1" type="CAB" uuid="601bc79d-f425-4229-800d-7ea0b7c6421d"/>
			</Bay>
			<Bay name="Bay_1" uuid="c2b220a2-64ae-439b-bfc4-04c5307f46f1">
				<GeneralEquipment templateUuid="5f02e91e-76b0-411b-8694-d5110aae66f0"/>
				<Function templateUuid="af05ef82-fac1-42ed-8c47-57d117e7083e"/>
			</Bay>
			<Bay name="Bay_2" uuid="93a61fa3-4d46-4d8a-82e5-71ed36569c34">
				<GeneralEquipment templateUuid="5f02e91e-76b0-411b-8694-d5110aae66f0"/>
				<Function templateUuid="af05ef82-fac1-42ed-8c47-57d117e7083e"/>
			</Bay>
			<Bay name="Bay_3" uuid="70b40ce7-efeb-48a8-8b9f-947b604ff819"/>
		</VoltageLevel>
	</Substation>
	<DataTypeTemplates>
		<LNodeType lnClass="LLN0" id="Dummy.LLN0">
			<DO name="Mod" type="Dummy.LLN0.Mod"/>
			<DO name="ExtendedMod" type="Dummy.LLN0.ExtendedMod"/>
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="Health" type="Dummy.LLN0.Health"/>
			<DO name="NamPlt" type="Dummy.LLN0.NamPlt"/>
		</LNodeType>
		<LNodeType lnClass="LLN0" id="Dummy.LLN0.two">
			<DO name="Mod" type="Dummy.LLN0.Mod"/>
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="Health" type="Dummy.LLN0.Health"/>
			<DO name="NamPlt" type="Dummy.LLN0.NamPlt"/>
		</LNodeType>
		<LNodeType lnClass="LPHD" id="Dummy.LPHD1">
			<DO name="PhyNam" type="Dummy.LPHD1.PhyNam"/>
			<DO name="PhyHealth" type="Dummy.LLN0.Health"/>
			<DO name="Proxy" type="Dummy.SPS"/>
			<DO name="Sim" type="Dummy.LPHD1.Sim"/>
		</LNodeType>
		<LNodeType lnClass="XCBR" id="Dummy.XCBR1">
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="Loc" type="Dummy.SPS"/>
			<DO name="OpCnt" type="Dummy.XCBR1.OpCnt"/>
			<DO name="Pos" type="Dummy.XCBR1.Pos"/>
			<DO name="BlkOpn" type="Dummy.XCBR1.BlkOpn"/>
			<DO name="BlkCls" type="Dummy.XCBR1.BlkOpn"/>
		</LNodeType>
		<LNodeType lnClass="CSWI" id="Dummy.CSWI">
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="Loc" type="Dummy.SPS"/>
			<DO name="OpCnt" type="Dummy.XCBR1.OpCnt"/>
			<DO name="Pos" type="Dummy.CSWI.Pos1"/>
		</LNodeType>
		<LNodeType lnClass="CILO" id="Dummy.CILO">
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="EnaOpn" type="Dummy.SPS"/>
			<DO name="EnaCls" type="Dummy.SPS"/>
		</LNodeType>
		<LNodeType lnClass="CSWI" id="Dummy.CSWIwithoutCtlModel">
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="Loc" type="Dummy.SPS"/>
			<DO name="OpCnt" type="Dummy.XCBR1.OpCnt"/>
			<DO name="Pos" type="Dummy.CSWI.Pos2"/>
		</LNodeType>
		<LNodeType lnClass="XSWI" id="Dummy.XSWI1">
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="Loc" type="Dummy.SPS"/>
			<DO name="OpCnt" type="Dummy.XCBR1.OpCnt"/>
			<DO name="Pos" type="Dummy.XCBR1.Pos"/>
			<DO name="BlkOpn" type="Dummy.XCBR1.BlkOpn"/>
			<DO name="BlkCls" type="Dummy.XCBR1.BlkOpn"/>
		</LNodeType>
		<LNodeType lnClass="GGIO" id="Dummy.GGIO1">
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="Ind1" type="Dummy.SPS"/>
			<DO name="SPCSO1" type="Dummy.LPHD1.Sim"/>
		</LNodeType>
		<LNodeType lnClass="TCTR" id="DummyTCTR">
			<DO name="Mod" type="Dummy.LLN0.Mod"/>
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="Amp" type="DummySAV"/>
		</LNodeType>
		<LNodeType lnClass="TVTR" id="DummyTVTR">
			<DO name="Mod" type="Dummy.LLN0.Mod"/>
			<DO name="Beh" type="Dummy.LLN0.Beh"/>
			<DO name="NamPlt" type="Dummy.XCBR1.NamPlt"/>
			<DO name="Vol" type="DummySAV"/>
		</LNodeType>
		<LNodeType lnClass="LGOS" id="Dummy.LGOS">
			<DO name="GoCBRef" type="Dummy.ORG"/>
			<DO name="St" type="OpenSCD_SPS_simple"/>
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
		</LNodeType>
		<DOType cdc="SAV" id="DummySAV">
			<DA fc="MX" name="instMag" bType="Struct" type="AnalogueValue_i"/>
			<DA fc="MX" qchg="true" name="q" bType="Quality"/>
			<DA fc="CF" name="sVC" bType="Struct" type="ScaledValueConfig"/>
		</DOType>
		<DOType cdc="ENC" id="Dummy.LLN0.Mod">
			<DA fc="ST" name="stVal" bType="Enum" type="Dummy_Beh"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
			<DA fc="ST" name="stSeld" bType="BOOLEAN"/>
			<DA fc="OR" name="opRcvd" bType="BOOLEAN"/>
			<DA fc="OR" name="opOk" bType="BOOLEAN"/>
			<DA fc="OR" name="tOpOk" bType="Timestamp"/>
			<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel"/>
			<DA fc="CF" name="sboTimeout" bType="INT32U"/>
			<DA fc="CF" name="operTimeout" bType="INT32U"/>
			<DA fc="CO" name="SBO" bType="ObjRef"/>
			<DA fc="CO" name="SBOw" bType="Struct" type="Dummy.LLN0.Mod.SBOw"/>
			<DA fc="CO" name="Oper" bType="Struct" type="Dummy.LLN0.Mod.SBOw"/>
			<DA fc="CO" name="Cancel" bType="Struct" type="Dummy.LLN0.Mod.Cancel"/>
		</DOType>
		<DOType cdc="ENC" id="Dummy.LLN0.ExtendedMod">
			<SDO fc="ST" name="someSdo" type="someSdoType"/>
			<DA fc="ST" name="stVal" bType="Enum" type="Dummy_Beh"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
			<DA fc="ST" name="stSeld" bType="BOOLEAN"/>
			<DA fc="OR" name="opRcvd" bType="BOOLEAN"/>
			<DA fc="OR" name="opOk" bType="BOOLEAN"/>
			<DA fc="OR" name="tOpOk" bType="Timestamp"/>
			<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel"/>
			<DA fc="CF" name="sboTimeout" bType="INT32U"/>
			<DA fc="CF" name="operTimeout" bType="INT32U"/>
			<DA fc="CO" name="SBO" bType="ObjRef"/>
			<DA fc="CO" name="SBOw" bType="Struct" type="Dummy.LLN0.Mod.SBOw"/>
			<DA fc="CO" name="Oper" bType="Struct" type="Dummy.LLN0.Mod.SBOw"/>
			<DA fc="CO" name="Cancel" bType="Struct" type="Dummy.LLN0.Mod.Cancel"/>
		</DOType>
		<DOType cdc="CMV" id="someSdoType">
			<DA fc="MX" qchg="true" name="q" bType="Quality"/>
			<DA fc="MX" name="t" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ENS" id="Dummy.LLN0.Beh">
			<DA fc="ST" name="stVal" bType="Enum" type="Dummy_Beh"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ENS" id="Dummy.LLN0.Health">
			<DA fc="ST" name="stVal" bType="Enum" type="Dummy_Health"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
		</DOType>
		<DOType cdc="LPL" id="Dummy.LLN0.NamPlt">
			<DA fc="DC" name="vendor" bType="VisString255"/>
			<DA fc="DC" name="swRev" bType="VisString255"/>
			<DA fc="DC" name="d" bType="VisString255"/>
			<DA fc="DC" name="configRev" bType="VisString255"/>
			<DA fc="EX" name="ldNs" bType="VisString255"/>
		</DOType>
		<DOType cdc="DPL" id="Dummy.LPHD1.PhyNam">
			<DA fc="DC" name="vendor" bType="VisString255"/>
			<DA fc="DC" name="hwRev" bType="VisString255"/>
			<DA fc="DC" name="swRev" bType="VisString255"/>
			<DA fc="DC" name="serNum" bType="VisString255"/>
			<DA fc="DC" name="model" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPC" id="Dummy.LPHD1.Sim">
			<DA fc="ST" name="stVal" bType="BOOLEAN"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
			<DA fc="ST" name="stSeld" bType="BOOLEAN"/>
			<DA fc="OR" name="opRcvd" bType="BOOLEAN"/>
			<DA fc="OR" name="opOk" bType="BOOLEAN"/>
			<DA fc="OR" name="tOpOk" bType="Timestamp"/>
			<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel"/>
			<DA fc="CF" name="sboTimeout" bType="INT32U"/>
			<DA fc="CF" name="operTimeout" bType="INT32U"/>
			<DA fc="DC" name="d" bType="VisString255"/>
			<DA fc="CO" name="SBO" bType="ObjRef"/>
			<DA fc="CO" name="SBOw" bType="Struct" type="Dummy.LPHD1.Sim.SBOw"/>
			<DA fc="CO" name="Oper" bType="Struct" type="Dummy.LPHD1.Sim.SBOw"/>
			<DA fc="CO" name="Cancel" bType="Struct" type="Dummy.LPHD1.Sim.Cancel"/>
		</DOType>
		<DOType cdc="DPC" id="Dummy.XCBR1.Pos">
			<DA fc="ST" name="stVal" bType="Dbpos"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
			<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel"/>
			<DA fc="DC" name="d" bType="VisString255"/>
		</DOType>
		<DOType cdc="DPC" id="Dummy.CSWI.Pos1">
			<DA fc="ST" name="stVal" bType="Dbpos"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
			<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel">
				<Val>sbo-with-enhanced-security</Val>
			</DA>
			<DA fc="DC" name="d" bType="VisString255"/>
		</DOType>
		<DOType cdc="DPC" id="Dummy.CSWI.Pos2">
			<DA fc="ST" name="stVal" bType="Dbpos"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
			<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel"/>
			<DA fc="DC" name="d" bType="VisString255"/>
		</DOType>
		<DOType cdc="INS" id="Dummy.XCBR1.OpCnt">
			<DA fc="ST" name="stVal" bType="INT32"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
		</DOType>
		<DOType cdc="LPL" id="Dummy.XCBR1.NamPlt">
			<DA fc="DC" name="vendor" bType="VisString255"/>
			<DA fc="DC" name="swRev" bType="VisString255"/>
			<DA fc="DC" name="d" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPC" id="Dummy.XCBR1.BlkOpn">
			<DA fc="ST" name="stVal" bType="BOOLEAN"/>
			<DA fc="ST" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
			<DA fc="CF" name="ctlModel" bType="Enum" type="Dummy_ctlModel"/>
			<DA fc="DC" name="d" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Dummy.SPS">
			<DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
			<DA fc="ST" qchg="true" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ORG" id="Dummy.ORG">
			<DA name="setSrcRef" bType="ObjRef" dchg="true" fc="SP"/>
		</DOType>
		<DOType cdc="SPS" id="OpenSCD_SPS_simple">
			<DA name="stVal" bType="BOOLEAN" dchg="true" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="d" bType="VisString255" fc="DC"/>
		</DOType>
		<DOType cdc="ENC" id="OpenSCD_ENC_Mod">
			<DA name="origin" bType="Struct" dchg="true" fc="ST" type="OpenSCD_Originator"/>
			<DA name="stVal" bType="Enum" dchg="true" fc="ST" type="BehaviourModeKind"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="ctlModel" bType="Enum" fc="CF" type="CtlModelKind">
				<Val>sbo-with-enhanced-security</Val>
			</DA>
			<DA name="sboTimeout" bType="INT32U" fc="CF">
				<Val>30000</Val>
			</DA>
			<DA name="operTimeout" bType="INT32U" fc="CF">
				<Val>600</Val>
			</DA>
			<DA name="SBOw" bType="Struct" fc="CO" type="OpenSCD_OperSBOw_BehaviourModeKind"/>
			<DA name="Oper" bType="Struct" fc="CO" type="OpenSCD_OperSBOw_BehaviourModeKind"/>
			<DA name="Cancel" bType="Struct" fc="CO" type="OpenSCD_Cancel_BehaviourModeKind"/>
		</DOType>
		<DOType cdc="ENS" id="OpenSCD_ENS_Health">
			<DA name="stVal" bType="Enum" dchg="true" fc="ST" type="HealthKind"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
		</DOType>
		<DOType cdc="ENS" id="OpenSCD_ENS_Beh">
			<DA name="stVal" bType="Enum" dchg="true" fc="ST" type="BehaviourModeKind"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
		</DOType>
		<DOType cdc="LPL" id="OpenSCD_LPL_noLD">
			<DA name="vendor" bType="VisString255" fc="DC"/>
			<DA name="swRev" bType="VisString255" fc="DC"/>
			<DA name="d" bType="VisString255" fc="DC"/>
			<DA name="configRev" bType="VisString255" fc="DC"/>
		</DOType>
		<DAType id="OpenSCD_Originator">
			<BDA name="orCat" bType="Enum" type="OriginatorCategoryKind"/>
			<BDA name="orIdent" bType="Octet64"/>
		</DAType>
		<DAType id="OpenSCD_OperSBOw_BehaviourModeKind">
			<BDA name="ctlVal" bType="Enum" type="BehaviourModeKind"/>
			<BDA name="origin" bType="Struct" type="OpenSCD_Originator"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
			<ProtNs type="8-MMS">IEC 61850-8-1:2003</ProtNs>
		</DAType>
		<DAType id="AnalogueValue_i">
			<BDA name="i" bType="INT32"/>
		</DAType>
		<DAType id="ScaledValueConfig">
			<BDA name="scaleFactor" bType="FLOAT32"/>
			<BDA name="offset" bType="FLOAT32"/>
		</DAType>
		<DAType id="Dummy_origin">
			<BDA name="orCat" bType="Enum" type="Dummy_orCategory"/>
			<BDA name="orIdent" bType="Octet64"/>
		</DAType>
		<DAType id="Dummy.LLN0.Mod.SBOw">
			<BDA name="ctlVal" bType="Enum" type="Dummy_Beh"/>
			<BDA name="origin" bType="Struct" type="Dummy_origin"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
			<ProtNs>IEC 61850-8-1:2003</ProtNs>
		</DAType>
		<DAType id="Dummy.LLN0.Mod.Cancel">
			<BDA name="ctlVal" bType="Enum" type="Dummy_Beh"/>
			<BDA name="origin" bType="Struct" type="Dummy_origin"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
		</DAType>
		<DAType id="Dummy.LPHD1.Sim.SBOw">
			<BDA name="ctlVal" bType="BOOLEAN"/>
			<BDA name="origin" bType="Struct" type="Dummy_origin"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
		</DAType>
		<DAType id="Dummy.LPHD1.Sim.Cancel">
			<BDA name="ctlVal" bType="BOOLEAN"/>
			<BDA name="origin" bType="Struct" type="Dummy_origin"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
		</DAType>
		<EnumType id="Dummy_ctlModel">
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
			<EnumVal ord="2">sbo-with-normal-security</EnumVal>
			<EnumVal ord="3">direct-with-enhanced-security</EnumVal>
			<EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
		</EnumType>
		<EnumType id="Dummy_Beh">
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="Dummy_Health">
			<EnumVal ord="1">Ok</EnumVal>
			<EnumVal ord="2">Warning</EnumVal>
			<EnumVal ord="3">Alarm</EnumVal>
		</EnumType>
		<EnumType id="Dummy_orCategory">
			<EnumVal ord="0">not-supported</EnumVal>
			<EnumVal ord="1">bay-control</EnumVal>
			<EnumVal ord="2">station-control</EnumVal>
			<EnumVal ord="3">remote-control</EnumVal>
			<EnumVal ord="4">automatic-bay</EnumVal>
			<EnumVal ord="5">automatic-station</EnumVal>
			<EnumVal ord="6">automatic-remote</EnumVal>
			<EnumVal ord="7">maintenance</EnumVal>
			<EnumVal ord="8">process</EnumVal>
		</EnumType>
		<EnumType id="BehaviourModeKind">
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="CtlModelKind">
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
			<EnumVal ord="2">sbo-with-normal-security</EnumVal>
			<EnumVal ord="3">direct-with-enhanced-security</EnumVal>
			<EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>`
