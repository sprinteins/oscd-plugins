export const duplicateTypesScd = `
	<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
		<Substation name="S1">
			<VoltageLevel name="V1">
				<Bay name="Bay1">
					<LNode iedName="None" lnClass="XCBR" lnInst="1" lnType="ln-a" />
				</Bay>
			</VoltageLevel>
		</Substation>
		<IED name="IED1">
			<AccessPoint name="AP1">
				<Server>
					<LDevice inst="LD1" desc="Logical device">
						<LN0 lnClass="LLN0" inst="" lnType="ln-uses" />
						<LN lnClass="XCBR" inst="1" lnType="ln-a" />
						<LN lnClass="XCBR" inst="2" lnType="ln-b" />
					</LDevice>
				</Server>
			</AccessPoint>
		</IED>
		<DataTypeTemplates>
			<LNodeType id="ln-a" lnClass="XCBR"><DO name="Pos" type="do-a" /></LNodeType>
			<LNodeType id="ln-b" lnClass="XCBR"><DO name="Pos" type="do-a" /></LNodeType>
			<LNodeType id="ln-uses" lnClass="LLN0">
				<DO name="PosA" type="do-a" desc="keep">
					<Private type="vendor"><value>preserved</value></Private>
				</DO>
				<DO name="PosB" type="do-b" />
			</LNodeType>
			<DOType id="do-a" cdc="SPS">
				<DA name="stVal" bType="BOOLEAN" fc="ST" />
				<DA name="struct" bType="Struct" type="da-a" fc="ST" />
				<DA name="state" bType="Enum" type="enum-a" fc="ST" />
			</DOType>
			<DOType id="do-b" cdc="SPS">
				<DA name="stVal" bType="BOOLEAN" fc="ST" />
				<DA name="struct" bType="Struct" type="da-a" fc="ST" />
				<DA name="state" bType="Enum" type="enum-a" fc="ST" />
			</DOType>
			<DOType id="do-c" cdc="SPS">
				<DA name="stVal" bType="BOOLEAN" fc="ST" />
				<DA name="struct" bType="Struct" type="da-a" fc="ST" />
				<DA name="state" bType="Enum" type="enum-a" fc="ST" />
			</DOType>
			<DOType id="do-unique" cdc="DPS"><DA name="stVal" bType="BOOLEAN" fc="ST" /></DOType>
			<DAType id="da-a"><BDA name="value" bType="INT32" /></DAType>
			<DAType id="da-b"><BDA name="value" bType="INT32" /></DAType>
			<EnumType id="enum-a"><EnumVal ord="0">Open</EnumVal></EnumType>
			<EnumType id="enum-b"><EnumVal ord="0">Open</EnumVal></EnumType>
		</DataTypeTemplates>
	</SCL>
`
