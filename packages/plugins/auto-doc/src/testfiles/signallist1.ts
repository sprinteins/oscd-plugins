export const signalListScd1 = `
<SCL>
  <Substation name="substation1">
    <VoltageLevel name="voltagelevel1">
      <Bay name="bay1">
        <LNode iedName="IED1" ldInst="LD1" lnClass="LC1" lnInst="1" lnType="LNType1" prefix="" />
        <LNode iedName="IED1" ldInst="LD2" lnClass="LC1" lnInst="1" lnType="LNType1" prefix="" />
      </Bay>
      <Bay name="bay2">
        <ConductingEquipment name="conducting1">
          <LNode iedName="IED1" ldInst="LD3" lnClass="LC1" lnInst="1" lnType="LNType1" prefix="S" />
        </ConductingEquipment>
      </Bay>
    </VoltageLevel>
  </Substation>
  <DataTypeTemplates>
    <LNodeType id="LNType1">
      <DO name="do1" type="DOType1" />
      <DO name="do2" type="DOType2" />
    </LNodeType>
    <LNodeType id="LNType2"></LNodeType>
    <LNodeType id="LNType3">
      <DO name="do3" type="DOType3" />
      <DO name="do4" type="DOType4" />
    </LNodeType>
    <LNodeType id="LNType4">
      <DO name="do1" type="DOType5" />
    </LNodeType>
    <DOType id="DOType1" cdc="CDC1">
      <DA name="da1" bType="BType1" />
    </DOType>
    <DOType id="DOType2" cdc="CDC2">
      <DA name="da2" bType="BType1" />
    </DOType>
    <DOType id="DOType3" cdc="CDC3">
      <DA name="da3" bType="BType1" />
    </DOType>
    <DOType id="DOType4" cdc="CDC4">
      <DA name="da4" bType="BType1" />
    </DOType>
    <DOType id="DOType5" cdc="CDC5">
      <DA name="da1" bType="BType1" />
    </DOType>

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

            <SampledValueControl datSet="dataset2" name="control2">
            </SampledValueControl>
            <DataSet name="dataset2">
              <FCDA ldInst="LD2" lnClass="LC1" lnInst="1" doName="do3" daName="da3" fc="FC1" prefix="" />
              <FCDA ldInst="LD2" lnClass="LC1" lnInst="1" doName="do4" daName="da4" fc="FC1" prefix="" />
            </DataSet>
          </LN0>
          <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1"></LN>
          <LN inst="2" lnClass="LC1" prefix="" lnType="LNType4"></LN>
        </LDevice>
        <LDevice inst="LD2">
          <LN inst="1" lnClass="LC1" prefix="" lnType="LNType3"></LN>
        </LDevice>
      </Server>
    </AccessPoint>
    <AccessPoint name="AP12">
      <Server>
        <LDevice inst="LD3">
          <LN0 lnClass="LLN0">
            <ReportControl name="control3" datSet="dataset1" />
            <DataSet name="dataset1">
              <FCDA ldInst="LD3" lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC2" prefix="S" />
              <FCDA ldInst="LD3" lnClass="LC1" lnInst="1" doName="do2" daName="da2" fc="FC2" prefix="S" />
            </DataSet>
          </LN0>
          <LN inst="1" lnClass="LC1" prefix="S" lnType="LNType4"></LN>
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
                lnInst="1" prefix="" doName="do1" daName="da1" srcLDInst="LD1"
                srcPrefix="" srcLNClass="LLN0" srcCBName="control1" />
            </Inputs>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="IED3">
    <AccessPoint name="AP3">
      <Server>
        <LDevice inst="LD3">
          <LN lnClass="LC2" inst="1" lnType="LNType2">
            <Inputs>
              <ExtRef iedName="IED1" serviceType="GOOSE" ldInst="LD1" lnClass="LC1" desc="signal1"
                lnInst="1" prefix="" doName="do1" daName="da1" srcLDInst="LD1"
                srcPrefix="" srcLNClass="LLN0" srcCBName="control1" />
            </Inputs>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="IED4">
    <AccessPoint name="AP4">
      <Server>
        <LDevice inst="LD1">
          <LN lnClass="LC2" inst="1" lnType="LNType2">
            <Inputs>
              <ExtRef iedName="IED1" serviceType="SMV" ldInst="LD2" lnClass="LC1"  desc="signal2"
                lnInst="1" prefix="" doName="do3" daName="da3" srcLDInst="LD1"
                srcPrefix="" srcLNClass="LLN0" srcCBName="control2" />
            </Inputs>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="IED5">
    <AccessPoint name="AP5">
      <Server>
        <LDevice inst="LD1">
          <LN lnClass="LC2" inst="1" lnType="LNType2">
            <Inputs>
              <ExtRef iedName="IED1" serviceType="Report" ldInst="LD3" lnClass="LC1" desc="signal3"
                lnInst="1" prefix="S" doName="do1" daName="da1" srcLDInst="LD3"
                srcPrefix="" srcLNClass="LLN0" srcCBName="control3" />
            </Inputs>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
</SCL>
`
