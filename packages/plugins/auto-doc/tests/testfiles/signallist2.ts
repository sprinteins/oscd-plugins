export const signalListScd2 = `
<SCL>
  <Substation name="substation1">
    <VoltageLevel name="voltagelevel1">
      <Bay name="bay1">
        <LNode iedName="IED1" ldInst="LD1" lnClass="LC1" lnInst="1" lnType="LNType1" prefix="" />
      </Bay>
    </VoltageLevel>
  </Substation>
  <DataTypeTemplates>
    <LNodeType id="LNType1">
      <DO name="do1" type="DOType1" />
    </LNodeType>
    <LNodeType id="LNType2"></LNodeType>

    <DOType id="DOType1" cdc="CDC1">
      <DO name="do2" type="DOType2" />
    </DOType>
    <DOType id="DOType2" cdc="CDC2">
      <DO name="do3" type="DOType3" />
    </DOType>
    <DOType id="DOType3" cdc="CDC3">
      <DA name="da1" type="DAType2" />
    </DOType>

    <DAType id="DAType2">
      <DA name="da2" type="DAType3" />
    </DAType>
    <DAType id="DAType3">
      <DA name="da3" bType="BOOLEAN" />
    </DAType>
  </DataTypeTemplates>
  <IED name="IED1">
    <AccessPoint name="AP1">
      <Server>
        <LDevice inst="LD1">
          <LN0 lnClass="LLN0">
            <GSEControl name="control1" datSet="dataset1" />
            <DataSet name="dataset1">
              <FCDA ldInst="LD1" lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC1" prefix="" />
              <FCDA ldInst="LD1" lnClass="LC1" lnInst="1" doName="do2" daName="da2" fc="FC1" prefix="" />
            </DataSet>
          </LN0>
          <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1"></LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="IED2">
    <AccessPoint name="AP2">
      <Server>
        <LDevice inst="LD2">
          <LN lnClass="LC2" inst="1" lnType="LNType2">
            <Inputs>
              <ExtRef iedName="IED1" serviceType="GOOSE" ldInst="LD1" lnClass="LC1" desc="signal1"
                lnInst="1" prefix="" doName="do1.do2.do3" daName="da1.da2.da3" srcLDInst="LD1"
                srcPrefix="" srcLNClass="LLN0" srcCBName="control1" />
            </Inputs>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
</SCL>
`
