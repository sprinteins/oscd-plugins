import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils'
import type { BayType, ConductingEquipmentTemplate } from '../common-types'
import type { EquipmentMatch } from '../domain/matching'
import { reMatchEquipment } from './re-match-equipment.action'

vi.mock('@/headless/utils', () => ({
	getDocumentAndEditor: vi.fn()
}))

vi.mock('@/headless/stores', () => ({
	bayStore: {
		scdBay: null as Element | null,
		assignedBayTypeUuid: null as string | null,
		equipmentMatches: [] as EquipmentMatch[]
	},
	equipmentMatchingStore: {
		manualMatches: new Map<string, string>()
	},
	ssdImportStore: {
		bayTypes: [] as BayType[],
		conductingEquipmentTemplates: [] as ConductingEquipmentTemplate[]
	},
	assignedLNodesStore: {
		rebuild: vi.fn()
	}
}))

const PARSER = new DOMParser()

function parseXml(xml: string): XMLDocument {
	return PARSER.parseFromString(
		xml,
		'application/xml'
	) as unknown as XMLDocument
}

// Build a simple test document with the same UUIDs as the fixture but without
// SCL namespaces, which jsdom cannot handle with standard DOM query APIs.
function buildTestDoc(): XMLDocument {
	return parseXml(`
<SCL>
	<Substation name="UW_TESTSITE">
		<VoltageLevel name="C1_">
			<Bay name="Q01A_" uuid="1f1eebdd-4146-4281-a085-eb256dbba33f" templateUuid="${BAY_TYPE_UUID}">
				<ConductingEquipment name="-QC9" type="DIS" uuid="${QC9_UUID}" templateUuid="${BT_CE_QC9_UUID}" originUuid="${TEMPLATE_QC9_UUID}">
					<Terminal name="T1" uuid="c79f3e5c-77e6-439a-9954-b40db1260bb0"/>
					<Terminal name="T2" uuid="eb30b6d1-70cc-42a8-be8b-460e664334ea"/>
					<EqFunction name="DisconnectorFunction" uuid="${QC9_EQ_FUNC_UUID}">
						<LNode lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment name="-QB91" type="DIS" uuid="${QB91_UUID}" templateUuid="${BT_CE_QB91_UUID}" originUuid="${TEMPLATE_QB91_UUID}">
					<Terminal name="T1" uuid="2623bdb3-7b69-463b-81c5-f48679f7faf4"/>
					<Terminal name="T2" uuid="3805ba0f-7ad0-49c0-96f6-d9b55d27399e"/>
					<EqFunction name="DisconnectorFunction" uuid="${QB91_EQ_FUNC_UUID}">
						<LNode lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
					</EqFunction>
				</ConductingEquipment>
			</Bay>
		</VoltageLevel>
	</Substation>
	<IED name="Test">
		<AccessPoint name="A">
			<Server>
				<LDevice inst="${QC9_OLD_LDEVICE_INST}" ldName="Test_${QC9_OLD_LDEVICE_INST}">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
		<AccessPoint name="B">
			<Server>
				<LDevice inst="${QB91_OLD_LDEVICE_INST}" ldName="Test_${QB91_OLD_LDEVICE_INST}">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
</SCL>
	`)
}

// UUIDs from the fixture documents
const BAY_TYPE_UUID = '0f77531c-cd29-4dfe-b070-dfc1803af9ed'

const QC9_UUID = 'f8ad7fef-d2cc-46d1-8ac6-c5292cc76da5'
const QB91_UUID = '015f1cad-54a9-42f1-b1d8-61205caf10d6'

// BayType ConductingEquipment UUIDs (= templateUuid on the CE in the doc)
const BT_CE_QC9_UUID = '615085c8-5db2-46cf-9beb-88d90262a643'
const BT_CE_QB91_UUID = '1ecc0aa5-d5f4-4451-8ec3-b5e24763aa79'

// ConductingEquipmentTemplate UUIDs (= originUuid on the CE in the doc)
const TEMPLATE_QC9_UUID = '9e122308-39a6-46f1-a455-b816f4dc708d'
const TEMPLATE_QB91_UUID = '0aece9bd-0d45-4566-b258-6df5e955aade'

const QC9_EQ_FUNC_UUID = 'a0d0d78e-81da-41b8-a480-b89217ed7a40'
const QB91_EQ_FUNC_UUID = 'ce34b98c-305b-4240-8fd4-a9a499b2eb84'
const QC9_OLD_LDEVICE_INST = 'QC9_DisconnectorFunction_a0d0d78e'
const QB91_OLD_LDEVICE_INST = 'QB91_DisconnectorFunction_ce34b98c'

function findEl(
	doc: XMLDocument,
	tagName: string,
	attr: string,
	value: string
): Element {
	const el = Array.from(doc.getElementsByTagNameNS('*', tagName)).find(
		(e) => e.getAttribute(attr) === value
	)
	if (!el)
		throw new Error(
			`Element <${tagName} ${attr}="${value}"> not found in document`
		)
	return el
}

const templateQC9: ConductingEquipmentTemplate = {
	uuid: TEMPLATE_QC9_UUID,
	name: '-QC9',
	type: 'DIS',
	terminals: [],
	eqFunctions: [
		{
			uuid: 'eqfunc-template-qc9',
			name: 'DisconnectorFunction',
			lnodes: [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI$oscd$_5114e81752706b92',
					lnInst: '1'
				}
			]
		}
	]
}

const templateQB91: ConductingEquipmentTemplate = {
	uuid: TEMPLATE_QB91_UUID,
	name: '-QB91',
	type: 'DIS',
	terminals: [],
	eqFunctions: [
		{
			uuid: 'eqfunc-template-qb91',
			name: 'DisconnectorFunction',
			lnodes: [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI$oscd$_5114e81752706b92',
					lnInst: '1'
				}
			]
		}
	]
}

const bayType: BayType = {
	uuid: BAY_TYPE_UUID,
	name: 'Q01A_',
	conductingEquipments: [
		{
			uuid: BT_CE_QC9_UUID,
			templateUuid: TEMPLATE_QC9_UUID,
			virtual: false
		},
		{
			uuid: BT_CE_QB91_UUID,
			templateUuid: TEMPLATE_QB91_UUID,
			virtual: false
		}
	],
	functions: []
}

function buildDocBeforeRematch() {
	return parseXml(`
    <?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates" version="2007" revision="B">
	<Header id="" toolID="SCT-EB"/>
	<Substation name="UW_TESTSITE" sxy:x="1" sxy:y="1">
		<VoltageLevel name="C1_" desc="380kV" sxy:x="1" sxy:y="1">
			<Bay name="Q01A_" desc="Drossel-Feld" sxy:x="1" sxy:y="7" sxy:dir="horizontal" uuid="1f1eebdd-4146-4281-a085-eb256dbba33f" templateUuid="0f77531c-cd29-4dfe-b070-dfc1803af9ed">
				<ConductingEquipment name="-QC9" desc="Abgangs-Erder" type="DIS" sxy:x="5" sxy:y="1" sxy:dir="horizontal" uuid="f8ad7fef-d2cc-46d1-8ac6-c5292cc76da5" templateUuid="615085c8-5db2-46cf-9beb-88d90262a643" originUuid="9e122308-39a6-46f1-a455-b816f4dc708d">
					<Terminal bayName="Q01A_" cNodeName="grounded" connectivityNode="UW_TESTSITE/C1_/Q01A_/grounded" name="T1" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="c79f3e5c-77e6-439a-9954-b40db1260bb0"/>
					<Terminal bayName="Q01A_" cNodeName="Busbar1" connectivityNode="UW_TESTSITE/C1_/BB1/Busbar1" name="T2" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="eb30b6d1-70cc-42a8-be8b-460e664334ea"/>
					<EqFunction name="DisconnectorFunction" uuid="a0d0d78e-81da-41b8-a480-b89217ed7a40">
						<LNode uuid="ed8df0be-253f-4aed-9ed2-15d1995d1889" lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment name="-QB91" desc="Abgangs-Trenner" type="DIS" sxy:x="3" sxy:y="3" uuid="015f1cad-54a9-42f1-b1d8-61205caf10d6" templateUuid="1ecc0aa5-d5f4-4451-8ec3-b5e24763aa79" originUuid="0aece9bd-0d45-4566-b258-6df5e955aade">
					<Terminal bayName="Q01A_" cNodeName="CN_42839720-5b13-4227-843e-5c417f253b78" connectivityNode="UW_TESTSITE/C1_/Q01A_/CN_42839720-5b13-4227-843e-5c417f253b78" name="T1" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="2623bdb3-7b69-463b-81c5-f48679f7faf4"/>
					<Terminal bayName="Q01A_" cNodeName="Busbar1" connectivityNode="UW_TESTSITE/C1_/BB1/Busbar1" name="T2" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="3805ba0f-7ad0-49c0-96f6-d9b55d27399e"/>
					<EqFunction name="DisconnectorFunction" uuid="ce34b98c-305b-4240-8fd4-a9a499b2eb84">
						<LNode uuid="1739f561-81d2-4a5d-b2c6-ae952d074488" lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
					</EqFunction>
				</ConductingEquipment>
			</Bay>
		</VoltageLevel>
	</Substation>
	<IED configVersion="1.0" engRight="full" manufacturer="none" originalSclRevision="B" originalSclVersion="2007" type="none" name="Test" desc="">
		<Services nameLength="64"/>
		<AccessPoint name="A" desc="">
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_A" ldName="Test_LD0_A">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="LPHD" lnType="LPHD$oscd$_828d2d9919a24175" lnInst="1"/>
				</LDevice>
				<LDevice inst="QC9_DisconnectorFunction_a0d0d78e" ldName="Test_QC9_DisconnectorFunction_a0d0d78e">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
		<AccessPoint name="B" desc="">
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_B" ldName="Test_LD0_B">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="LPHD" lnType="LPHD$oscd$_828d2d9919a24175" lnInst="1"/>
				</LDevice>
				<LDevice inst="QB91_DisconnectorFunction_ce34b98c" ldName="Test_QB91_DisconnectorFunction_ce34b98c">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType id="ID" lnClass="LLN0">
			<DO name="NamPlt"/>
			<DO name="Beh"/>
			<DO name="Health"/>
			<DO name="Mod"/>
		</LNodeType>
		<LNodeType lnClass="LPHD" id="LPHD$oscd$_828d2d9919a24175">
			<DO name="PhyHealth" type="PhyHealth$oscd$_27e9f363eb9812fc"/>
			<DO name="PhyNam" type="PhyNam$oscd$_1b7440bbb0dea6d1"/>
			<DO name="Proxy" type="Proxy$oscd$_d915d66d9e42a575"/>
		</LNodeType>
		<LNodeType lnClass="XSWI" id="XSWI$oscd$_5114e81752706b92">
			<DO name="Beh" type="Beh$oscd$_27e9f363eb9812fc"/>
			<DO name="BlkCls" type="BlkCls$oscd$_53c7a68f14acf795"/>
			<DO name="BlkOpn" type="BlkOpn$oscd$_53c7a68f14acf795"/>
			<DO name="Loc" type="Loc$oscd$_d915d66d9e42a575"/>
			<DO name="OpCnt" type="OpCnt$oscd$_bbaa9369107884bc"/>
			<DO name="Pos" type="Pos$oscd$_98368a53c8d4eb20"/>
			<DO name="SwTyp" type="SwTyp$oscd$_27e9f363eb9812fc"/>
		</LNodeType>
		<DOType cdc="ENS" id="Beh$oscd$_27e9f363eb9812fc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_3effb084713fc1fd"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPC" id="BlkCls$oscd$_53c7a68f14acf795">
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_3effb084713fc1fd"/>
		</DOType>
		<DOType cdc="SPC" id="BlkOpn$oscd$_53c7a68f14acf795">
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_3effb084713fc1fd"/>
		</DOType>
		<DOType cdc="SPS" id="Loc$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="INS" id="OpCnt$oscd$_bbaa9369107884bc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="INT32"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="DPC" id="Pos$oscd$_98368a53c8d4eb20">
			<DA name="stVal" fc="ST" dchg="true" bType="Dbpos"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_3effb084713fc1fd"/>
		</DOType>
		<DOType cdc="ENS" id="SwTyp$oscd$_27e9f363eb9812fc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_3effb084713fc1fd"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<EnumType id="ctlModel$oscd$_3effb084713fc1fd"/>
		<DOType cdc="ENS" id="PhyHealth$oscd$_27e9f363eb9812fc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_3effb084713fc1fd"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="DPL" id="PhyNam$oscd$_1b7440bbb0dea6d1">
			<DA name="vendor" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Proxy$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<EnumType id="stVal$oscd$_3effb084713fc1fd"/>
	</DataTypeTemplates>
</SCL>
    `)
}

function buildDocAfterRematch() {
	return parseXml(`
        <?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates" version="2007" revision="B">
	<Header id="" toolID="SCT-EB"/>
	<Substation name="UW_TESTSITE" sxy:x="1" sxy:y="1">
		<VoltageLevel name="C1_" desc="380kV" sxy:x="1" sxy:y="1">
			<Bay name="Q01A_" desc="Drossel-Feld" sxy:x="1" sxy:y="7" sxy:dir="horizontal" uuid="1f1eebdd-4146-4281-a085-eb256dbba33f" templateUuid="0f77531c-cd29-4dfe-b070-dfc1803af9ed">
				<ConductingEquipment name="-QC9" desc="Abgangs-Erder" type="DIS" sxy:x="5" sxy:y="1" sxy:dir="horizontal" uuid="f8ad7fef-d2cc-46d1-8ac6-c5292cc76da5" templateUuid="1ecc0aa5-d5f4-4451-8ec3-b5e24763aa79" originUuid="0aece9bd-0d45-4566-b258-6df5e955aade">
					<Terminal bayName="Q01A_" cNodeName="grounded" connectivityNode="UW_TESTSITE/C1_/Q01A_/grounded" name="T1" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="c79f3e5c-77e6-439a-9954-b40db1260bb0"/>
					<Terminal bayName="Q01A_" cNodeName="Busbar1" connectivityNode="UW_TESTSITE/C1_/BB1/Busbar1" name="T2" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="eb30b6d1-70cc-42a8-be8b-460e664334ea"/>
					<EqFunction name="DisconnectorFunction" uuid="a1901019-e6a6-4b1a-9650-aa3d6df89500">
						<LNode uuid="274a6464-749f-4dcc-af76-6cd5f8c2d023" lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment name="-QB91" desc="Abgangs-Trenner" type="DIS" sxy:x="3" sxy:y="3" uuid="015f1cad-54a9-42f1-b1d8-61205caf10d6" templateUuid="615085c8-5db2-46cf-9beb-88d90262a643" originUuid="9e122308-39a6-46f1-a455-b816f4dc708d">
					<Terminal bayName="Q01A_" cNodeName="CN_42839720-5b13-4227-843e-5c417f253b78" connectivityNode="UW_TESTSITE/C1_/Q01A_/CN_42839720-5b13-4227-843e-5c417f253b78" name="T1" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="2623bdb3-7b69-463b-81c5-f48679f7faf4"/>
					<Terminal bayName="Q01A_" cNodeName="Busbar1" connectivityNode="UW_TESTSITE/C1_/BB1/Busbar1" name="T2" substationName="UW_TESTSITE" voltageLevelName="C1_" uuid="3805ba0f-7ad0-49c0-96f6-d9b55d27399e"/>
					<EqFunction name="DisconnectorFunction" uuid="a439f5f7-97de-4e63-9898-346075fb8d39">
						<LNode uuid="a28e42f8-2d77-45ec-923f-729c3ed16f00" lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
					</EqFunction>
				</ConductingEquipment>
			</Bay>
		</VoltageLevel>
	</Substation>
	<IED configVersion="1.0" engRight="full" manufacturer="none" originalSclRevision="B" originalSclVersion="2007" type="none" name="Test" desc="">
		<Services nameLength="64"/>
		<AccessPoint name="A" desc="">
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_A" ldName="Test_LD0_A">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="LPHD" lnType="LPHD$oscd$_828d2d9919a24175" lnInst="1"/>
				</LDevice>
				<LDevice inst="QC9_DisconnectorFunction_a1901019" ldName="Test_QC9_DisconnectorFunction_a1901019">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
		<AccessPoint name="B" desc="">
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_B" ldName="Test_LD0_B">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="LPHD" lnType="LPHD$oscd$_828d2d9919a24175" lnInst="1"/>
				</LDevice>
				<LDevice inst="QB91_DisconnectorFunction_a439f5f7" ldName="Test_QB91_DisconnectorFunction_a439f5f7">
					<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
					<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType id="ID" lnClass="LLN0">
			<DO name="NamPlt"/>
			<DO name="Beh"/>
			<DO name="Health"/>
			<DO name="Mod"/>
		</LNodeType>
		<LNodeType lnClass="LPHD" id="LPHD$oscd$_828d2d9919a24175">
			<DO name="PhyHealth" type="PhyHealth$oscd$_27e9f363eb9812fc"/>
			<DO name="PhyNam" type="PhyNam$oscd$_1b7440bbb0dea6d1"/>
			<DO name="Proxy" type="Proxy$oscd$_d915d66d9e42a575"/>
		</LNodeType>
		<LNodeType lnClass="XSWI" id="XSWI$oscd$_5114e81752706b92">
			<DO name="Beh" type="Beh$oscd$_27e9f363eb9812fc"/>
			<DO name="BlkCls" type="BlkCls$oscd$_53c7a68f14acf795"/>
			<DO name="BlkOpn" type="BlkOpn$oscd$_53c7a68f14acf795"/>
			<DO name="Loc" type="Loc$oscd$_d915d66d9e42a575"/>
			<DO name="OpCnt" type="OpCnt$oscd$_bbaa9369107884bc"/>
			<DO name="Pos" type="Pos$oscd$_98368a53c8d4eb20"/>
			<DO name="SwTyp" type="SwTyp$oscd$_27e9f363eb9812fc"/>
		</LNodeType>
		<DOType cdc="ENS" id="Beh$oscd$_27e9f363eb9812fc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_3effb084713fc1fd"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPC" id="BlkCls$oscd$_53c7a68f14acf795">
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_3effb084713fc1fd"/>
		</DOType>
		<DOType cdc="SPC" id="BlkOpn$oscd$_53c7a68f14acf795">
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_3effb084713fc1fd"/>
		</DOType>
		<DOType cdc="SPS" id="Loc$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="INS" id="OpCnt$oscd$_bbaa9369107884bc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="INT32"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="DPC" id="Pos$oscd$_98368a53c8d4eb20">
			<DA name="stVal" fc="ST" dchg="true" bType="Dbpos"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_3effb084713fc1fd"/>
		</DOType>
		<DOType cdc="ENS" id="SwTyp$oscd$_27e9f363eb9812fc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_3effb084713fc1fd"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<EnumType id="ctlModel$oscd$_3effb084713fc1fd"/>
		<DOType cdc="ENS" id="PhyHealth$oscd$_27e9f363eb9812fc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_3effb084713fc1fd"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="DPL" id="PhyNam$oscd$_1b7440bbb0dea6d1">
			<DA name="vendor" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Proxy$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<EnumType id="stVal$oscd$_3effb084713fc1fd"/>
	</DataTypeTemplates>
</SCL>
`)
}

describe('GIVEN two DIS equipments whose template assignments are swapped', () => {
	let doc: XMLDocument
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		doc = buildTestDoc()
		mockEditor = { commit: vi.fn() }

		vi.mocked(getDocumentAndEditor).mockReturnValue({
			doc,
			editor: mockEditor as unknown as XMLEditor
		})

		ssdImportStore.bayTypes = [bayType]
		ssdImportStore.conductingEquipmentTemplates = [
			templateQC9,
			templateQB91
		]

		const qc9El = findEl(doc, 'ConductingEquipment', 'uuid', QC9_UUID)
		const qb91El = findEl(doc, 'ConductingEquipment', 'uuid', QB91_UUID)

		bayStore.scdBay = Array.from(
			doc.getElementsByTagNameNS('*', 'Bay')
		)[0] as Element
		bayStore.assignedBayTypeUuid = BAY_TYPE_UUID
		bayStore.equipmentMatches = [
			{
				scdElement: qc9El,
				bayTypeEquipment: bayType.conductingEquipments[0],
				templateEquipment: templateQC9
			},
			{
				scdElement: qb91El,
				bayTypeEquipment: bayType.conductingEquipments[1],
				templateEquipment: templateQB91
			}
		]

		// Swap: -QC9 takes QB91's template, -QB91 takes QC9's template
		equipmentMatchingStore.manualMatches.set(QC9_UUID, TEMPLATE_QB91_UUID)
		equipmentMatchingStore.manualMatches.set(QB91_UUID, TEMPLATE_QC9_UUID)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('WHEN reMatchEquipment is called THEN it does not throw', () => {
		expect(() => reMatchEquipment('Q01A_')).not.toThrow()
	})

	it('WHEN reMatchEquipment is called THEN commits with the correct bay name title', () => {
		reMatchEquipment('Q01A_')
		expect(mockEditor.commit).toHaveBeenCalledWith(expect.any(Array), {
			title: 'Re-match equipment in Bay "Q01A_"'
		})
	})

	describe('WHEN reMatchEquipment is called', () => {
		let edits: unknown[]

		beforeEach(() => {
			reMatchEquipment('Q01A_')
			edits = (mockEditor.commit.mock.calls[0] as [unknown[], unknown])[0]
		})

		it("THEN -QC9 receives QB91's bayType CE uuid as templateUuid", () => {
			const qc9El = findEl(doc, 'ConductingEquipment', 'uuid', QC9_UUID)
			const update = edits.find(
				(e: any) =>
					'attributes' in e &&
					e.element === qc9El &&
					'templateUuid' in e.attributes
			) as any
			expect(update).toBeDefined()
			expect(update.attributes.templateUuid).toBe(BT_CE_QB91_UUID)
		})

		it("THEN -QC9 receives QB91's template uuid as originUuid", () => {
			const qc9El = findEl(doc, 'ConductingEquipment', 'uuid', QC9_UUID)
			const update = edits.find(
				(e: any) =>
					'attributes' in e &&
					e.element === qc9El &&
					'templateUuid' in e.attributes
			) as any
			expect(update).toBeDefined()
			expect(update.attributes.originUuid).toBe(TEMPLATE_QB91_UUID)
		})

		it("THEN -QB91 receives QC9's bayType CE uuid as templateUuid", () => {
			const qb91El = findEl(doc, 'ConductingEquipment', 'uuid', QB91_UUID)
			const update = edits.find(
				(e: any) =>
					'attributes' in e &&
					e.element === qb91El &&
					'templateUuid' in e.attributes
			) as any
			expect(update).toBeDefined()
			expect(update.attributes.templateUuid).toBe(BT_CE_QC9_UUID)
		})

		it("THEN -QB91 receives QC9's template uuid as originUuid", () => {
			const qb91El = findEl(doc, 'ConductingEquipment', 'uuid', QB91_UUID)
			const update = edits.find(
				(e: any) =>
					'attributes' in e &&
					e.element === qb91El &&
					'templateUuid' in e.attributes
			) as any
			expect(update).toBeDefined()
			expect(update.attributes.originUuid).toBe(TEMPLATE_QC9_UUID)
		})

		it('THEN a new EqFunction is inserted for each of the two CEs', () => {
			const eqFunctionInserts = edits.filter(
				(e: any) => 'parent' in e && e.node?.tagName === 'EqFunction'
			)
			expect(eqFunctionInserts).toHaveLength(2)
		})

		it('THEN the old EqFunction of -QC9 is removed', () => {
			const qc9EqFunc = findEl(
				doc,
				'EqFunction',
				'uuid',
				QC9_EQ_FUNC_UUID
			)
			const remove = edits.find(
				(e: any) =>
					!('parent' in e) && 'node' in e && e.node === qc9EqFunc
			)
			expect(remove).toBeDefined()
		})

		it('THEN the old EqFunction of -QB91 is removed', () => {
			const qb91EqFunc = findEl(
				doc,
				'EqFunction',
				'uuid',
				QB91_EQ_FUNC_UUID
			)
			const remove = edits.find(
				(e: any) =>
					!('parent' in e) && 'node' in e && e.node === qb91EqFunc
			)
			expect(remove).toBeDefined()
		})

		it('THEN the QB91 LDevice is renamed to a QC9-prefixed inst (type moved to QC9 CE)', () => {
			const qb91LDevice = findEl(
				doc,
				'LDevice',
				'inst',
				QB91_OLD_LDEVICE_INST
			)
			const rename = edits.find(
				(e: any) =>
					'attributes' in e &&
					e.element === qb91LDevice &&
					'inst' in e.attributes
			) as any
			expect(rename).toBeDefined()
			expect(rename.attributes.inst).toMatch(
				/^QC9_DisconnectorFunction_[0-9a-f]{8}$/
			)
			expect(rename.attributes.inst).not.toBe(QB91_OLD_LDEVICE_INST)
		})

		it('THEN the QC9 LDevice is renamed to a QB91-prefixed inst (type moved to QB91 CE)', () => {
			const qc9LDevice = findEl(
				doc,
				'LDevice',
				'inst',
				QC9_OLD_LDEVICE_INST
			)
			const rename = edits.find(
				(e: any) =>
					'attributes' in e &&
					e.element === qc9LDevice &&
					'inst' in e.attributes
			) as any
			expect(rename).toBeDefined()
			expect(rename.attributes.inst).toMatch(
				/^QB91_DisconnectorFunction_[0-9a-f]{8}$/
			)
			expect(rename.attributes.inst).not.toBe(QC9_OLD_LDEVICE_INST)
		})

		it('THEN the LN0 of the QC9 LDevice is NOT removed', () => {
			const qc9LDevice = findEl(
				doc,
				'LDevice',
				'inst',
				QC9_OLD_LDEVICE_INST
			)
			const ln0 = qc9LDevice.querySelector('LN0')!
			const remove = edits.find(
				(e: any) => !('parent' in e) && 'node' in e && e.node === ln0
			)
			expect(remove).toBeUndefined()
		})

		it('THEN the LN0 of the QB91 LDevice is NOT removed', () => {
			const qb91LDevice = findEl(
				doc,
				'LDevice',
				'inst',
				QB91_OLD_LDEVICE_INST
			)
			const ln0 = qb91LDevice.querySelector('LN0')!
			const remove = edits.find(
				(e: any) => !('parent' in e) && 'node' in e && e.node === ln0
			)
			expect(remove).toBeUndefined()
		})

		it('THEN new LNodes inside the inserted QC9 EqFunction carry iedName="Test"', () => {
			const qc9El = findEl(doc, 'ConductingEquipment', 'uuid', QC9_UUID)
			const eqFuncInsert = edits.find(
				(e: any) =>
					'parent' in e &&
					e.node?.tagName === 'EqFunction' &&
					e.parent === qc9El
			) as any
			expect(eqFuncInsert).toBeDefined()
			const lnodes = Array.from(
				(eqFuncInsert.node as Element).querySelectorAll('LNode')
			)
			expect(lnodes.length).toBeGreaterThan(0)
			for (const ln of lnodes) {
				expect((ln as Element).getAttribute('iedName')).toBe('Test')
			}
		})

		it('THEN new LNodes inside the inserted QB91 EqFunction carry iedName="Test"', () => {
			const qb91El = findEl(doc, 'ConductingEquipment', 'uuid', QB91_UUID)
			const eqFuncInsert = edits.find(
				(e: any) =>
					'parent' in e &&
					e.node?.tagName === 'EqFunction' &&
					e.parent === qb91El
			) as any
			expect(eqFuncInsert).toBeDefined()
			const lnodes = Array.from(
				(eqFuncInsert.node as Element).querySelectorAll('LNode')
			)
			expect(lnodes.length).toBeGreaterThan(0)
			for (const ln of lnodes) {
				expect((ln as Element).getAttribute('iedName')).toBe('Test')
			}
		})
	})
})
