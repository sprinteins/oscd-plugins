export const sclMockB = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
  <Header id="report-vs-mms-repro" version="1" revision="1" toolID="code-review-repro" nameStructure="IEDName">
    <Text>CE repro: published MMS vs ExtRef Report vs both vs lone IED</Text>
  </Header>

  <!-- ========== 1) published-only: ReportControl + ClientLN ========== -->
  <IED name="PubMms" type="DummyIED" manufacturer="Dummy" configVersion="1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="Dummy.LLN0">
            <ReportControl name="RcbMmsOnly" rptID="PubMms/LD0/LLN0/RcbMmsOnly" confRev="1" buffered="true">
              <RptEnabled max="1">
                <ClientLN iedName="ClientMms" apRef="P1" ldInst="LD0" lnClass="LLN0" lnInst="1"/>
              </RptEnabled>
            </ReportControl>
          </LN0>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="ClientMms" type="DummyIED" manufacturer="Dummy" configVersion="1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="Dummy.LLN0"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>

  <!-- ========== 2) received-only: ExtRef serviceType="Report" ========== -->
  <IED name="SrcReport" type="DummyIED" manufacturer="Dummy" configVersion="1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="Dummy.LLN0">
            <ReportControl name="RcbExtRef" rptID="SrcReport/LD0/LLN0/RcbExtRef" confRev="1" buffered="true"/>
          </LN0>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="DstReport" type="DummyIED" manufacturer="Dummy" configVersion="1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="Dummy.LLN0">
            <Inputs>
              <ExtRef iedName="SrcReport" serviceType="Report" ldInst="LD0" lnClass="LLN0" doName="Mod" daName="stVal" srcLDInst="LD0" srcLNClass="LLN0" srcCBName="RcbExtRef"/>
            </Inputs>
          </LN0>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>

  <!-- ========== 3) both paths for the same report ========== -->
  <IED name="BothPub" type="DummyIED" manufacturer="Dummy" configVersion="1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="Dummy.LLN0">
            <ReportControl name="RcbBoth" rptID="BothPub/LD0/LLN0/RcbBoth" confRev="1" buffered="true">
              <RptEnabled max="1">
                <ClientLN iedName="BothSub" apRef="P1" ldInst="LD0" lnClass="LLN0" lnInst="1"/>
              </RptEnabled>
            </ReportControl>
          </LN0>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="BothSub" type="DummyIED" manufacturer="Dummy" configVersion="1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="Dummy.LLN0">
            <Inputs>
              <ExtRef iedName="BothPub" serviceType="Report" ldInst="LD0" lnClass="LLN0" doName="Mod" daName="stVal" srcLDInst="LD0" srcLNClass="LLN0" srcCBName="RcbBoth"/>
            </Inputs>
          </LN0>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>

  <!-- ========== 4) no connections (Auto-Doc detached-IED repro) ========== -->
  <IED name="LoneIed" type="DummyIED" manufacturer="Dummy" configVersion="1">
    <AccessPoint name="P1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="Dummy.LLN0"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
</SCL>`
