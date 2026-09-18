export const sclMockC = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates" xmlns:compas="https://www.lfenergy.org/compas/extension/v1" release="4" revision="B" version="2007">
	<Private type="compas_scl">
		<compas:SclName>Prozesstest</compas:SclName>
		<compas:SclFileType>SCD</compas:SclFileType>
		<compas:Labels/>
	</Private>
	<Header id="35e5c481-6f69-46b3-bf13-1a6df2d9d045" version="2.5.0">
		<History>
			<Hitem revision="" version="1.0.0" what="SCL created" when="2026-05-05T08:55:38Z" who="Mr Editor"/>
			<Hitem revision="" version="2.0.0" what="SCL updated" when="2026-05-05T10:27:15Z" who="Mr Editor"/>
			<Hitem revision="" version="2.1.0" what="SCL updated" when="2026-05-05T10:28:35Z" who="Mr Editor"/>
			<Hitem revision="" version="2.2.0" what="SCL updated" when="2026-05-11T05:44:26Z" who="Mr Editor"/>
			<Hitem revision="" version="2.3.0" what="SCL updated" when="2026-05-11T07:24:59Z" who="Mr Editor"/>
			<Hitem revision="" version="2.4.0" what="SCL updated" when="2026-05-20T10:26:57Z" who="Mr Editor"/>
			<Hitem revision="" version="2.5.0" what="SCL updated" when="2026-05-20T14:14:31Z" who="Mr Editor"/>
		</History>
	</Header>
	<Substation desc="" name="NWHEI" sxy:x="1" sxy:y="1">
		<VoltageLevel desc="" name="C1" nomFreq="50" numPhases="3" sxy:x="1" sxy:y="1">
			<Voltage multiplier="k" unit="V">380</Voltage>
			<Bay name="BB1" sxy:x="1" sxy:y="3" sxy:dir="horizontal">
				<ConnectivityNode name="Busbar1" pathName="NWHEI/C1/BB1/Busbar1"/>
			</Bay>
			<Bay desc="KPDR_Feld" name="ReactorBay" sxy:x="1" sxy:y="7" sxy:dir="horizontal" templateUuid="92b5327c-37f8-491a-a20c-b965bb84fb6e" uuid="9aa95001-8f8a-4c66-917a-5f431502f9eb">
				<ConductingEquipment desc="Spannungswandler -BA1" name="VT1" sxy:x="1" sxy:y="19" sxy:dir="horizontal" originUuid="3ec3894e-86db-42dc-8f36-ca0324fb1859" templateUuid="f9c16bcb-fffd-4b07-bbef-52ff514c0929" type="VTR" uuid="98795d6f-6eb8-4901-bae2-4381ce7f4214" virtual="false">
					<EqFunction name="VT_MODEL" uuid="2aae0577-b863-4f70-a5d1-2affa464b992">
						<LNode iedName="MU" lnClass="TVTR" inst="1" lnType="TBW_TVTR_14baabd8b7a2" uuid="76312f3d-5ca2-41ec-9d48-f857a3bce9c1"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="4ee7b574-0e91-44ac-8d01-4d47681c29b3"/>
					</EqFunction>
					<Terminal bayName="ReactorBay" cNodeName="CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" connectivityNode="NWHEI/C1/ReactorBay/CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
				</ConductingEquipment>
				<ConductingEquipment desc="Stromwandler -BZ1" name="CT1" sxy:x="3" sxy:y="18" originUuid="a1409961-7a90-43ff-9c6a-032ee5e9b6c3" templateUuid="4495e013-e1c3-4526-8f2a-1b9fc7495322" type="CTR" uuid="cd8a0cda-6dcb-4e77-8c68-0214a636a66c" virtual="false">
					<EqFunction name="CT_MODEL" uuid="3a994edf-fc9d-42f5-8175-e1757c0fd296">
						<LNode iedName="MU" lnClass="TCTR" inst="1" lnType="TBW_TCTR_7e35cb0752d6" uuid="8db70ac6-7fe1-4f72-a8b8-73a6fda8aa0e"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="f7b291de-1b9a-4e3b-a7a2-9a08ed129878"/>
					</EqFunction>
					<Terminal bayName="ReactorBay" cNodeName="CN_48211e02-f663-4e01-9b21-7c27c95f4ec9" connectivityNode="NWHEI/C1/ReactorBay/CN_48211e02-f663-4e01-9b21-7c27c95f4ec9" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" connectivityNode="NWHEI/C1/ReactorBay/CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
				</ConductingEquipment>
				<ConductingEquipment desc="Stromwandler In -BC1" name="CT2" sxy:x="3" sxy:y="23" originUuid="a1409961-7a90-43ff-9c6a-032ee5e9b6c3" templateUuid="151d2e79-cb8d-4dc3-a4ff-4a089291d87c" type="CTR" uuid="6f8d2b8a-7f0f-46de-9d7c-1b3f4f7e92a1" virtual="false">
					<EqFunction name="CT_MODEL" uuid="0a58c143-0805-4921-96b9-e39fe56af1a5">
						<LNode iedName="MU" lnClass="TCTR" inst="1" lnType="TBW_TCTR_7e35cb0752d6" uuid="c9db3618-16c9-4909-ad41-36633ba94d8a"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="312d79e3-5b65-4ce0-861e-e06c2f05d00b"/>
					</EqFunction>
					<Terminal bayName="ReactorBay" cNodeName="CN_dae0598f-dc05-4909-a8a3-e6e5e10506gb" connectivityNode="NWHEI/C1/ReactorBay/CN_dae0598f-dc05-4909-a8a3-e6e5e10506gb" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="grounded" connectivityNode="NWHEI/C1/ReactorBay/grounded" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
				</ConductingEquipment>
				<ConductingEquipment desc="Kompensations-Drossel_Reactor -RA401" name="REA1" sxy:x="3" sxy:y="20" originUuid="9a485815-9809-405e-babf-178b1e0b0bc1" templateUuid="e3b74891-4670-4af9-ac46-53731fa4e7fe" type="REA" uuid="a4d2ab05-ee7d-4c86-9438-9812e6bf0594" virtual="false">
					<EqFunction name="REA_MODEL" uuid="8c25d508-c40e-4b94-87e9-7c26880df059">
						<LNode iedName="MU" lnClass="ZREA" inst="1" lnType="TBW_ZREA_aed71776a944" uuid="d4373816-b62f-4ace-924f-35e3b90fe64b"/>
						<LNode iedName="MU" lnClass="SIML" inst="2" lnType="TBW_SIML_251374eedc1d" uuid="9a557245-a1cc-4ef7-beba-b1daabc38142"/>
					</EqFunction>
					<EqFunction name="REA_PROT" uuid="29da0fdf-d7bb-4fbf-bb13-f7ed8afcfccc">
						<LNode iedName="BPU" lnClass="PDIF" inst="1" lnType="TBW_PDIF_c2a85b9ba26f" uuid="41821af4-77a0-4053-ab09-57f8d0c69df8"/>
						<LNode iedName="BPU" lnClass="PSOF" inst="1" lnType="TBW_PSOF_d6b3d79c4312" uuid="67f6a5ff-b93f-4cbd-b5ed-733331318220"/>
						<LNode iedName="BPU" lnClass="PTOC" inst="1" lnType="TBW_PTOC_9fc54f271916" uuid="ce151a4b-22e1-4746-a2b8-4c0ad16d4940"/>
						<LNode iedName="BPU" lnClass="PTOV" inst="1" lnType="TBW_PTOV_0b0a99740f7f" uuid="6fbb2e8b-13ae-4189-a949-b79f822bd859"/>
						<LNode iedName="BPU" lnClass="PTRC" inst="1" lnType="TBW_PTRC_a1a9c2bac1fa" uuid="45262b93-7963-46a9-8378-8085903c4af0"/>
						<LNode iedName="BPU" lnClass="RBRF" inst="1" lnType="TBW_RBRF_90305cb8e3a6" uuid="8e1db7a7-02e7-4a06-9a63-fce8e8a5af2b"/>
					</EqFunction>
					<EqFunction name="EQ_Monitoring" uuid="bdb9e66c-6678-4f43-9bf4-4650c5d40c7e">
						<LNode iedName="MU" lnClass="STMP" inst="1" lnType="TBW_STMP_76806ed5f9c1" uuid="17a3bed9-b29f-4542-abc3-250394ce1cdb"/>
					</EqFunction>
					<EqFunction name="TC_MODEL" uuid="67c21a3e-f83a-40b5-9cca-0a4ce345cba9">
						<LNode iedName="MU" lnClass="YLTC" inst="1" lnType="TBW_YLTC_064e78e92bce" uuid="09fd3ba0-a849-44a4-beb2-ace58dd1186e"/>
						<LNode iedName="MU" lnClass="SIML" inst="1" lnType="TBW_SIML_251374eedc1d" uuid="a9187430-63b7-40dd-bd2e-eca8be332df5"/>
					</EqFunction>
					<EqFunction name="TC_CTRL" uuid="d80d9d1b-f063-4300-ad90-fd7e9f7c7210">
						<LNode iedName="BCU" lnClass="ATCC" inst="1" lnType="TBW_ATCC_ad52a337ebd6" uuid="f9f4b6cd-7d08-499d-ab7e-ebe951b07532"/>
					</EqFunction>
					<Terminal bayName="ReactorBay" cNodeName="CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" connectivityNode="NWHEI/C1/ReactorBay/CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="CN_dae0598f-dc05-4909-a8a3-e6e5e10506gb" connectivityNode="NWHEI/C1/ReactorBay/CN_dae0598f-dc05-4909-a8a3-e6e5e10506gb" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
				</ConductingEquipment>
				<ConductingEquipment desc="Erder -QC9" name="ES4" sxy:x="5" sxy:y="1" sxy:dir="horizontal" originUuid="f5a274c2-579e-49e8-8560-4f6047166311" templateUuid="d54f4302-4f03-4b9f-a336-a4cfd23e6e5a" type="DIS" uuid="10051010-8242-4b90-8c52-f66a01846091" virtual="false">
					<Terminal bayName="ReactorBay" cNodeName="grounded" connectivityNode="NWHEI/C1/ReactorBay/grounded" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="Busbar1" connectivityNode="NWHEI/C1/BB1/Busbar1" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
					<EqFunction name="DIS_ES_MODEL" uuid="caa04c76-caa1-40a0-89ba-9a351a79c602">
						<LNode iedName="MU" lnClass="XSWI" inst="1" lnType="TBW_XSWI_31b52c8cc41a" uuid="4eac01cd-eace-4ae3-b1b1-fb967a4dd69d"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="8f635642-bd4e-45a9-b746-e2e02a4d10e0"/>
					</EqFunction>
					<EqFunction name="DIS_ES_CTRL" uuid="b464f108-d5ea-4601-bee3-1ba1bec21658">
						<LNode iedName="BCU" lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d" uuid="9ab624e2-0350-4da1-970a-68ae7a6fe1ae"/>
						<LNode iedName="BCU" lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca" uuid="5ac58696-1a4b-49a0-8067-c52eb5d89145"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment desc="Erder -QC1" name="ES3" sxy:x="5" sxy:y="6" sxy:dir="horizontal" originUuid="f5a274c2-579e-49e8-8560-4f6047166311" templateUuid="00733930-c736-45e3-ac03-a94876c8db64" type="DIS" uuid="ed987f32-5b69-4ca7-b0c0-b06ef6a35321" virtual="false">
					<Terminal bayName="ReactorBay" cNodeName="grounded" connectivityNode="NWHEI/C1/ReactorBay/grounded" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="CN_42839720-5b13-4227-843e-5c417f253b78" connectivityNode="NWHEI/C1/ReactorBay/CN_42839720-5b13-4227-843e-5c417f253b78" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
					<EqFunction name="DIS_ES_MODEL" uuid="6cb3c2d4-fc79-40c5-bdfd-35bd9f0965ac">
						<LNode iedName="MU" lnClass="XSWI" inst="1" lnType="TBW_XSWI_31b52c8cc41a" uuid="e2feafe5-9d27-46fb-b5f4-f2bb7384ea83"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="5db48a20-f957-433f-99f5-3aa378efc4a2"/>
					</EqFunction>
					<EqFunction name="DIS_ES_CTRL" uuid="f252466d-3138-42b8-b3e1-e19796f680ef">
						<LNode iedName="BCU" lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d" uuid="39d7f6f8-c294-43a9-8525-7fbbc13fcecf"/>
						<LNode iedName="BCU" lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca" uuid="873b3458-08e6-4c53-8f09-4e800a084f71"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment desc="Erder -QC2" name="ES2" sxy:x="5" sxy:y="11" sxy:dir="horizontal" originUuid="f5a274c2-579e-49e8-8560-4f6047166311" templateUuid="ad8d3fe3-16c4-4878-81b4-a174a8910505" type="DIS" uuid="4d5986e7-ab81-4371-bf49-0ed47b295098" virtual="false">
					<Terminal bayName="ReactorBay" cNodeName="grounded" connectivityNode="NWHEI/C1/ReactorBay/grounded" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48" connectivityNode="NWHEI/C1/ReactorBay/CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
					<EqFunction name="DIS_ES_MODEL" uuid="e6e6b54c-8e00-42d4-92c5-1198c1a83e05">
						<LNode iedName="MU" lnClass="XSWI" inst="1" lnType="TBW_XSWI_31b52c8cc41a" uuid="1cd2846e-59fe-493c-afe6-7bf07cb48c67"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="c57c4ad7-f8cd-4bdb-8395-68f3640d9ddd"/>
					</EqFunction>
					<EqFunction name="DIS_ES_CTRL" uuid="00d82c7f-6e10-48b5-aacc-65774f288c9b">
						<LNode iedName="BCU" lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d" uuid="0cf1a752-1842-45cb-b3ee-6639668b3349"/>
						<LNode iedName="BCU" lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca" uuid="06bc0ddb-2186-43a0-8949-c8494bd84917"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment desc="Erder -QC3" name="ES1" sxy:x="5" sxy:y="15" sxy:dir="horizontal" originUuid="f5a274c2-579e-49e8-8560-4f6047166311" templateUuid="5f808815-7ce2-4a42-ac09-80309dbb7d37" type="DIS" uuid="e8f20dea-0007-41a5-a7bf-1f363986eed2" virtual="false">
					<Terminal bayName="ReactorBay" cNodeName="grounded" connectivityNode="NWHEI/C1/ReactorBay/grounded" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="CN_48211e02-f663-4e01-9b21-7c27c95f4ec9" connectivityNode="NWHEI/C1/ReactorBay/CN_48211e02-f663-4e01-9b21-7c27c95f4ec9" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
					<EqFunction name="DIS_ES_MODEL" uuid="b37473d9-aeea-40de-b1eb-39ac710ffe7e">
						<LNode iedName="MU" lnClass="XSWI" inst="1" lnType="TBW_XSWI_31b52c8cc41a" uuid="c83482b4-3f11-47eb-8975-85018b11f142"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="4ee46988-18df-45ef-b957-0e95364c68a0"/>
					</EqFunction>
					<EqFunction name="DIS_ES_CTRL" uuid="af5cad60-75c5-4def-a527-adf283815699">
						<LNode iedName="BCU" lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d" uuid="006f6b7a-0a3c-40cc-a3e5-5e9fbc39baee"/>
						<LNode iedName="BCU" lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca" uuid="7915caa8-b3b7-4ac6-a264-f05a9173b95d"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment desc="Trenner -QB9" name="DIS2" sxy:x="3" sxy:y="3" originUuid="eaea4c65-37fe-40c8-913d-7359ac5d52ef" templateUuid="32d498a8-90c9-403d-9353-36223caa8911" type="DIS" uuid="881232dc-1631-42ee-bdd3-d25e48f49da2" virtual="false">
					<EqFunction name="DIS_ES_MODEL" uuid="ce3262a3-a39f-4ac0-a973-d36dc832199f">
						<LNode iedName="MU" lnClass="XSWI" inst="1" lnType="TBW_XSWI_31b52c8cc41a" uuid="c97a8dca-d2c7-4a32-be3d-f9192c584ca9"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="bcecfaf0-8f23-4636-996f-9454df24e692"/>
					</EqFunction>
					<EqFunction name="DIS_ES_CTRL" uuid="4cc95a4c-c6ae-4386-aede-30bebd206568">
						<LNode iedName="BCU" lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d" uuid="a6ba13d1-dc44-470a-97cb-86475ff064b1"/>
						<LNode iedName="BCU" lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca" uuid="8eda7e2d-a111-4d31-b4ea-4073f6d499c7"/>
					</EqFunction>
					<Terminal bayName="ReactorBay" cNodeName="CN_42839720-5b13-4227-843e-5c417f253b78" connectivityNode="NWHEI/C1/ReactorBay/CN_42839720-5b13-4227-843e-5c417f253b78" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="Busbar1" connectivityNode="NWHEI/C1/BB1/Busbar1" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
				</ConductingEquipment>
				<ConductingEquipment desc="Trenner -QB1" name="DIS1" sxy:x="3" sxy:y="13" originUuid="eaea4c65-37fe-40c8-913d-7359ac5d52ef" templateUuid="fd08c129-73e9-4732-89f5-a0d940cfaf3a" type="DIS" uuid="e04d0ea8-fc3b-48a8-8e48-63d4a2bbb5c2" virtual="false">
					<EqFunction name="DIS_ES_MODEL" uuid="55bf6ae4-7a41-4c86-9234-d87f5782a8b6">
						<LNode iedName="MU" lnClass="XSWI" inst="1" lnType="TBW_XSWI_31b52c8cc41a" uuid="c3ff683b-aeed-4c31-b78a-dd2c71dc289d"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="0dd1d69f-3868-4d43-8702-61a594b5677e"/>
					</EqFunction>
					<EqFunction name="DIS_ES_CTRL" uuid="87c01b1a-3600-4d7d-a062-a54e051fe699">
						<LNode iedName="BCU" lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d" uuid="534b38ea-733e-4a63-94c9-3650ae18c0b6"/>
						<LNode iedName="BCU" lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca" uuid="b3df6cce-66b3-4505-9df5-7aa8bd8c8c6b"/>
					</EqFunction>
					<Terminal bayName="ReactorBay" cNodeName="CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48" connectivityNode="NWHEI/C1/ReactorBay/CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="CN_48211e02-f663-4e01-9b21-7c27c95f4ec9" connectivityNode="NWHEI/C1/ReactorBay/CN_48211e02-f663-4e01-9b21-7c27c95f4ec9" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
				</ConductingEquipment>
				<ConductingEquipment desc="Leistungsschalter -QA1" name="CB1" sxy:x="3" sxy:y="9" originUuid="aa428902-d979-4923-b26b-e0c9dc3a38a7" templateUuid="edb3c53b-26c0-49ed-ac63-86fc414d4320" type="CBR" uuid="75550f20-a584-4679-b8f8-1e75b31d314c" virtual="false">
					<EqFunction name="CB_MODEL" uuid="6c07741f-501c-4830-b9ef-ce97b45b3dbf">
						<LNode iedName="MU" lnClass="XCBR" inst="1" lnType="TBW_XCBR_89c0f0517734" uuid="1d23fb91-a853-4b61-8ac8-47f89199c6a2"/>
						<LNode iedName="MU" lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b" uuid="8fbe343b-3372-430d-8f26-b304ae785f85"/>
						<LNode iedName="MU" lnClass="SOPM" inst="1" lnType="TBW_SOPM_1b63f9611c7c" uuid="1794ec94-f1b7-4582-a63e-6d9c2fbdb298"/>
					</EqFunction>
					<EqFunction name="CB_CTRL" uuid="10bc7beb-dd17-4fef-adb0-5edcfb065cd8">
						<LNode iedName="BCU" lnClass="CILO" inst="1" lnType="TBW_CILO_eba5115e8513" uuid="7e63f0f3-0a15-4def-abda-d2e31f1139bc"/>
						<LNode iedName="BCU" lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca" uuid="78012f83-f303-493d-bd8a-2a36f49009a1"/>
					</EqFunction>
					<Terminal bayName="ReactorBay" cNodeName="CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48" connectivityNode="NWHEI/C1/ReactorBay/CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48" name="T1" substationName="NWHEI" voltageLevelName="C1"/>
					<Terminal bayName="ReactorBay" cNodeName="CN_42839720-5b13-4227-843e-5c417f253b78" connectivityNode="NWHEI/C1/ReactorBay/CN_42839720-5b13-4227-843e-5c417f253b78" name="T2" substationName="NWHEI" voltageLevelName="C1"/>
				</ConductingEquipment>
				<Function desc="Spannungsmessung" name="VT_MEAS" originUuid="5d97a4a4-566b-46db-9a18-b8fcc0c63ff3" templateUuid="8001118b-1f76-4934-b637-263840a875aa" uuid="fbb43e0e-ae29-4db7-898b-6fcebfb0f244">
					<LNode iedName="MU" lnClass="MMXU" inst="1" lnType="TBW_MMXU_94806b6365f6" uuid="3be6d130-3f86-46c6-8d98-119156132de8"/>
				</Function>
				<Function desc="Strommessung" name="CT_MEAS" originUuid="e6dcca3b-1ca2-43e4-b063-9dfa1a3a25ff" templateUuid="6e4a7de2-08c0-4a07-a5cb-7133a3213603" uuid="32464857-af12-433f-a680-4369cde01cd9">
					<LNode iedName="MU" lnClass="MMXU" inst="1" lnType="TBW_MMXU_94806b6365f6" uuid="0c162ea3-e847-4d6d-8713-4ae1d71e5caa"/>
				</Function>
				<Function desc="Verarbeitung von Sammelmeldungen" name="Alarmhandling" originUuid="3eb58e7a-cf0c-4790-8173-6d92904065b0" templateUuid="ef517aa4-47fc-4de6-9eed-052515acf9cf" uuid="d212ea6a-db09-4f0b-8640-aa879ebeaabc">
					<LNode iedName="BCU" lnClass="CALH" inst="1" lnType="TBW_CALH_ae9e11b4a62c" uuid="3aa99170-a7ed-4b73-8540-cc9501e321ab"/>
				</Function>
				<ConnectivityNode name="grounded" pathName="NWHEI/C1/ReactorBay/grounded"/>
				<ConnectivityNode name="Busbar1" pathName="NWHEI/C1/BB1/Busbar1"/>
				<ConnectivityNode name="CN_42839720-5b13-4227-843e-5c417f253b78" pathName="NWHEI/C1/ReactorBay/CN_42839720-5b13-4227-843e-5c417f253b78"/>
				<ConnectivityNode name="CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48" pathName="NWHEI/C1/ReactorBay/CN_d8cbf2cf-f8b9-485b-be59-2d2058c07f48"/>
				<ConnectivityNode name="CN_48211e02-f663-4e01-9b21-7c27c95f4ec9" pathName="NWHEI/C1/ReactorBay/CN_48211e02-f663-4e01-9b21-7c27c95f4ec9"/>
				<ConnectivityNode name="CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" pathName="NWHEI/C1/ReactorBay/CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa"/>
				<ConnectivityNode name="CN_ce62e64e-ee8b-4df6-8d51-703c0b40f367" pathName="NWHEI/C1/ReactorBay/CN_ce62e64e-ee8b-4df6-8d51-703c0b40f367"/>
				<ConnectivityNode name="CN_b9441669-9971-4ec3-9ead-cfdbafb4d920" pathName="NWHEI/C1/ReactorBay/CN_b9441669-9971-4ec3-9ead-cfdbafb4d920"/>
				<ConnectivityNode name="CN_dae0598f-dc05-4909-a8a3-e6e5e10506gb" pathName="NWHEI/C1/ReactorBay/CN_dae0598f-dc05-4909-a8a3-e6e5e10506gb"/>
			</Bay>
		</VoltageLevel>
	</Substation>
	<Private masterTemplate="false" type="AUTO_DOC">
		<DocumentTemplate date="2026-05-11T07:23:31.204Z" description="Template für den Prozesstest" id="83739d25-b8b3-42e5-aaa7-79af5f98ecd8" title="Testtemplate">
			<Block id="0b6478a2-5ed3-4e61-a5bd-ce7ba7286ae2" type="text">&lt;p&gt;Test1&lt;/p&gt;</Block>
			<Block id="0f82a147-ac26-46ee-9036-d4bc0c21acac" type="text">&lt;p&gt;Test2&lt;/p&gt;</Block>
			<Block id="92468874-d925-4a91-ab85-f71ebfdd92ef" type="table">[["asd","asdas"],["asd","dgdr"],["htjff","nfgnf"],["gnnfg","ffgn"]]</Block>
		</DocumentTemplate>
	</Private>
	<Communication>
		<SubNetwork name="PB" desc="" type="8-MMS">
			<BitRate unit="b/s" multiplier="M">100</BitRate>
			<ConnectedAP iedName="HMI" apName="AP2"/>
			<ConnectedAP iedName="MU" apName="AP2">
				<Address>
					<P type="IP">10.101.1.82</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
				<GSE cbName="GOOSE_Pos_Alm" ldInst="LD0_AP1">
					<MinTime unit="s" multiplier="m">10</MinTime>
					<MaxTime unit="s" multiplier="m">10000</MaxTime>
				</GSE>
				<SMV cbName="MSVCB01" ldInst="LD0_AP1">
					<Address>
						<P type="MAC-Address">01-0C-CD-04-00-00</P>
						<P type="APPID">4000</P>
						<P type="VLAN-ID">000</P>
						<P type="VLAN-PRIORITY">4</P>
					</Address>
				</SMV>
			</ConnectedAP>
			<ConnectedAP iedName="BPU" apName="AP2">
				<Address>
					<P type="IP">10.101.1.62</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
				<GSE ldInst="LD0_AP1" cbName="GOOSE_Trip">
					<MinTime unit="s" multiplier="m">10</MinTime>
					<MaxTime unit="s" multiplier="m">10000</MaxTime>
				</GSE>
			</ConnectedAP>
			<ConnectedAP iedName="BCU" apName="AP2">
				<Address>
					<P type="IP">10.101.1.42</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
				<GSE ldInst="LD0_AP1" cbName="GOOSE_Control">
					<MinTime unit="s" multiplier="m">10</MinTime>
					<MaxTime unit="s" multiplier="m">10000</MaxTime>
				</GSE>
			</ConnectedAP>
		</SubNetwork>
		<SubNetwork name="SB" desc="" type="8-MMS">
			<BitRate unit="b/s" multiplier="M">100</BitRate>
			<ConnectedAP iedName="HMI" apName="AP1"/>
			<ConnectedAP iedName="MU" apName="AP1">
				<Address>
					<P type="IP">10.1.1.82</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
			</ConnectedAP>
			<ConnectedAP iedName="BPU" apName="AP1">
				<Address>
					<P type="IP">10.1.1.62</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
			</ConnectedAP>
			<ConnectedAP iedName="BCU" apName="AP1">
				<Address>
					<P type="IP">10.1.1.42</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
			</ConnectedAP>
		</SubNetwork>
	</Communication>
	<IED configVersion="1.0" desc="KPDR Merging Unit" engRight="full" manufacturer="none" name="MU" originalSclRevision="B" originalSclVersion="2007" type="none">
		<Services nameLength="64">
<DynAssociation max="5"/>
<SettingGroups>
<SGEdit/>
<ConfSG/>
</SettingGroups>
<GetDirectory/>
<GetDataObjectDefinition/>
<DataObjectDirectory/>
<GetDataSetValue/>
<DataSetDirectory/>
<ConfDataSet max="20" maxAttributes="80"/>
<ReadWrite/>
<ConfReportControl max="80" bufMode="both" bufConf="true"/>
<GetCBValues/>
<ReportSettings cbName="Conf" datSet="Conf" optFields="Dyn" bufTime="Dyn" trgOps="Dyn" intgPd="Dyn"/>
<GSESettings cbName="Conf" datSet="Conf" appID="Conf"/>
<SMVSettings>
<SmpRate>80</SmpRate>
</SMVSettings>
<GOOSE max="4"/>
<SMVsc max="1"/>
<FileHandling ftp="true" ftps="true"/>
<ConfLNs fixPrefix="true" fixLnInst="true"/>
<ClientServices goose="true" sv="true">
<TimeSyncProt c37_238="true"/>
</ClientServices>
<RedProt hsr="true" prp="true"/>
<CommProt/>
</Services>
		<AccessPoint desc="SB" name="AP1">
				    <Services nameLength="64">
<DynAssociation max="5"/>
<SettingGroups>
<SGEdit/>
<ConfSG/>
</SettingGroups>
<GetDirectory/>
<GetDataObjectDefinition/>
<DataObjectDirectory/>
<GetDataSetValue/>
<DataSetDirectory/>
<ConfDataSet max="20" maxAttributes="80"/>
<ReadWrite/>
<ConfReportControl max="80" bufMode="both" bufConf="true"/>
<GetCBValues/>
<ReportSettings cbName="Conf" datSet="Conf" optFields="Dyn" bufTime="Dyn" trgOps="Dyn" intgPd="Dyn"/>
<GSESettings cbName="Conf" datSet="Conf" appID="Conf"/>
<SMVSettings>
<SmpRate>80</SmpRate>
</SMVSettings>
<GOOSE max="4"/>
<SMVsc max="1"/>
<FileHandling ftp="true" ftps="true"/>
<ConfLNs fixPrefix="true" fixLnInst="true"/>
<ClientServices goose="true" sv="true">
<TimeSyncProt c37_238="true"/>
</ClientServices>
<RedProt hsr="true" prp="true"/>
<CommProt/>
</Services>
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_AP1" ldName="MU_LD0_AP1">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf">
						<DataSet name="LD0 Dataset">
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="ChLiv" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="ChLiv" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="RedChLiv" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="RedChLiv" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="OpTmh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="OpTmh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrSupAlm" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrSupAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="Sim" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="Sim" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="WacTrg" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="WacTrg" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSrc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSrc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSynLkd" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSynLkd" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSyn" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSyn" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="stVal" fc="ST"/>
						</DataSet>
						<DataSet name="Pos_Alm_Dataset" desc="Dataset mit allen Alarmen und Positionsdaten">
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="SIMG" lnInst="1" doName="InsAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="SIMG" lnInst="1" doName="InsAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="Pos" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="Pos" daName="opOk" fc="OR"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="Pos" daName="opRcvd" fc="OR"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="BlkCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="BlkCls" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="BlkOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="XCBR" lnInst="1" doName="BlkOpn" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opOk" fc="OR"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opRcvd" fc="OR"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opOk" fc="OR"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opRcvd" fc="OR"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opOk" fc="OR"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opRcvd" fc="OR"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="XSWI" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opOk" fc="OR"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="XSWI" lnInst="1" doName="Pos" daName="opRcvd" fc="OR"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="InsAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="InsAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="GasInsAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="GasInsAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="MstAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="MstAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="TmpAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="SIML" lnInst="2" doName="TmpAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="ZREA" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="ZREA" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="GasInsAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="GasInsAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="InsAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="InsAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="MstAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="MstAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="TmpAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="SIML" lnInst="1" doName="TmpAlm" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="Loc" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="Loc" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="TapPos" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="TapPos" daName="opOk" fc="OR"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="TapPos" daName="opRcvd" fc="OR"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="YLTC" lnInst="1" doName="TapPos" daName="valWTr.posVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="DenAlm" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="DenAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="InsAlm" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="InsAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="TVTR" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="TVTR" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="TVTR" lnInst="1" doName="FuFail" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="TVTR" lnInst="1" doName="FuFail" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="SIMG" lnInst="1" doName="DenAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="SIMG" lnInst="1" doName="DenAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="TCTR" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="TCTR" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="SIMG" lnInst="1" doName="DenAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="SIMG" lnInst="1" doName="DenAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="SIMG" lnInst="1" doName="PresAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="q" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="SIMG" lnInst="1" doName="TmpAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="TCTR" lnInst="1" doName="EEHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="TCTR" lnInst="1" doName="EEHealth" daName="q" fc="ST"/>
						</DataSet>
						<DataSet name="MEAS_Dataset" desc="Dataset für Strom- und Spannungsmessung">
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="q" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="t" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="units.SIUnit" fc="CF"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsB" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsB" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsB" daName="q" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsB" daName="t" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsB" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsB" daName="units.SIUnit" fc="CF"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsC" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsC" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsC" daName="q" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsC" daName="t" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsC" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.phsC" daName="units.SIUnit" fc="CF"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.neut" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.neut" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.neut" daName="q" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.neut" daName="t" fc="MX"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.neut" daName="units.SIUnit" fc="CF"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="MMXU" lnInst="1" doName="PhV.neut" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.neut" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.neut" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.neut" daName="q" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.neut" daName="t" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.neut" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.neut" daName="units.SIUnit" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsA" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsA" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsA" daName="q" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsA" daName="t" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsA" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsA" daName="units.SIUnit" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsB" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsB" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsB" daName="q" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsB" daName="t" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsB" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsB" daName="units.SIUnit" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsC" daName="cVal.ang.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsC" daName="cVal.mag.f" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsC" daName="q" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsC" daName="t" fc="MX"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsC" daName="units.multiplier" fc="CF"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="MMXU" lnInst="1" doName="A.phsC" daName="units.SIUnit" fc="CF"/>
						</DataSet>
						<DataSet name="Beh_Health_Mod_Dataset" desc="Behaviour, Health und Mod aller LDs">
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_MODEL_6c07741f" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT_MEAS_32464857" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="CT1_CT_MODEL_3a994edf" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="CT2_CT_MODEL_0a58c143" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_MODEL_ce3262a3" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_MODEL_b37473d9" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_MODEL_e6e6b54c" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_MODEL_caa04c76" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_EQ_Monitoring_26b28de3" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_EQ_Monitoring_26b28de3" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_EQ_Monitoring_26b28de3" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_EQ_Monitoring_26b28de3" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_EQ_Monitoring_26b28de3" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_EQ_Monitoring_26b28de3" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_MODEL_8c25d508" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_MODEL_dde13964" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="VT_MEAS_fbb43e0e" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="VT1_VT_MODEL_2aae0577" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
						</DataSet>
						<ReportControl name="RCB_Meas" buffered="true" rptID="RID_Meas" bufTime="100" confRev="1" datSet="MEAS_Dataset">
							       <TrgOps dchg="true" dupd="false" gi="true" period="false" qchg="true"/>
								<OptFields bufOvfl="true" configRef="true" dataRef="false" dataSet="true" entryID="false" reasonCode="false" seqNum="true" timeStamp="true"/>
							<RptEnabled max="1">
								<ClientLN iedName="HMI" apRef="AP1" ldInst="LD0_AP1" prefix="" lnClass="LLN0" lnInst=""/>
							</RptEnabled>
						</ReportControl>
						<ReportControl name="RCB_Pos_Alm" buffered="true" rptID="RID_Pos_Alm" bufTime="100" confRev="1" datSet="Pos_Alm_Dataset">
							<RptEnabled max="1">
							</RptEnabled>
						</ReportControl>
						<ReportControl name="RCB_Beh_Health_Mod" buffered="true" rptID="RID_Beh_Health_Mod" bufTime="100" confRev="1" datSet="Beh_Health_Mod_Dataset">
							<RptEnabled max="1">
								<ClientLN iedName="HMI" apRef="AP1" ldInst="LD0_AP1" prefix="" lnClass="LLN0" lnInst=""/>
							</RptEnabled>
						</ReportControl>
						<ReportControl name="RCB_LD0" buffered="true" rptID="RID_LD0" bufTime="100" confRev="1" datSet="LD0 Dataset">
							<RptEnabled max="1">
							</RptEnabled>
						</ReportControl>
						<Inputs>
							<ExtRef iedName="BPU" serviceType="GOOSE" ldInst="REA1_REA_PROT_dcb072e2" lnClass="PTRC" lnInst="1" prefix="" doName="Op" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Trip"/>
							<ExtRef iedName="BPU" serviceType="GOOSE" ldInst="REA1_REA_PROT_dcb072e2" lnClass="PTRC" lnInst="1" prefix="" doName="Op" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Trip"/>
							<ExtRef iedName="BPU" serviceType="GOOSE" ldInst="REA1_REA_PROT_dcb072e2" lnClass="PTRC" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Trip"/>
							<ExtRef iedName="BPU" serviceType="GOOSE" ldInst="REA1_REA_PROT_dcb072e2" lnClass="PTRC" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Trip"/>
							<ExtRef iedName="BPU" serviceType="GOOSE" ldInst="REA1_REA_PROT_dcb072e2" lnClass="PTRC" lnInst="1" prefix="" doName="Tr" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Trip"/>
							<ExtRef iedName="BPU" serviceType="GOOSE" ldInst="REA1_REA_PROT_dcb072e2" lnClass="PTRC" lnInst="1" prefix="" doName="Tr" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Trip"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="CB1_CB_CTRL_417acb5a" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_CTRL_73b14b2b" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES1_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES2_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES3_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="general" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="OpOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="ES4_DIS_ES_CTRL_302785d8" lnClass="CSWI" lnInst="1" prefix="" doName="SelOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="REA1_TC_CTRL_79ce9369" lnClass="ATCC" lnInst="1" prefix="" doName="Beh" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="REA1_TC_CTRL_79ce9369" lnClass="ATCC" lnInst="1" prefix="" doName="Beh" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="REA1_TC_CTRL_79ce9369" lnClass="ATCC" lnInst="1" prefix="" doName="TapChg" daName="valWTr.posVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
							<ExtRef iedName="BCU" serviceType="GOOSE" ldInst="REA1_TC_CTRL_79ce9369" lnClass="ATCC" lnInst="1" prefix="" doName="TapChg" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Control"/>
						</Inputs>
						<GSEControl name="GOOSE_Pos_Alm" confRev="20001" type="GOOSE" appID="MU/LD0_AP1/LLN0/GSECB_Pos_Alm" desc="GOOSE mit allen Alarmen und Positionsdaten" datSet="Pos_Alm_Dataset"/>
						<SampledValueControl desc="SMV Control Block" datSet="MEAS_Dataset" name="MSVCB01" confRev="10000" multicast="true" nofASDU="1" smpMod="SmpPerPeriod" smpRate="80" smvID="Meas_SVCB"/>
					</LN0>
				</LDevice>
				<LDevice inst="CB1_CB_MODEL_6c07741f" ldName="MU_CB1_CB_MODEL_6c07741f">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="XCBR" inst="1" lnType="TBW_XCBR_89c0f0517734"/>
					<LN lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b"/>
					<LN lnClass="SOPM" inst="1" lnType="TBW_SOPM_1b63f9611c7c"/>
				</LDevice>
				<LDevice inst="REA1_REA_MODEL_8c25d508" ldName="MU_REA1_REA_MODEL_8c25d508">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="ZREA" inst="1" lnType="TBW_ZREA_aed71776a944"/>
					<LN lnClass="SIML" inst="2" lnType="TBW_SIML_251374eedc1d"/>
				</LDevice>
				<LDevice inst="CT1_CT_MODEL_3a994edf" ldName="MU_CT1_CT_MODEL_3a994edf">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="TCTR" inst="1" lnType="TBW_TCTR_7e35cb0752d6"/>
					<LN lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b"/>
				</LDevice>
				<LDevice inst="CT2_CT_MODEL_0a58c143" ldName="MU_CT2_CT_MODEL_0a58c143">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="TCTR" inst="1" lnType="TBW_TCTR_7e35cb0752d6"/>
					<LN lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b"/>
				</LDevice>
				<LDevice inst="REA1_TC_MODEL_dde13964" ldName="MU_REA1_TC_MODEL_dde13964">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="YLTC" inst="1" lnType="TBW_YLTC_064e78e92bce"/>
					<LN lnClass="SIML" inst="1" lnType="TBW_SIML_251374eedc1d"/>
				</LDevice>
				<LDevice inst="VT_MEAS_fbb43e0e" ldName="MU_VT_MEAS_fbb43e0e">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="MMXU" inst="1" lnType="TBW_MMXU_94806b6365f6"/>
				</LDevice>
				<LDevice inst="CT_MEAS_32464857" ldName="MU_CT_MEAS_32464857">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="MMXU" inst="1" lnType="TBW_MMXU_94806b6365f6"/>
				</LDevice>
				<LDevice inst="REA1_EQ_Monitoring_26b28de3" ldName="MU_REA1_EQ_Monitoring_26b28de3">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="STMP" inst="1" lnType="TBW_STMP_76806ed5f9c1"/>
				</LDevice>
				<LDevice inst="VT1_VT_MODEL_2aae0577" ldName="MU_VT1_VT_MODEL_2aae0577">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="TVTR" inst="1" lnType="TBW_TVTR_14baabd8b7a2"/>
					<LN lnClass="SIMG" inst="1" lnType="TBW_SIMG_03d5dbd3d69b"/>
				</LDevice>
				<LDevice inst="DIS2_DIS_ES_MODEL_ce3262a3" ldName="MU_DIS2_DIS_ES_MODEL_ce3262a3">
					<LN0 lnClass="LLN0" lnType="TBW_LLN0_fc0f9e3b54bf" inst=""/>
					<LN lnClass="XSWI" lnType="TBW_XSWI_31b52c8cc41a" inst="1"/>
				</LDevice>
				<LDevice inst="DIS1_DIS_ES_MODEL_55bf6ae4" ldName="MU_DIS1_DIS_ES_MODEL_55bf6ae4">
					<LN0 lnClass="LLN0" lnType="TBW_LLN0_fc0f9e3b54bf" inst=""/>
					<LN lnClass="XSWI" lnType="TBW_XSWI_31b52c8cc41a" inst="1"/>
				</LDevice>
				<LDevice inst="ES4_DIS_ES_MODEL_caa04c76" ldName="MU_ES4_DIS_ES_MODEL_caa04c76">
					<LN0 lnClass="LLN0" lnType="TBW_LLN0_fc0f9e3b54bf" inst=""/>
					<LN lnClass="XSWI" lnType="TBW_XSWI_31b52c8cc41a" inst="1"/>
				</LDevice>
				<LDevice inst="ES3_DIS_ES_MODEL_6cb3c2d4" ldName="MU_ES3_DIS_ES_MODEL_6cb3c2d4">
					<LN0 lnClass="LLN0" lnType="TBW_LLN0_fc0f9e3b54bf" inst=""/>
					<LN lnClass="XSWI" lnType="TBW_XSWI_31b52c8cc41a" inst="1"/>
				</LDevice>
				<LDevice inst="ES2_DIS_ES_MODEL_e6e6b54c" ldName="MU_ES2_DIS_ES_MODEL_e6e6b54c">
					<LN0 lnClass="LLN0" lnType="TBW_LLN0_fc0f9e3b54bf" inst=""/>
					<LN lnClass="XSWI" lnType="TBW_XSWI_31b52c8cc41a" inst="1"/>
				</LDevice>
				<LDevice inst="ES1_DIS_ES_MODEL_b37473d9" ldName="MU_ES1_DIS_ES_MODEL_b37473d9">
					<LN0 lnClass="LLN0" lnType="TBW_LLN0_fc0f9e3b54bf" inst=""/>
					<LN lnClass="XSWI" lnType="TBW_XSWI_31b52c8cc41a" inst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
		<AccessPoint desc="PB" name="AP2">
			<ServerAt apName="AP1"/>
		</AccessPoint>
	</IED>
	<IED configVersion="1.0" desc="KPDR Feldleitgerät" engRight="full" manufacturer="none" name="BCU" originalSclRevision="B" originalSclVersion="2007" type="none">
		<Services nameLength="64">
			<DynAssociation max="8"/>
			<SettingGroups>
				<SGEdit resvTms="true"/>
			</SettingGroups>
			<GetDirectory/>
			<GetDataObjectDefinition/>
			<DataObjectDirectory/>
			<GetDataSetValue/>
			<DataSetDirectory/>
			<ConfDataSet max="100" maxAttributes="200"/>
			<ReadWrite/>
			<ConfReportControl max="160" bufConf="true" bufMode="both"/>
			<GetCBValues/>
			<ReportSettings cbName="Conf" datSet="Conf" bufTime="Dyn" intgPd="Dyn" optFields="Dyn" owner="true" resvTms="true" rptID="Dyn" trgOps="Dyn"/>
			<GSESettings cbName="Conf" datSet="Conf" appID="Conf"/>
			<GOOSE max="20"/>
			<FileHandling ftp="true" ftps="true"/>
			<ConfLNs fixLnInst="true" fixPrefix="true"/>
        <ClientServices bufReport="true" goose="true" gsse="false" maxGOOSE="128" maxSMV="16" readLog="false" supportsLdName="true" sv="true" unbufReport="true">
          <TimeSyncProt sntp="true" c37_238="false" other="false"/>
        </ClientServices>
			<ConfLdName/>
			<SupSubscription maxGo="100" maxSv="8"/>
			<RedProt hsr="true" prp="true" rstp="true"/>
			<TimeSyncProt other="true"/>
		</Services>
		<AccessPoint desc="SB" name="AP1">
		<Services nameLength="64">
			<ClientServices goose="true" gsse="false" bufReport="true" unbufReport="true" readLog="false" sv="true" supportsLdName="true" maxAttributes="250" maxReports="32" maxGOOSE="32" maxSMV="32"/> 
        <TimeSyncProt sntp="true"/>
        </Services>
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_AP1" ldName="BCU_LD0_AP1">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf">
						<DataSet name="LD0 Dataset">
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="ChLiv" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="ChLiv" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="RedChLiv" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="RedChLiv" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="OpTmh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="OpTmh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrSupAlm" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrSupAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="Sim" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="Sim" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="WacTrg" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="WacTrg" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSrc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSrc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSynLkd" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSynLkd" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSyn" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSyn" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="stVal" fc="ST"/>
						</DataSet>
						<DataSet name="Control_Dataset">
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="general" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="general" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="q" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="CB1_CB_CTRL_417acb5a" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="general" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="general" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="q" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS1_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="general" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="general" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="q" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="DIS2_DIS_ES_CTRL_73b14b2b" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="general" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="general" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES1_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="general" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="general" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES2_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="general" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="general" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES3_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="general" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="general" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="OpOpn" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelCls" daName="q" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="stVal" fc="ST"/>
							<FCDA ldInst="ES4_DIS_ES_CTRL_302785d8" prefix="" lnClass="CSWI" lnInst="1" doName="SelOpn" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_CTRL_79ce9369" prefix="" lnClass="ATCC" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_CTRL_79ce9369" prefix="" lnClass="ATCC" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_TC_CTRL_79ce9369" prefix="" lnClass="ATCC" lnInst="1" doName="TapChg" daName="valWTr.posVal" fc="ST"/>
							<FCDA ldInst="REA1_TC_CTRL_79ce9369" prefix="" lnClass="ATCC" lnInst="1" doName="TapChg" daName="q" fc="ST"/>
						</DataSet>
						<ReportControl name="RCB_Control" buffered="true" rptID="RID_Control" bufTime="100" confRev="1" datSet="Control_Dataset">
							<TrgOps dchg="true"/>
							<RptEnabled max="1">
								<ClientLN iedName="HMI" apRef="AP1" ldInst="LD0_AP1" prefix="" lnClass="LLN0" lnInst=""/>
							</RptEnabled>
						</ReportControl>
						<ReportControl name="RCB_LD0" buffered="true" rptID="RID_LD0" bufTime="100" confRev="40001" datSet="LD0 Dataset">
							<TrgOps dchg="true"/>
							<RptEnabled max="1">
								<ClientLN iedName="HMI" apRef="AP1" ldInst="LD0_AP1" prefix="" lnClass="LLN0" lnInst=""/>
							</RptEnabled>
						</ReportControl>
						<Inputs>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="GasInsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="GasInsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="MstAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="MstAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="ZREA" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="ZREA" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="GasInsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="GasInsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="MstAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="MstAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="Loc" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="Loc" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="valWTr.posVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="FuFail" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="FuFail" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
						</Inputs>
						<GSEControl name="GOOSE_Control" confRev="1" type="GOOSE" appID="BCU/LD0_AP1/LLN0/GSECB_Control" datSet="Control_Dataset"/>
					</LN0>
					<LN lnClass="LCCH" inst="1" lnType="TBW_LCCH_006934a78c88"/>
					<LN lnClass="LPHD" inst="1" lnType="TBW_LPHD_db28f424d9d8"/>
					<LN lnClass="LTMS" inst="1" lnType="TBW_LTMS_ca5618f9add6"/>
				</LDevice>
				<LDevice inst="CB1_CB_CTRL_417acb5a" ldName="BCU_CB1_CB_CTRL_417acb5a">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CILO" inst="1" lnType="TBW_CILO_eba5115e8513"/>
					<LN lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca"/>
				</LDevice>
				<LDevice inst="DIS2_DIS_ES_CTRL_73b14b2b" ldName="BCU_DIS2_DIS_ES_CTRL_73b14b2b">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d"/>
					<LN lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca"/>
				</LDevice>
				<LDevice inst="DIS1_DIS_ES_CTRL_73b14b2b" ldName="BCU_DIS1_DIS_ES_CTRL_73b14b2b">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d"/>
					<LN lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca"/>
				</LDevice>
				<LDevice inst="ES4_DIS_ES_CTRL_302785d8" ldName="BCU_ES4_DIS_ES_CTRL_302785d8">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d"/>
					<LN lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca"/>
				</LDevice>
				<LDevice inst="ES3_DIS_ES_CTRL_302785d8" ldName="BCU_ES3_DIS_ES_CTRL_302785d8">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d"/>
					<LN lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca"/>
				</LDevice>
				<LDevice inst="ES2_DIS_ES_CTRL_302785d8" ldName="BCU_ES2_DIS_ES_CTRL_302785d8">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d"/>
					<LN lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca"/>
				</LDevice>
				<LDevice inst="ES1_DIS_ES_CTRL_302785d8" ldName="BCU_ES1_DIS_ES_CTRL_302785d8">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CILO" inst="1" lnType="TBW_CILO_21831adffa5d"/>
					<LN lnClass="CSWI" inst="1" lnType="TBW_CSWI_90b0317d1bca"/>
				</LDevice>
				<LDevice inst="REA1_TC_CTRL_79ce9369" ldName="BCU_REA1_TC_CTRL_79ce9369">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="ATCC" inst="1" lnType="TBW_ATCC_ad52a337ebd6"/>
				</LDevice>
				<LDevice inst="Alarmhandling_d212ea6a" ldName="BCU_Alarmhandling_d212ea6a">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="CALH" inst="1" lnType="TBW_CALH_ae9e11b4a62c"/>
				</LDevice>
			</Server>
		</AccessPoint>
		<AccessPoint desc="PB" name="AP2">
			<ServerAt apName="AP1"/>
		</AccessPoint>
	</IED>
	<IED configVersion="1.0" desc="KPDR Schutzgerät" engRight="full" manufacturer="none" name="BPU" originalSclRevision="B" originalSclVersion="2007" type="none">
		<Services nameLength="64">
			<DynAssociation max="8"/>
			<SettingGroups>
				<SGEdit resvTms="true"/>
			</SettingGroups>
			<GetDirectory/>
			<GetDataObjectDefinition/>
			<DataObjectDirectory/>
			<GetDataSetValue/>
			<DataSetDirectory/>
			<ConfDataSet max="50" maxAttributes="200" modify="true"/>
			<ReadWrite/>
			<ConfReportControl max="60" bufConf="true" bufMode="both"/>
			<GetCBValues/>
			<ReportSettings cbName="Conf" datSet="Conf" bufTime="Dyn" intgPd="Dyn" optFields="Dyn" owner="true" resvTms="true" rptID="Dyn" trgOps="Dyn"/>
			<GSESettings cbName="Conf" datSet="Conf" appID="Conf" dataLabel="Conf"/>
			<SMVSettings cbName="Conf" datSet="Conf" optFields="Conf" samplesPerSec="true" smpRate="Conf" svID="Conf">
				<SmpRate>80</SmpRate>
				<SmpRate>256</SmpRate>
				<SamplesPerSec>4000</SamplesPerSec>
				<SamplesPerSec>4800</SamplesPerSec>
				<SamplesPerSec>12800</SamplesPerSec>
				<SamplesPerSec>14400</SamplesPerSec>
				<SamplesPerSec>15360</SamplesPerSec>
			</SMVSettings>
			<GOOSE max="16" fixedOffs="false"/>
			<SMVsc max="0" delivery="multicast" deliveryConf="false"/>
			<FileHandling ftp="true" ftps="true"/>
			<ConfLNs fixLnInst="true" fixPrefix="true"/>
        <ClientServices bufReport="true" goose="true" gsse="false" maxGOOSE="128" maxSMV="16" readLog="false" supportsLdName="true" sv="true" unbufReport="true">
          <TimeSyncProt sntp="true" c37_238="false" other="false"/>
        </ClientServices>
			<ConfLdName/>
			<SupSubscription maxGo="100" maxSv="8"/>
			<ValueHandling setToRO="false"/>
		</Services>
		<AccessPoint desc="SB" name="AP1">
			<Services nameLength="64">
			<ClientServices goose="true" gsse="false" bufReport="true" unbufReport="true" readLog="false" sv="true" supportsLdName="true" maxAttributes="250" maxReports="32" maxGOOSE="32" maxSMV="32"/> 
        <TimeSyncProt sntp="true"/>
      </Services>
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_AP1" ldName="BPU_LD0_AP1">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf">
						<DataSet name="Trip_Dataset">
							<FCDA ldInst="REA1_REA_PROT_dcb072e2" prefix="" lnClass="PTRC" lnInst="1" doName="Op" daName="general" fc="ST"/>
							<FCDA ldInst="REA1_REA_PROT_dcb072e2" prefix="" lnClass="PTRC" lnInst="1" doName="Op" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_PROT_dcb072e2" prefix="" lnClass="PTRC" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="REA1_REA_PROT_dcb072e2" prefix="" lnClass="PTRC" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="REA1_REA_PROT_dcb072e2" prefix="" lnClass="PTRC" lnInst="1" doName="Tr" daName="general" fc="ST"/>
							<FCDA ldInst="REA1_REA_PROT_dcb072e2" prefix="" lnClass="PTRC" lnInst="1" doName="Tr" daName="q" fc="ST"/>
						</DataSet>
						<DataSet name="LD0 Dataset">
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="ChLiv" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="ChLiv" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="RedChLiv" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="RedChLiv" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LCCH" lnInst="1" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="OpTmh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="OpTmh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrSupAlm" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="PwrSupAlm" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="Sim" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="Sim" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="WacTrg" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LPHD" lnInst="1" doName="WacTrg" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmAcc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSrc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSrc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSynLkd" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSynLkd" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSyn" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LTMS" lnInst="1" doName="TmSyn" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Beh" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Health" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Mod" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="Loc" daName="stVal" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="q" fc="ST"/>
							<FCDA ldInst="LD0_AP1" prefix="" lnClass="LLN0" doName="LocKey" daName="stVal" fc="ST"/>
						</DataSet>
						<ReportControl name="RCB_Trip" buffered="true" rptID="RID_Trip" bufTime="100" confRev="1" datSet="Trip_Dataset">
							<TrgOps dchg="true"/>
							<RptEnabled max="1">
								<ClientLN iedName="HMI" apRef="AP1" ldInst="LD0_AP1" prefix="" lnClass="LLN0" lnInst=""/>
							</RptEnabled>
						</ReportControl>
						<ReportControl name="RCB_LD0" buffered="true" rptID="RID_LD0" bufTime="100" confRev="10001" datSet="LD0 Dataset">
							<TrgOps dchg="true"/>
							<RptEnabled max="1">
								<ClientLN iedName="HMI" apRef="AP1" ldInst="LD0_AP1" prefix="" lnClass="LLN0" lnInst=""/>
							</RptEnabled>
						</ReportControl>
						<Inputs>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsA" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsA" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsA" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsA" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsA" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsA" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsB" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsB" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsB" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsB" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsB" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsB" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsC" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsC" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsC" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsC" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsC" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.phsC" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.neut" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.neut" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.neut" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.neut" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.neut" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="VT_MEAS_fbb43e0e" lnClass="MMXU" lnInst="1" prefix="" doName="PhV.neut" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.neut" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.neut" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.neut" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.neut" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.neut" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.neut" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsA" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsA" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsA" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsA" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsA" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsA" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsB" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsB" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsB" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsB" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsB" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsB" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsC" daName="cVal.ang.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsC" daName="cVal.mag.f" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsC" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsC" daName="t" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsC" daName="units.multiplier" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="SMV" ldInst="CT_MEAS_32464857" lnClass="MMXU" lnInst="1" prefix="" doName="A.phsC" daName="units.SIUnit" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="MSVCB01"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkCls" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkCls" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkOpn" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CB1_CB_MODEL_6c07741f" lnClass="XCBR" lnInst="1" prefix="" doName="BlkOpn" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS1_DIS_ES_MODEL_55bf6ae4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="DIS2_DIS_ES_MODEL_ce3262a3" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES1_DIS_ES_MODEL_b37473d9" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES2_DIS_ES_MODEL_e6e6b54c" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES3_DIS_ES_MODEL_6cb3c2d4" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="ES4_DIS_ES_MODEL_caa04c76" lnClass="XSWI" lnInst="1" prefix="" doName="Pos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="GasInsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="GasInsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="MstAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="MstAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="SIML" lnInst="2" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="ZREA" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_REA_MODEL_8c25d508" lnClass="ZREA" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="GasInsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="GasInsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="MstAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="MstAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="SIML" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="Loc" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="Loc" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="opOk" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="opRcvd" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="REA1_TC_MODEL_dde13964" lnClass="YLTC" lnInst="1" prefix="" doName="TapPos" daName="valWTr.posVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="InsAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="FuFail" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="VT1_VT_MODEL_2aae0577" lnClass="TVTR" lnInst="1" prefix="" doName="FuFail" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT1_CT_MODEL_3a994edf" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="DenAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="PresAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="SIMG" lnInst="1" prefix="" doName="TmpAlm" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="stVal" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
							<ExtRef iedName="MU" serviceType="GOOSE" ldInst="CT2_CT_MODEL_0a58c143" lnClass="TCTR" lnInst="1" prefix="" doName="EEHealth" daName="q" srcLDInst="LD0_AP1" srcPrefix="" srcLNClass="LLN0" srcCBName="GOOSE_Pos_Alm"/>
						</Inputs>
						<GSEControl name="GOOSE_Trip" confRev="1" type="GOOSE" appID="BPU/LD0_AP1/LLN0/GSECB_Trip" datSet="Trip_Dataset"/>
					</LN0>
					<LN lnClass="LCCH" inst="1" lnType="TBW_LCCH_006934a78c88"/>
					<LN lnClass="LPHD" inst="1" lnType="TBW_LPHD_db28f424d9d8"/>
					<LN lnClass="LTMS" inst="1" lnType="TBW_LTMS_ca5618f9add6"/>
				</LDevice>
				<LDevice inst="REA1_REA_PROT_dcb072e2" ldName="BPU_REA1_REA_PROT_dcb072e2">
					<LN0 lnClass="LLN0" inst="" lnType="TBW_LLN0_fc0f9e3b54bf"/>
					<LN lnClass="PDIF" inst="1" lnType="TBW_PDIF_c2a85b9ba26f">
					</LN>
					<LN lnClass="PSOF" inst="1" lnType="TBW_PSOF_d6b3d79c4312"/>
					<LN lnClass="PTOC" inst="1" lnType="TBW_PTOC_9fc54f271916"/>
					<LN lnClass="PTOV" inst="1" lnType="TBW_PTOV_0b0a99740f7f"/>
					<LN lnClass="PTRC" inst="1" lnType="TBW_PTRC_a1a9c2bac1fa"/>
					<LN lnClass="RBRF" inst="1" lnType="TBW_RBRF_90305cb8e3a6"/>
				</LDevice>
			</Server>
		</AccessPoint>
		<AccessPoint desc="PB" name="AP2">
			<ServerAt apName="AP1"/>
		</AccessPoint>
	</IED>
	<IED configVersion="1.0" engRight="full" manufacturer="none" originalSclRevision="B" originalSclVersion="2007" type="none" name="HMI" desc="Client für Reports">
		<Services nameLength="64">
<DynAssociation/>
<GetDirectory/>
<GetDataObjectDefinition/>
<DataObjectDirectory/>
<GetDataSetValue/>
<DataSetDirectory/>
<ConfDataSet max="150" maxAttributes="468"/>
<ReadWrite/>
<ConfReportControl max="200" bufMode="both" bufConf="true" maxBuf="100"/>
<GetCBValues/>
<ReportSettings cbName="Conf" datSet="Conf" rptID="Dyn" optFields="Dyn" bufTime="Dyn" trgOps="Dyn" intgPd="Dyn"/>
<GSESettings cbName="Conf" datSet="Conf" appID="Conf"/>
<GOOSE max="150"/>
<FileHandling ftp="true"/>
<ConfLNs/>
<ClientServices goose="true" gsse="false" bufReport="true" unbufReport="true" readLog="false" sv="true" supportsLdName="true" maxAttributes="250" maxReports="32" maxGOOSE="32" maxSMV="32"/>
<RedProt prp="true"/>
</Services>
		<AccessPoint name="AP1" desc="">
		    <Services nameLength="64">
<DynAssociation/>
<GetDirectory/>
<GetDataObjectDefinition/>
<DataObjectDirectory/>
<GetDataSetValue/>
<DataSetDirectory/>
<ConfDataSet max="150" maxAttributes="468"/>
<ReadWrite/>
<ConfReportControl max="200" bufMode="both" bufConf="true" maxBuf="100"/>
<GetCBValues/>
<ReportSettings cbName="Conf" datSet="Conf" rptID="Dyn" optFields="Dyn" bufTime="Dyn" trgOps="Dyn" intgPd="Dyn"/>
<GSESettings cbName="Conf" datSet="Conf" appID="Conf"/>
<GOOSE max="150"/>
<FileHandling ftp="true"/>
<ConfLNs/>
<ClientServices goose="true" gsse="false" bufReport="true" unbufReport="true" readLog="false" sv="true" supportsLdName="true" maxAttributes="250" maxReports="32" maxGOOSE="32" maxSMV="32"/>
<RedProt prp="true"/>
</Services>
			<Server>
				<Authentication none="true"/>
				<LDevice inst="LD0_AP1" ldName="HMI_LD0_AP1">
					<LN0 lnClass="LLN0" lnType="TBW_LLN0_fc0f9e3b54bf" inst="">
						<Inputs>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="SIMG" srcLNInst="1" srcDOName="PresAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="SIMG" srcLNInst="1" srcDOName="PresAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="SIMG" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="SIMG" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="SIMG" srcLNInst="1" srcDOName="InsAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="SIMG" srcLNInst="1" srcDOName="InsAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="Pos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="Pos" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="Pos" srcDANamee="opOk"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="Pos" srcDANamee="opRcvd"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="BlkCls" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="BlkCls" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="BlkOpn" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="XCBR" srcLNInst="1" srcDOName="BlkOpn" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opOk"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opRcvd"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opOk"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opRcvd"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opOk"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opRcvd"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="XSWI" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opOk"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="XSWI" srcLNInst="1" srcDOName="Pos" srcDANamee="opRcvd"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="InsAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="InsAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="GasInsAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="GasInsAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="MstAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="MstAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="TmpAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="SIML" srcLNInst="2" srcDOName="TmpAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="ZREA" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="ZREA" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="GasInsAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="GasInsAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="InsAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="InsAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="MstAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="MstAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="SIML" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="Loc" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="Loc" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="TapPos" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="TapPos" srcDANamee="opOk"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="TapPos" srcDANamee="opRcvd"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="YLTC" srcLNInst="1" srcDOName="TapPos" srcDANamee="valWTr.posVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="DenAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="DenAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="InsAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="InsAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="PresAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="PresAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="SIMG" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="TVTR" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="TVTR" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="TVTR" srcLNInst="1" srcDOName="FuFail" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="TVTR" srcLNInst="1" srcDOName="FuFail" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="SIMG" srcLNInst="1" srcDOName="DenAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="SIMG" srcLNInst="1" srcDOName="DenAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="SIMG" srcLNInst="1" srcDOName="PresAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="SIMG" srcLNInst="1" srcDOName="PresAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="SIMG" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="SIMG" srcLNInst="1" srcDOName="TmpAlm" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="TCTR" srcLNInst="1" srcDOName="EEHealth" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Pos_Alm" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="TCTR" srcLNInst="1" srcDOName="EEHealth" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CB1_CB_MODEL_6c07741f" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT_MEAS_32464857" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT_MEAS_32464857" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT_MEAS_32464857" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT_MEAS_32464857" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT_MEAS_32464857" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT_MEAS_32464857" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="CT1_CT_MODEL_3a994edf" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS1_DIS_ES_MODEL_55bf6ae4" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="DIS2_DIS_ES_MODEL_ce3262a3" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES1_DIS_ES_MODEL_b37473d9" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES2_DIS_ES_MODEL_e6e6b54c" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES3_DIS_ES_MODEL_6cb3c2d4" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="ES4_DIS_ES_MODEL_caa04c76" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_EQ_Monitoring_26b28de3" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_EQ_Monitoring_26b28de3" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_EQ_Monitoring_26b28de3" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_EQ_Monitoring_26b28de3" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_EQ_Monitoring_26b28de3" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_EQ_Monitoring_26b28de3" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_REA_MODEL_8c25d508" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="REA1_TC_MODEL_dde13964" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT_MEAS_fbb43e0e" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT_MEAS_fbb43e0e" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT_MEAS_fbb43e0e" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT_MEAS_fbb43e0e" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT_MEAS_fbb43e0e" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT_MEAS_fbb43e0e" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="VT1_VT_MODEL_2aae0577" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Loc" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Loc" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="LocKey" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="LocKey" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmAcc" srcDANamee="q"/>
							<ExtRef iedName="MU" serviceType="Report" srcCBName="RCB_Beh_Health_Mod" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmAcc" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="ChLiv" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="ChLiv" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="RedChLiv" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="RedChLiv" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PhyHealth" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PhyHealth" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrDn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrDn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="OpTmh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="OpTmh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrSupAlm" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrSupAlm" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="Sim" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="Sim" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="WacTrg" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="WacTrg" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmAcc" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmAcc" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmSrc" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmSrc" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmSynLkd" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmSynLkd" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmSyn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LTMS" srcLNInst="1" srcDOName="TmSyn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Loc" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="Loc" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="LocKey" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LLN0" srcDOName="LocKey" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="CB1_CB_CTRL_417acb5a" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS1_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="DIS2_DIS_ES_CTRL_73b14b2b" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES1_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES2_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES3_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="general"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="OpOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelCls" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="ES4_DIS_ES_CTRL_302785d8" srcLNClass="CSWI" srcLNInst="1" srcDOName="SelOpn" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="REA1_TC_CTRL_79ce9369" srcLNClass="ATCC" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="REA1_TC_CTRL_79ce9369" srcLNClass="ATCC" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="REA1_TC_CTRL_79ce9369" srcLNClass="ATCC" srcLNInst="1" srcDOName="TapChg" srcDANamee="valWTr.posVal"/>
							<ExtRef iedName="BCU" serviceType="Report" srcCBName="RCB_Control" srcLDInst="REA1_TC_CTRL_79ce9369" srcLNClass="ATCC" srcLNInst="1" srcDOName="TapChg" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_Trip" srcLDInst="REA1_REA_PROT_dcb072e2" srcLNClass="PTRC" srcLNInst="1" srcDOName="Op" srcDANamee="general"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_Trip" srcLDInst="REA1_REA_PROT_dcb072e2" srcLNClass="PTRC" srcLNInst="1" srcDOName="Op" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_Trip" srcLDInst="REA1_REA_PROT_dcb072e2" srcLNClass="PTRC" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_Trip" srcLDInst="REA1_REA_PROT_dcb072e2" srcLNClass="PTRC" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_Trip" srcLDInst="REA1_REA_PROT_dcb072e2" srcLNClass="PTRC" srcLNInst="1" srcDOName="Tr" srcDANamee="general"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_Trip" srcLDInst="REA1_REA_PROT_dcb072e2" srcLNClass="PTRC" srcLNInst="1" srcDOName="Tr" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="ChLiv" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="ChLiv" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Health" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Health" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Beh" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Beh" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="RedChLiv" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="RedChLiv" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Mod" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LCCH" srcLNInst="1" srcDOName="Mod" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PhyHealth" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PhyHealth" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrDn" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrDn" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="OpTmh" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="OpTmh" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrSupAlm" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="PwrSupAlm" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="Sim" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="Sim" srcDANamee="stVal"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="WacTrg" srcDANamee="q"/>
							<ExtRef iedName="BPU" serviceType="Report" srcCBName="RCB_LD0" srcLDInst="LD0_AP1" srcLNClass="LPHD" srcLNInst="1" srcDOName="WacTrg" srcDANamee="stVal"/>
						</Inputs>
					</LN0>
					<LN lnClass="LCCH" lnType="TBW_LCCH_006934a78c88" inst="1"/>
					<LN lnClass="LPHD" lnType="TBW_LPHD_db28f424d9d8" inst="1"/>
					<LN lnClass="LTMS" lnType="TBW_LTMS_ca5618f9add6" inst="1"/>
				</LDevice>
			</Server>
		</AccessPoint>
		<AccessPoint name="AP2" desc="">
			<ServerAt apName="AP1"/>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType id="TBW_ATCC_ad52a337ebd6" lnClass="ATCC">
			<DO name="TapChg" type="BSC_3914a41c2a81"/>
			<DO name="TapPos" type="ISC_a25631252408"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Auto" type="SPC_84a31b7cbebc"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="BlkLV" type="ASG_56d4e4906018"/>
			<DO name="Loc" type="SPS_c75d9c31c555"/>
			<DO name="LocKey" type="SPS_c75d9c31c555"/>
			<DO name="LocSta" type="SPC_84a31b7cbebc"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
		</LNodeType>
		<LNodeType id="TBW_CALH_ae9e11b4a62c" lnClass="CALH">
			<DO name="GrAlm" type="SPS_c75d9c31c555"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
		</LNodeType>
		<LNodeType id="TBW_CILO_21831adffa5d" lnClass="CILO">
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="EnaCls" type="SPS_c75d9c31c555"/>
			<DO name="EnaOpn" type="SPS_c75d9c31c555"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_CSWI_90b0317d1bca" lnClass="CSWI">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="OpCls" type="ACT_0019427094af"/>
			<DO name="OpOpn" type="ACT_0019427094af"/>
			<DO name="SelOpn" type="SPS_c75d9c31c555"/>
			<DO name="SelCls" type="SPS_c75d9c31c555"/>
			<DO name="CmdBlk" type="SPC_84a31b7cbebc"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Pos" type="DPC_d5237c901349"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="PosA" type="DPC_d5237c901349"/>
			<DO name="PosB" type="DPC_d5237c901349"/>
			<DO name="PosC" type="DPC_d5237c901349"/>
			<DO name="Loc" type="SPS_c75d9c31c555"/>
			<DO name="LocKey" type="SPS_c75d9c31c555"/>
			<DO name="LocSta" type="SPC_84a31b7cbebc"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_LCCH_006934a78c88" lnClass="LCCH">
			<DO name="RedChLiv" type="SPS_c75d9c31c555"/>
			<DO name="ApNam" type="VSG_5f726fdae95e"/>
			<DO name="ChLivTms" type="ING_5310c7c26788"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="NamPlt" type="LPL_7e8348300398"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="ChLiv" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_LLN0_fc0f9e3b54bf" lnClass="LLN0">
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="NamPlt" type="LPL_7e8348300398"/>
			<DO name="Loc" type="SPS_c75d9c31c555"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="LocSta" type="SPC_84a31b7cbebc"/>
			<DO name="LocKey" type="SPS_c75d9c31c555"/>
			<DO name="LEDRs" type="SPC_84a31b7cbebc"/>
			<DO name="Diag" type="SPC_84a31b7cbebc"/>
		</LNodeType>
		<LNodeType id="TBW_LPHD_db28f424d9d8" lnClass="LPHD">
			<DO name="NamPlt" type="LPL_7e8348300398"/>
			<DO name="OpTmh" type="INS_2bdd8d6b643e"/>
			<DO name="WacTrg" type="INS_2bdd8d6b643e"/>
			<DO name="PwrUp" type="SPS_c75d9c31c555"/>
			<DO name="PwrDn" type="SPS_c75d9c31c555"/>
			<DO name="PwrSupAlm" type="SPS_c75d9c31c555"/>
			<DO name="Sim" type="SPC_84a31b7cbebc"/>
			<DO name="PhyHealth" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="PhyNam" type="DPL_57515f2a1dbc"/>
			<DO name="Proxy" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_LTMS_ca5618f9add6" lnClass="LTMS">
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="TmSrcSet" type="VSG_5f726fdae95e"/>
			<DO name="TmSyn" type="ENS_ClockSyncKind_19deb7532286"/>
			<DO name="TmChSt" type="SPS_c75d9c31c555"/>
			<DO name="TmSynLkd" type="ENS_ClockSyncLockingKind_e4e04cb7f3d4"/>
			<DO name="TmAcc" type="INS_2bdd8d6b643e"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="TmSrc" type="VSS_85bb0ba50c39"/>
			<DO name="TmSrcTyp" type="ENS_ClockSourceKind_63165dbbdae2"/>
		</LNodeType>
		<LNodeType id="TBW_MMXN_687d5ddf933d" lnClass="MMXN">
			<DO name="Amp" type="MV_13de9d50337d"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Hz" type="MV_13de9d50337d"/>
			<DO name="Imp" type="CMV_46b7e5e8629e"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="PwrFact" type="MV_13de9d50337d"/>
			<DO name="Vol" type="MV_13de9d50337d"/>
			<DO name="VolAmp" type="MV_13de9d50337d"/>
			<DO name="VolAmpr" type="MV_13de9d50337d"/>
			<DO name="Watt" type="MV_13de9d50337d"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_MMXU_94806b6365f6" lnClass="MMXU">
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="A" type="WYE_3fe5c22bf893"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Hz" type="MV_13de9d50337d"/>
			<DO name="HzRte" type="MV_13de9d50337d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="PF" type="WYE_3fe5c22bf893"/>
			<DO name="PFSign" type="ENG_PFSignKind_ffba400b2b78"/>
			<DO name="PhV" type="WYE_3fe5c22bf893"/>
			<DO name="PPV" type="DEL_06430f5cbff1"/>
			<DO name="PNV" type="WYE_3fe5c22bf893"/>
			<DO name="TotPF" type="MV_13de9d50337d"/>
			<DO name="TotVA" type="MV_13de9d50337d"/>
			<DO name="TotVAr" type="MV_13de9d50337d"/>
			<DO name="TotW" type="MV_13de9d50337d"/>
			<DO name="VA" type="WYE_3fe5c22bf893"/>
			<DO name="VAr" type="WYE_3fe5c22bf893"/>
			<DO name="W" type="WYE_3fe5c22bf893"/>
			<DO name="Z" type="WYE_3fe5c22bf893"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_PDIF_c2a85b9ba26f" lnClass="PDIF">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="HiSet" type="ASG_56d4e4906018"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="LoSet" type="ASG_56d4e4906018"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Str" type="ACD_24061fde611c"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Op" type="ACT_0019427094af"/>
			<DO name="TmAChr" type="CSG_0fed94484376"/>
			<DO name="TmACrv" type="CURVE_7207d545376f"/>
			<DO name="TmASt" type="CSD_33dd966b26af"/>
			<DO name="FltA" type="WYE_3fe5c22bf893"/>
			<DO name="FltPhV" type="WYE_3fe5c22bf893"/>
			<DO name="DifAClc" type="WYE_3fe5c22bf893"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_PSOF_d6b3d79c4312" lnClass="PSOF">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="BlkRec" type="SPS_c75d9c31c555"/>
			<DO name="BlkValA" type="ASG_56d4e4906018"/>
			<DO name="BlkValV" type="ASG_56d4e4906018"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Str" type="ACD_24061fde611c"/>
			<DO name="StrVal" type="ASG_56d4e4906018"/>
			<DO name="SetPhV" type="ASG_56d4e4906018"/>
			<DO name="OpModSof" type="ENG_SOFEnablingModeKind_d08b7cc9fc07"/>
			<DO name="EnaMod" type="ENG_SOFEnablingModeKind_d08b7cc9fc07"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Op" type="ACT_0019427094af"/>
			<DO name="FltA" type="WYE_3fe5c22bf893"/>
			<DO name="FltPhV" type="WYE_3fe5c22bf893"/>
		</LNodeType>
		<LNodeType id="TBW_PTOC_9fc54f271916" lnClass="PTOC">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="DirMod" type="ENG_DirectionModeKindf_4b9d0372eded"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="OpDlTmms" type="ING_5310c7c26788"/>
			<DO name="StrVal" type="ASG_56d4e4906018"/>
			<DO name="TmAChr" type="CSG_0fed94484376"/>
			<DO name="TmACrv" type="CURVE_7207d545376f"/>
			<DO name="TmASt" type="CSD_33dd966b26af"/>
			<DO name="TmMult" type="ASG_56d4e4906018"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Op" type="ACT_0019427094af"/>
			<DO name="Str" type="ACD_24061fde611c"/>
			<DO name="FltPhV" type="WYE_3fe5c22bf893"/>
			<DO name="FltA" type="WYE_3fe5c22bf893"/>
		</LNodeType>
		<LNodeType id="TBW_PTOV_0b0a99740f7f" lnClass="PTOV">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Op" type="ACT_0019427094af"/>
			<DO name="OpDlTmms" type="ING_5310c7c26788"/>
			<DO name="StrVal" type="ASG_56d4e4906018"/>
			<DO name="TmMult" type="ASG_56d4e4906018"/>
			<DO name="TmVChr" type="CSG_0fed94484376"/>
			<DO name="TmVCrv" type="CURVE_7207d545376f"/>
			<DO name="TmVSt" type="CSD_33dd966b26af"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Str" type="ACD_24061fde611c"/>
			<DO name="FltA" type="WYE_3fe5c22bf893"/>
			<DO name="FltPhV" type="WYE_3fe5c22bf893"/>
		</LNodeType>
		<LNodeType id="TBW_PTRC_a1a9c2bac1fa" lnClass="PTRC">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Op" type="ACT_0019427094af"/>
			<DO name="Str" type="ACD_24061fde611c"/>
			<DO name="Tr" type="ACT_0019427094af"/>
			<DO name="TrMod" type="ENG_TripModeKind_cb27456c6560"/>
			<DO name="TrPlsTmms" type="ING_5310c7c26788"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="FltPhV" type="WYE_3fe5c22bf893"/>
			<DO name="FltA" type="WYE_3fe5c22bf893"/>
		</LNodeType>
		<LNodeType id="TBW_RBRF_90305cb8e3a6" lnClass="RBRF">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="FailMod" type="ENG_FailureDetectionKind_1f11cbd5942d"/>
			<DO name="FailTmms" type="ING_5310c7c26788"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="TPTrTmms" type="ING_5310c7c26788"/>
			<DO name="SPlTrTmms" type="ING_5310c7c26788"/>
			<DO name="ReTrMod" type="ENG_RetripModeKind_0682c920e0c9"/>
			<DO name="Str" type="ACD_24061fde611c"/>
			<DO name="OpIn" type="ACT_0019427094af"/>
			<DO name="OpEx" type="ACT_0019427094af"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
		</LNodeType>
		<LNodeType id="TBW_SIMG_03d5dbd3d69b" lnClass="SIMG">
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="PresAlm" type="SPS_c75d9c31c555"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="InsAlm" type="SPS_c75d9c31c555"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
			<DO name="Pres" type="MV_13de9d50337d"/>
			<DO name="Tmp" type="MV_13de9d50337d"/>
			<DO name="TmpAlm" type="SPS_c75d9c31c555"/>
			<DO name="DenAlm" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_SIML_251374eedc1d" lnClass="SIML">
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="TmpAlm" type="SPS_c75d9c31c555"/>
			<DO name="InsLevMin" type="SPS_c75d9c31c555"/>
			<DO name="MstWrn" type="SPS_c75d9c31c555"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="GasInsTr" type="SPS_c75d9c31c555"/>
			<DO name="InsTr" type="SPS_c75d9c31c555"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="InsAlm" type="SPS_c75d9c31c555"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
			<DO name="Tmp" type="MV_13de9d50337d"/>
			<DO name="Pres" type="MV_13de9d50337d"/>
			<DO name="MstAlm" type="SPS_c75d9c31c555"/>
			<DO name="GasInsAlm" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_SOPM_1b63f9611c7c" lnClass="SOPM">
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="MotOp" type="SPS_c75d9c31c555"/>
			<DO name="MotAlm" type="SPS_c75d9c31c555"/>
			<DO name="MotAlmTms" type="ING_5310c7c26788"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="EnBlk" type="SPS_c75d9c31c555"/>
			<DO name="EnAlm" type="SPS_c75d9c31c555"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
		</LNodeType>
		<LNodeType id="TBW_STMP_76806ed5f9c1" lnClass="STMP">
			<DO name="Alm" type="SPS_c75d9c31c555"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Trip" type="SPS_c75d9c31c555"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Tmp" type="MV_13de9d50337d"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_TVTR_14baabd8b7a2" lnClass="TVTR">
			<DO name="AccMeas" type="ENG_InstrumentTransformerMeasurementRatingKind_c2774215aea8"/>
			<DO name="AccPro" type="ENG_InstrumentTransformerProtectionRatingKind_e755a497fe7a"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="EEHealth" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="EEName" type="DPL_57515f2a1dbc"/>
			<DO name="FuFail" type="SPS_c75d9c31c555"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Rat" type="ASG_56d4e4906018"/>
			<DO name="SmpRte" type="ING_5310c7c26788"/>
			<DO name="VolSv" type="SAV_a0fc7f00f8bf"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="HzRtg" type="ASG_56d4e4906018"/>
			<DO name="VRtg" type="ASG_56d4e4906018"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_TCTR_7e35cb0752d6" lnClass="TCTR">
			<DO name="AccMeas" type="ENG_InstrumentTransformerMeasurementRatingKind_c2774215aea8"/>
			<DO name="AccPro" type="ENG_InstrumentTransformerProtectionRatingKind_e755a497fe7a"/>
			<DO name="AmpSv" type="SAV_a0fc7f00f8bf"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="DynRngMax" type="ASG_56d4e4906018"/>
			<DO name="DynRngMin" type="ASG_56d4e4906018"/>
			<DO name="EEHealth" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="EEName" type="DPL_57515f2a1dbc"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="Rat" type="ASG_56d4e4906018"/>
			<DO name="SmpRte" type="ING_5310c7c26788"/>
			<DO name="Trp" type="ENG_TransientPerformanceClassKind_3a0929ead0b3"/>
			<DO name="ScndTmms" type="ING_5310c7c26788"/>
			<DO name="ARtg" type="ASG_56d4e4906018"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="HzRtg" type="ASG_56d4e4906018"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<LNodeType id="TBW_XCBR_89c0f0517734" lnClass="XCBR">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="CBOpCap" type="ENS_BreakerOpCapabilityKind_a7b4f805508a"/>
			<DO name="CBTmms" type="ING_5310c7c26788"/>
			<DO name="ChaMotEna" type="SPC_84a31b7cbebc"/>
			<DO name="Dsc" type="SPS_c75d9c31c555"/>
			<DO name="DscDlTmms" type="ING_5310c7c26788"/>
			<DO name="EEHealth" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="EEName" type="DPL_57515f2a1dbc"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="LocKey" type="SPS_c75d9c31c555"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="MaxOpCap" type="INS_2bdd8d6b643e"/>
			<DO name="POWCap" type="ENS_POWWSwitchingCapabilityKind_ec98426522e6"/>
			<DO name="POWClsTmms" type="ING_5310c7c26788"/>
			<DO name="POWOpnTmms" type="ING_5310c7c26788"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="BlkCls" type="SPC_84a31b7cbebc"/>
			<DO name="BlkOpn" type="SPC_84a31b7cbebc"/>
			<DO name="Loc" type="SPS_c75d9c31c555"/>
			<DO name="OpCnt" type="INS_2bdd8d6b643e"/>
			<DO name="Pos" type="DPC_d5237c901349"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
			<DO name="LocSta" type="SPC_84a31b7cbebc"/>
			<DO name="NamPlt" type="LPL_7e8348300398"/>
		</LNodeType>
		<LNodeType id="TBW_XSWI_31b52c8cc41a" lnClass="XSWI">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="ChaMotEna" type="SPC_84a31b7cbebc"/>
			<DO name="Dsc" type="SPS_c75d9c31c555"/>
			<DO name="DscDlTmms" type="ING_5310c7c26788"/>
			<DO name="EEHealth" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="EEName" type="DPL_57515f2a1dbc"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="LocKey" type="SPS_c75d9c31c555"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="SwOpCap" type="ENS_POWWSwitchingCapabilityKind_ec98426522e6"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="BlkCls" type="SPC_84a31b7cbebc"/>
			<DO name="BlkOpn" type="SPC_84a31b7cbebc"/>
			<DO name="Loc" type="SPS_c75d9c31c555"/>
			<DO name="OpCnt" type="INS_2bdd8d6b643e"/>
			<DO name="Pos" type="DPC_d5237c901349"/>
			<DO name="SwTyp" type="ENS_SwitchFunctionKind_982843ae8e34"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
			<DO name="LocSta" type="SPC_84a31b7cbebc"/>
			<DO name="NamPlt" type="LPL_7e8348300398"/>
		</LNodeType>
		<LNodeType id="TBW_YLTC_064e78e92bce" lnClass="YLTC">
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="EEHealth" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="EEName" type="DPL_57515f2a1dbc"/>
			<DO name="CmdBlk" type="SPC_84a31b7cbebc"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Loc" type="SPS_c75d9c31c555"/>
			<DO name="LocKey" type="SPS_c75d9c31c555"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="OoStep" type="SPS_c75d9c31c555"/>
			<DO name="TapChg" type="BSC_3914a41c2a81"/>
			<DO name="TapPos" type="ISC_a25631252408"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="EndPosL" type="SPS_c75d9c31c555"/>
			<DO name="EndPosR" type="SPS_c75d9c31c555"/>
			<DO name="LTCCycAlm" type="SPS_c75d9c31c555"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
			<DO name="NamPlt" type="LPL_7e8348300398"/>
		</LNodeType>
		<LNodeType id="TBW_ZREA_aed71776a944" lnClass="ZREA">
			<DO name="EEHealth" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="EEName" type="DPL_57515f2a1dbc"/>
			<DO name="Health" type="ENS_HealthKind_0a3ce1f12b3d"/>
			<DO name="Mod" type="ENC_BehaviourModeKind_3e8feb68022d"/>
			<DO name="VRtg" type="ASG_56d4e4906018"/>
			<DO name="VARtg" type="ASG_56d4e4906018"/>
			<DO name="VArRtg" type="ASG_56d4e4906018"/>
			<DO name="ARtg" type="ASG_56d4e4906018"/>
			<DO name="Beh" type="ENS_BehaviourModeKind_6aa9be0f93cd"/>
			<DO name="Blk" type="SPS_c75d9c31c555"/>
			<DO name="NamPlt" type="LPL_7e8348300398"/>
			<DO name="Mir" type="SPS_c75d9c31c555"/>
		</LNodeType>
		<DOType id="ENS_BehaviourModeKind_6aa9be0f93cd" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="BehaviourModeKind_adee61c86652"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="BSC_3914a41c2a81" cdc="BSC">
			<DA name="persistent" fc="CF" dchg="true" bType="BOOLEAN"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="CtlModelKind_8c7a7d73bb09"/>
			<DA name="valWTr" fc="ST" dchg="true" bType="Struct" type="ValWithTrans_804cd1aa347f"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="maxVal" fc="CF" dchg="true" bType="INT8"/>
			<DA name="minVal" fc="CF" dchg="true" bType="INT8"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="blkEna" fc="BL" bType="BOOLEAN"/>
		</DOType>
		<DOType id="ISC_a25631252408" cdc="ISC">
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="CtlModelKind_8c7a7d73bb09"/>
			<DA name="maxVal" fc="CF" dchg="true" bType="INT8"/>
			<DA name="minVal" fc="CF" dchg="true" bType="INT8"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="valWTr" fc="ST" dchg="true" bType="Struct" type="ValWithTrans_804cd1aa347f"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="blkEna" fc="BL" bType="BOOLEAN"/>
		</DOType>
		<DOType id="SPC_84a31b7cbebc" cdc="SPC">
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="CtlModelKind_8c7a7d73bb09"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="blkEna" fc="BL" bType="BOOLEAN"/>
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
		</DOType>
		<DOType id="SPS_c75d9c31c555" cdc="SPS">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="blkEna" fc="BL" bType="BOOLEAN"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ASG_56d4e4906018" cdc="ASG">
			<DA name="setMag" fc="SE" bType="Struct" type="AnalogueValueCtl_9aaba54aa44e"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="maxVal" fc="CF" dchg="true" bType="Struct" type="AnalogueValue_cbe0962db719"/>
			<DA name="minVal" fc="CF" dchg="true" bType="Struct" type="AnalogueValue_cbe0962db719"/>
			<DA name="units" fc="CF" dchg="true" bType="Struct" type="Unit_dd093ea0ab20"/>
			<DA name="stepSize" fc="CF" dchg="true" bType="Struct" type="AnalogueValue_cbe0962db719"/>
		</DOType>
		<DOType id="ENC_BehaviourModeKind_3e8feb68022d" cdc="ENC">
			<DA name="stVal" fc="ST" dchg="true" bType="Enum" type="BehaviourModeKind_adee61c86652"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="CtlModelKind_8c7a7d73bb09"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENS_HealthKind_0a3ce1f12b3d" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="HealthKind_eab403fce91f"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType id="LPL_7e8348300398" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255"/>
			<DA name="swRev" fc="DC" bType="VisString255"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="paramRev" fc="ST" dchg="true" bType="INT32"/>
			<DA name="valRev" fc="ST" dchg="true" bType="INT32"/>
			<DA name="configRev" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="DPC_d5237c901349" cdc="DPC">
			<DA name="stVal" fc="ST" dchg="true" bType="Dbpos"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="CtlModelKind_8c7a7d73bb09"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="blkEna" fc="BL" bType="BOOLEAN"/>
		</DOType>
		<DOType id="ACT_0019427094af" cdc="ACT">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="operTmPhsC" fc="ST" bType="Timestamp"/>
			<DA name="operTmPhsA" fc="ST" bType="Timestamp"/>
			<DA name="operTmPhsB" fc="ST" bType="Timestamp"/>
			<DA name="phsA" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="phsB" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="phsC" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="neut" fc="ST" dchg="true" bType="BOOLEAN"/>
		</DOType>
		<DOType id="VSG_5f726fdae95e" cdc="VSG">
			<DA name="setVal" fc="SE" bType="VisString255"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ING_5310c7c26788" cdc="ING">
			<DA name="setVal" fc="SE" bType="INT32"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="units" fc="CF" dchg="true" bType="Struct" type="Unit_dd093ea0ab20"/>
		</DOType>
		<DOType id="DPL_57515f2a1dbc" cdc="DPL">
			<DA name="vendor" fc="DC" bType="VisString255"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="INS_2bdd8d6b643e" cdc="INS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="INT32"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="VSS_85bb0ba50c39" cdc="VSS">
			<DA name="stVal" fc="ST" dchg="true" bType="VisString255"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENS_ClockSourceKind_63165dbbdae2" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="ClockSourceKind_fe95f3da5f31"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENS_ClockSyncKind_19deb7532286" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="ClockSyncKind_9d26e6ca8a50"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType id="ENS_ClockSyncLockingKind_e4e04cb7f3d4" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="ClockSyncLockingKind_5c290eb34369"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="MV_13de9d50337d" cdc="MV">
			<DA name="mag" fc="MX" dchg="true" dupd="true" bType="Struct" type="AnalogueValue_cbe0962db719"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="instMag" fc="MX" bType="Struct" type="AnalogueValue_cbe0962db719"/>
			<DA name="smpRate" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="units" fc="CF" dchg="true" bType="Struct" type="Unit_dd093ea0ab20"/>
			<DA name="zeroDb" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="blkEna" fc="BL" bType="BOOLEAN"/>
		</DOType>
		<DOType id="CMV_46b7e5e8629e" cdc="CMV">
			<DA name="cVal" fc="MX" dchg="true" dupd="true" bType="Struct" type="Vector_70535592615a"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="angRef" fc="CF" dchg="true" bType="Enum" type="PhaseAngleReferenceKind_52695723409a"/>
			<DA name="units" fc="CF" dchg="true" bType="Struct" type="Unit_dd093ea0ab20"/>
			<DA name="instCVal" fc="MX" bType="Struct" type="Vector_70535592615a"/>
			<DA name="smpRate" fc="CF" dchg="true" bType="INT32U"/>
		</DOType>
		<DOType id="WYE_3fe5c22bf893" cdc="WYE">
			<SDO name="neut" type="CMV_46b7e5e8629e"/>
			<SDO name="phsA" type="CMV_46b7e5e8629e"/>
			<SDO name="phsB" type="CMV_46b7e5e8629e"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="angRef" fc="CF" dchg="true" bType="Enum" type="PhaseAngleReferenceKind_52695723409a"/>
			<SDO name="phsC" type="CMV_46b7e5e8629e"/>
			<SDO name="res" type="CMV_46b7e5e8629e"/>
		</DOType>
		<DOType id="ENG_PFSignKind_ffba400b2b78" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="PFSignKind_eb2778f809b0"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="DEL_06430f5cbff1" cdc="DEL">
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="angRef" fc="CF" dchg="true" bType="Enum" type="PhaseAngleReferenceKind_52695723409a"/>
			<SDO name="phsAB" type="CMV_46b7e5e8629e"/>
			<SDO name="phsBC" type="CMV_46b7e5e8629e"/>
			<SDO name="phsCA" type="CMV_46b7e5e8629e"/>
		</DOType>
		<DOType id="ACD_24061fde611c" cdc="ACD">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="dirGeneral" fc="ST" dchg="true" bType="Enum" type="FaultDirectionKind_4e454dd578e4"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="dirPhsA" fc="ST" dchg="true" bType="Enum" type="PhaseFaultDirectionKind_0b733f83d15b"/>
			<DA name="dirPhsB" fc="ST" dchg="true" bType="Enum" type="PhaseFaultDirectionKind_0b733f83d15b"/>
			<DA name="dirPhsC" fc="ST" dchg="true" bType="Enum" type="PhaseFaultDirectionKind_0b733f83d15b"/>
			<DA name="dirNeut" fc="ST" dchg="true" bType="Enum" type="PhaseFaultDirectionKind_0b733f83d15b"/>
		</DOType>
		<DOType id="CSG_0fed94484376" cdc="CSG">
			<DA name="numPts" fc="SE" bType="INT16U"/>
			<DA name="crvPts" fc="SE" bType="Struct" type="Point_a0bf26d46421"/>
			<DA name="xUnits" fc="CF" dchg="true" bType="Struct" type="Unit_dd093ea0ab20"/>
			<DA name="yUnits" fc="CF" dchg="true" bType="Struct" type="Unit_dd093ea0ab20"/>
			<DA name="maxPts" fc="CF" dchg="true" bType="INT16U"/>
			<DA name="xD" fc="DC" bType="VisString255"/>
			<DA name="yD" fc="DC" bType="VisString255"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="CURVE_7207d545376f" cdc="CURVE">
			<DA name="setCharact" fc="SE" bType="Enum" type="CurveCharKind_c202c9f086fa"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="setParA" fc="SE" bType="FLOAT32"/>
			<DA name="setParB" fc="SE" bType="FLOAT32"/>
			<DA name="setParC" fc="SE" bType="FLOAT32"/>
			<DA name="setParD" fc="SE" bType="FLOAT32"/>
			<DA name="setParE" fc="SE" bType="FLOAT32"/>
			<DA name="setParF" fc="SE" bType="FLOAT32"/>
		</DOType>
		<DOType id="CSD_33dd966b26af" cdc="CSD">
			<DA name="xUnits" fc="DC" bType="Struct" type="Unit_dd093ea0ab20"/>
			<DA name="xD" fc="DC" bType="VisString255"/>
			<DA name="yUnits" fc="DC" bType="Struct" type="Unit_dd093ea0ab20"/>
			<DA name="yD" fc="DC" bType="VisString255"/>
			<DA name="numPts" fc="DC" bType="INT16U"/>
			<DA name="crvPts" fc="DC" bType="Struct" type="Point_a0bf26d46421"/>
			<DA name="maxPts" fc="CF" dchg="true" bType="INT16U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENG_SOFEnablingModeKind_d08b7cc9fc07" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="SOFEnablingModeKind_820a23101ec8"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENG_DirectionModeKindf_4b9d0372eded" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="DirectionModeKind_e7e4eecbae32"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENG_TripModeKind_cb27456c6560" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="TripModeKind_36f3402da4bc"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENG_FailureDetectionKind_1f11cbd5942d" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="FailureDetectionKind_811a023ffc5c"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENG_RetripModeKind_0682c920e0c9" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="RetripModeKind_d06ef885cd22"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENG_InstrumentTransformerMeasurementRatingKind_c2774215aea8" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="InstrumentTransformerMeasurementRatingKind_8cd4f799acf3"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENG_InstrumentTransformerProtectionRatingKind_e755a497fe7a" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="InstrumentTransformerProtectionRatingKind_f5a56639efce"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="SAV_a0fc7f00f8bf" cdc="SAV">
			<DA name="instMag" fc="MX" bType="Struct" type="AnalogueValue_cbe0962db719"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="max" fc="CF" dchg="true" bType="Struct" type="AnalogueValue_cbe0962db719"/>
			<DA name="min" fc="CF" dchg="true" bType="Struct" type="AnalogueValue_cbe0962db719"/>
			<DA name="units" fc="CF" dchg="true" bType="Struct" type="Unit_dd093ea0ab20"/>
		</DOType>
		<DOType id="ENG_TransientPerformanceClassKind_3a0929ead0b3" cdc="ENG">
			<DA name="setVal" fc="SE" bType="Enum" type="TransientPerformanceClassKind_551c3ef31b95"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENS_BreakerOpCapabilityKind_a7b4f805508a" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="BreakerOpCapabilityKind_ed1e9101d92e"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENS_POWWSwitchingCapabilityKind_ec98426522e6" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="POWSwitchingCapabilityKind_bb9c70e20b74"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType id="ENS_SwitchFunctionKind_982843ae8e34" cdc="ENS">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="SwitchFunctionKind_6b0ab34c8427"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DAType id="Unit_dd093ea0ab20">
			<Private type="compas:instance-type">Unit</Private>
			<BDA bType="Enum" name="multiplier" type="MultiplierKind_bebe5604f08c"/>
			<BDA bType="Enum" name="SIUnit" type="SIUnitKind_9d5bce47bcc5"/>
		</DAType>
		<DAType id="AnalogueValue_cbe0962db719">
			<Private type="compas:instance-type">AnalogueValue</Private>
			<BDA bType="FLOAT32" name="f"/>
			<BDA bType="INT32" name="i"/>
		</DAType>
		<DAType id="Vector_70535592615a">
			<Private type="compas:instance-type">Vector</Private>
			<BDA bType="Struct" name="ang" type="AnalogueValue_cbe0962db719"/>
			<BDA bType="Struct" name="mag" type="AnalogueValue_cbe0962db719"/>
		</DAType>
		<DAType id="AnalogueValueCtl_9aaba54aa44e">
			<Private type="compas:instance-type">AnalogueValueCtl</Private>
			<BDA bType="FLOAT32" name="f"/>
			<BDA bType="INT32" name="i"/>
		</DAType>
		<DAType id="ValWithTrans_804cd1aa347f">
			<Private type="compas:instance-type">ValWithTrans</Private>
			<BDA name="posVal" bType="INT8"/>
			<BDA name="transInd" bType="BOOLEAN"/>
		</DAType>
		<DAType id="Point_a0bf26d46421">
			<Private type="compas:instance-type">Point</Private>
			<BDA name="xVal" bType="FLOAT32"/>
			<BDA name="yVal" bType="FLOAT32"/>
		</DAType>
		<EnumType id="CtlModelKind_8c7a7d73bb09">
			<Private type="compas:instance-type">CtlModelKind</Private>
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
			<EnumVal ord="2">sbo-with-normal-security</EnumVal>
			<EnumVal ord="3">direct-with-enhanced-security</EnumVal>
			<EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
		</EnumType>
		<EnumType id="BehaviourModeKind_adee61c86652">
			<Private type="compas:instance-type">BehaviourModeKind</Private>
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="HealthKind_eab403fce91f">
			<Private type="compas:instance-type">HealthKind</Private>
			<EnumVal ord="1">Ok</EnumVal>
			<EnumVal ord="2">Warning</EnumVal>
			<EnumVal ord="3">Alarm</EnumVal>
		</EnumType>
		<EnumType id="OriginatorCategoryKind_bd23320152b5">
			<Private type="compas:instance-type">OriginatorCategoryKind</Private>
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
		<EnumType id="SIUnitKind_9d5bce47bcc5">
			<Private type="compas:instance-type">SIUnitKind</Private>
			<EnumVal ord="2">m</EnumVal>
			<EnumVal ord="3">kg</EnumVal>
			<EnumVal ord="4">s</EnumVal>
			<EnumVal ord="5">A</EnumVal>
			<EnumVal ord="6">K</EnumVal>
			<EnumVal ord="7">mol</EnumVal>
			<EnumVal ord="8">cd</EnumVal>
			<EnumVal ord="9">deg</EnumVal>
			<EnumVal ord="10">rad</EnumVal>
			<EnumVal ord="11">sr</EnumVal>
			<EnumVal ord="21">Gy</EnumVal>
			<EnumVal ord="22">Bq</EnumVal>
			<EnumVal ord="23">°C</EnumVal>
			<EnumVal ord="24">Sv</EnumVal>
			<EnumVal ord="25">F</EnumVal>
			<EnumVal ord="26">C</EnumVal>
			<EnumVal ord="27">S</EnumVal>
			<EnumVal ord="28">H</EnumVal>
			<EnumVal ord="29">V</EnumVal>
			<EnumVal ord="30">ohm</EnumVal>
			<EnumVal ord="31">J</EnumVal>
			<EnumVal ord="32">N</EnumVal>
			<EnumVal ord="33">Hz</EnumVal>
			<EnumVal ord="34">lx</EnumVal>
			<EnumVal ord="35">Lm</EnumVal>
			<EnumVal ord="36">Wb</EnumVal>
			<EnumVal ord="37">T</EnumVal>
			<EnumVal ord="38">W</EnumVal>
			<EnumVal ord="39">Pa</EnumVal>
			<EnumVal ord="41">m²</EnumVal>
			<EnumVal ord="42">m³</EnumVal>
			<EnumVal ord="43">m/s</EnumVal>
			<EnumVal ord="44">m/s²</EnumVal>
			<EnumVal ord="45">m³/s</EnumVal>
			<EnumVal ord="46">m/m³</EnumVal>
			<EnumVal ord="47">M</EnumVal>
			<EnumVal ord="48">kg/m³</EnumVal>
			<EnumVal ord="49">m²/s</EnumVal>
			<EnumVal ord="50">W/m K</EnumVal>
			<EnumVal ord="51">J/K</EnumVal>
			<EnumVal ord="52">ppm</EnumVal>
			<EnumVal ord="53">1/s</EnumVal>
			<EnumVal ord="54">rad/s</EnumVal>
			<EnumVal ord="55">W/m²</EnumVal>
			<EnumVal ord="56">J/m²</EnumVal>
			<EnumVal ord="57">S/m</EnumVal>
			<EnumVal ord="58">K/s</EnumVal>
			<EnumVal ord="59">Pa/s</EnumVal>
			<EnumVal ord="60">J/kg K</EnumVal>
			<EnumVal ord="61">VA</EnumVal>
			<EnumVal ord="63">VAr</EnumVal>
			<EnumVal ord="65">cos(phi)</EnumVal>
			<EnumVal ord="66">Vs</EnumVal>
			<EnumVal ord="67">V²</EnumVal>
			<EnumVal ord="68">As</EnumVal>
			<EnumVal ord="69">A²</EnumVal>
			<EnumVal ord="70">A²t</EnumVal>
			<EnumVal ord="71">VAh</EnumVal>
			<EnumVal ord="72">Wh</EnumVal>
			<EnumVal ord="73">VArh</EnumVal>
			<EnumVal ord="74">V/Hz</EnumVal>
			<EnumVal ord="75">Hz/s</EnumVal>
			<EnumVal ord="76">char</EnumVal>
			<EnumVal ord="77">char/s</EnumVal>
			<EnumVal ord="78">kgm²</EnumVal>
			<EnumVal ord="79">dB</EnumVal>
			<EnumVal ord="80">J/Wh</EnumVal>
			<EnumVal ord="81">W/s</EnumVal>
			<EnumVal ord="82">l/s</EnumVal>
			<EnumVal ord="83">dBm</EnumVal>
			<EnumVal ord="84">h</EnumVal>
			<EnumVal ord="85">min</EnumVal>
			<EnumVal ord="86">Ohm/m</EnumVal>
			<EnumVal ord="87">percent/s</EnumVal>
			<EnumVal ord="88">A/V</EnumVal>
			<EnumVal ord="89">A/Vs</EnumVal>
		</EnumType>
		<EnumType id="MultiplierKind_bebe5604f08c">
			<Private type="compas:instance-type">MultiplierKind</Private>
			<EnumVal ord="-6">µ</EnumVal>
			<EnumVal ord="-24">y</EnumVal>
			<EnumVal ord="-21">z</EnumVal>
			<EnumVal ord="-18">a</EnumVal>
			<EnumVal ord="-15">f</EnumVal>
			<EnumVal ord="-12">p</EnumVal>
			<EnumVal ord="-9">n</EnumVal>
			<EnumVal ord="-3">m</EnumVal>
			<EnumVal ord="-2">c</EnumVal>
			<EnumVal ord="-1">d</EnumVal>
			<EnumVal ord="1">da</EnumVal>
			<EnumVal ord="2">h</EnumVal>
			<EnumVal ord="3">k</EnumVal>
			<EnumVal ord="6">M</EnumVal>
			<EnumVal ord="9">G</EnumVal>
			<EnumVal ord="12">T</EnumVal>
			<EnumVal ord="15">P</EnumVal>
			<EnumVal ord="18">E</EnumVal>
			<EnumVal ord="21">Z</EnumVal>
			<EnumVal ord="24">Y</EnumVal>
		</EnumType>
		<EnumType id="ClockSourceKind_fe95f3da5f31">
			<Private type="compas:instance-type">ClockSourceKind</Private>
			<EnumVal ord="1">Unknown</EnumVal>
			<EnumVal ord="2">SNTP</EnumVal>
			<EnumVal ord="3">PTP</EnumVal>
			<EnumVal ord="4">IRIG-B</EnumVal>
			<EnumVal ord="5">Substation internal</EnumVal>
		</EnumType>
		<EnumType id="ClockSyncKind_9d26e6ca8a50">
			<Private type="compas:instance-type">ClockSyncKind</Private>
			<EnumVal ord="1">InternalClock</EnumVal>
			<EnumVal ord="2">LocalAreaClock</EnumVal>
			<EnumVal ord="3">GlobalAreaClock</EnumVal>
		</EnumType>
		<EnumType id="ClockSyncLockingKind_5c290eb34369">
			<Private type="compas:instance-type">ClockSyncLockingKind</Private>
			<EnumVal ord="1">Locked</EnumVal>
			<EnumVal ord="2">Unlocked10s</EnumVal>
			<EnumVal ord="3">Unlocked100s</EnumVal>
			<EnumVal ord="4">Unlocked1000s</EnumVal>
			<EnumVal ord="5">UnlockedMoreThan1000s</EnumVal>
		</EnumType>
		<EnumType id="PhaseReferenceKind_86b2419de44a">
			<Private type="compas:instance-type">PhaseReferenceKind</Private>
			<EnumVal ord="0">A</EnumVal>
			<EnumVal ord="1">B</EnumVal>
			<EnumVal ord="2">C</EnumVal>
			<EnumVal ord="3">Synchrophasor</EnumVal>
		</EnumType>
		<EnumType id="PhaseAngleReferenceKind_52695723409a">
			<Private type="compas:instance-type">PhaseAngleReferenceKind</Private>
			<EnumVal ord="0">Va</EnumVal>
			<EnumVal ord="1">Vb</EnumVal>
			<EnumVal ord="2">Vc</EnumVal>
			<EnumVal ord="3">Aa</EnumVal>
			<EnumVal ord="4">Ab</EnumVal>
			<EnumVal ord="5">Ac</EnumVal>
			<EnumVal ord="6">Vab</EnumVal>
			<EnumVal ord="7">Vbc</EnumVal>
			<EnumVal ord="8">Vca</EnumVal>
			<EnumVal ord="9">Vother</EnumVal>
			<EnumVal ord="10">Aother</EnumVal>
			<EnumVal ord="11">Synchrophasor</EnumVal>
		</EnumType>
		<EnumType id="PFSignKind_eb2778f809b0">
			<Private type="compas:instance-type">PFSignKind</Private>
			<EnumVal ord="1">IEC</EnumVal>
			<EnumVal ord="2">EEI</EnumVal>
		</EnumType>
		<EnumType id="FaultDirectionKind_4e454dd578e4">
			<Private type="compas:instance-type">FaultDirectionKind</Private>
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
			<EnumVal ord="3">both</EnumVal>
		</EnumType>
		<EnumType id="PhaseFaultDirectionKind_0b733f83d15b">
			<Private type="compas:instance-type">PhaseFaultDirectionKind</Private>
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
		</EnumType>
		<EnumType id="CurveCharKind_c202c9f086fa">
			<Private type="compas:instance-type">CurveCharKind</Private>
			<EnumVal ord="0">None</EnumVal>
			<EnumVal ord="1">ANSI Extremely Inverse</EnumVal>
			<EnumVal ord="2">ANSI Very Inverse</EnumVal>
			<EnumVal ord="4">ANSI Moderate Inverse</EnumVal>
			<EnumVal ord="5">ANSI Definite Time</EnumVal>
			<EnumVal ord="10">IEC Very Inverse</EnumVal>
			<EnumVal ord="11">IEC Inverse</EnumVal>
			<EnumVal ord="12">IEC Extremely Inverse</EnumVal>
			<EnumVal ord="15">IEC Definite Time</EnumVal>
			<EnumVal ord="16">Reserved</EnumVal>
			<EnumVal ord="17">Polynom 1</EnumVal>
			<EnumVal ord="18">Polynom 2</EnumVal>
			<EnumVal ord="19">Polynom 3</EnumVal>
			<EnumVal ord="20">Polynom 4</EnumVal>
			<EnumVal ord="21">Polynom 5</EnumVal>
			<EnumVal ord="22">Polynom 6</EnumVal>
			<EnumVal ord="23">Polynom 7</EnumVal>
			<EnumVal ord="24">Polynom 8</EnumVal>
			<EnumVal ord="25">Polynom 9</EnumVal>
			<EnumVal ord="26">Polynom 10</EnumVal>
			<EnumVal ord="27">Polynom 11</EnumVal>
			<EnumVal ord="28">Polynom 12</EnumVal>
			<EnumVal ord="29">Polynom 13</EnumVal>
			<EnumVal ord="30">Polynom 14</EnumVal>
			<EnumVal ord="31">Polynom 15</EnumVal>
			<EnumVal ord="32">Polynom 16</EnumVal>
			<EnumVal ord="33">Multiline 1</EnumVal>
			<EnumVal ord="34">Multiline 2</EnumVal>
			<EnumVal ord="35">Multiline 3</EnumVal>
			<EnumVal ord="36">Multiline 4</EnumVal>
			<EnumVal ord="37">Multiline 5</EnumVal>
			<EnumVal ord="38">Multiline 6</EnumVal>
			<EnumVal ord="39">Multiline 7</EnumVal>
			<EnumVal ord="40">Multiline 8</EnumVal>
			<EnumVal ord="41">Multiline 9</EnumVal>
			<EnumVal ord="42">Multiline 10</EnumVal>
			<EnumVal ord="43">Multiline 11</EnumVal>
			<EnumVal ord="44">Multiline 12</EnumVal>
			<EnumVal ord="45">Multiline 13</EnumVal>
			<EnumVal ord="46">Multiline 14</EnumVal>
			<EnumVal ord="47">Multiline 15</EnumVal>
			<EnumVal ord="48">Multiline 16</EnumVal>
		</EnumType>
		<EnumType id="SOFEnablingModeKind_820a23101ec8">
			<Private type="compas:instance-type">SOFEnablingModeKind</Private>
			<EnumVal ord="1">SwitchCommand</EnumVal>
			<EnumVal ord="2">BreakerClosed</EnumVal>
			<EnumVal ord="3">VoltageAndCurrentLevel</EnumVal>
		</EnumType>
		<EnumType id="SOFOperationModeKind_6f520f884663">
			<Private type="compas:instance-type">SOFOperationModeKind</Private>
			<EnumVal ord="1">ExternalSignal</EnumVal>
			<EnumVal ord="2">VoltageAndCurrent</EnumVal>
			<EnumVal ord="3">ExternalSignal or VoltageAndCurrent</EnumVal>
		</EnumType>
		<EnumType id="DirectionModeKind_e7e4eecbae32">
			<Private type="compas:instance-type">DirectionModeKind</Private>
			<EnumVal ord="1">NonDirectional</EnumVal>
			<EnumVal ord="2">Forward</EnumVal>
			<EnumVal ord="3">Reverse</EnumVal>
		</EnumType>
		<EnumType id="TripModeKind_36f3402da4bc">
			<Private type="compas:instance-type">TripModeKind</Private>
			<EnumVal ord="1">3 phase tripping</EnumVal>
			<EnumVal ord="2">1 or 3 phase tripping</EnumVal>
			<EnumVal ord="3">specific</EnumVal>
			<EnumVal ord="4">1 phase tripping</EnumVal>
		</EnumType>
		<EnumType id="FailureDetectionKind_811a023ffc5c">
			<Private type="compas:instance-type">FailureDetectionKind</Private>
			<EnumVal ord="1">Current</EnumVal>
			<EnumVal ord="2">Breaker Status</EnumVal>
			<EnumVal ord="3">Both current and breaker status</EnumVal>
			<EnumVal ord="4">Other</EnumVal>
		</EnumType>
		<EnumType id="RetripModeKind_d06ef885cd22">
			<Private type="compas:instance-type">RetripModeKind</Private>
			<EnumVal ord="1">Off</EnumVal>
			<EnumVal ord="2">Without Check</EnumVal>
			<EnumVal ord="3">With Current Check</EnumVal>
			<EnumVal ord="4">With Breaker Status Check</EnumVal>
			<EnumVal ord="5">With Current and Breaker Status Check</EnumVal>
			<EnumVal ord="6">Other Checks</EnumVal>
		</EnumType>
		<EnumType id="InstrumentTransformerProtectionRatingKind_f5a56639efce">
			<Private type="compas:instance-type">InstrumentTransformerProtectionRatingKind</Private>
			<EnumVal ord="1">1</EnumVal>
			<EnumVal ord="2">2</EnumVal>
			<EnumVal ord="3">3</EnumVal>
			<EnumVal ord="4">5</EnumVal>
			<EnumVal ord="5">6</EnumVal>
			<EnumVal ord="6">10</EnumVal>
		</EnumType>
		<EnumType id="InstrumentTransformerMeasurementRatingKind_8cd4f799acf3">
			<Private type="compas:instance-type">InstrumentTransformerMeasurementRatingKind</Private>
			<EnumVal ord="7">1</EnumVal>
			<EnumVal ord="8">3</EnumVal>
			<EnumVal ord="9">5</EnumVal>
			<EnumVal ord="1">0.05</EnumVal>
			<EnumVal ord="2">0.1</EnumVal>
			<EnumVal ord="3">0.2</EnumVal>
			<EnumVal ord="4">0.2S</EnumVal>
			<EnumVal ord="5">0.5</EnumVal>
			<EnumVal ord="6">0.5S</EnumVal>
		</EnumType>
		<EnumType id="TransientPerformanceClassKind_551c3ef31b95">
			<Private type="compas:instance-type">TransientPerformanceClassKind</Private>
			<EnumVal ord="1">Unknown</EnumVal>
			<EnumVal ord="2">P</EnumVal>
			<EnumVal ord="3">PR</EnumVal>
			<EnumVal ord="4">PX</EnumVal>
			<EnumVal ord="5">PXR</EnumVal>
			<EnumVal ord="6">TPX</EnumVal>
			<EnumVal ord="7">TPY</EnumVal>
			<EnumVal ord="8">TPZ</EnumVal>
			<EnumVal ord="9">TPE</EnumVal>
			<EnumVal ord="10">TPS</EnumVal>
		</EnumType>
		<EnumType id="BreakerOpCapabilityKind_ed1e9101d92e">
			<Private type="compas:instance-type">BreakerOpCapabilityKind</Private>
			<EnumVal ord="1">None</EnumVal>
			<EnumVal ord="2">Open</EnumVal>
			<EnumVal ord="3">Close-Open</EnumVal>
			<EnumVal ord="4">Open-Close-Open</EnumVal>
			<EnumVal ord="5">Close-Open-Close-Open</EnumVal>
			<EnumVal ord="6">Open-Close-Open-Close-Open</EnumVal>
			<EnumVal ord="7">more</EnumVal>
		</EnumType>
		<EnumType id="POWSwitchingCapabilityKind_bb9c70e20b74">
			<Private type="compas:instance-type">POWSwitchingCapabilityKind</Private>
			<EnumVal ord="1">None</EnumVal>
			<EnumVal ord="2">Close</EnumVal>
			<EnumVal ord="3">Open</EnumVal>
			<EnumVal ord="4">Close and Open</EnumVal>
		</EnumType>
		<EnumType id="SwitchFunctionKind_6b0ab34c8427">
			<Private type="compas:instance-type">SwitchFunctionKind</Private>
			<EnumVal ord="1">Load Break</EnumVal>
			<EnumVal ord="2">Disconnector</EnumVal>
			<EnumVal ord="3">Earthing Switch</EnumVal>
			<EnumVal ord="4">High Speed Earthing Switch</EnumVal>
		</EnumType>
		<EnumType id="SwitchingCapabilityKind_3f21061090ee">
			<Private type="compas:instance-type">SwitchingCapabilityKind</Private>
			<EnumVal ord="1">None</EnumVal>
			<EnumVal ord="2">Open</EnumVal>
			<EnumVal ord="3">Close</EnumVal>
			<EnumVal ord="4">Open and Close</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>`
