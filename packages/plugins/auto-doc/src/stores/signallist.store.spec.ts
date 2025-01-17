import { describe, it, expect, beforeEach } from 'vitest';
import { writable, type Writable } from 'svelte/store';
import { signallistStore } from './signallist.store';
import { pluginStore } from './plugin.store';
import { SignalType } from './signallist.store.d';


describe('Signallist', () => {
  let xmlDocument: Writable<XMLDocument | undefined>;

  beforeEach(() => {
    xmlDocument = writable<XMLDocument | undefined>(undefined);
    const parser = new DOMParser();
    const xmlString = `
      <SCL>
        <DataTypeTemplates>
          <LNodeType id="LNType1">
            <DO name="do1" type="DOType1"/>
            <DO name="do2" type="DOType2"/>
          </LNodeType>
          <DOType id="DOType1" cdc="CDC1">
            <DA name="da1" bType="BType1"/>
          </DOType>
          <DOType id="DOType2" cdc="CDC2">
            <DA name="da2" bType="BType1"/>
          </DOType>
        </DataTypeTemplates>
        <IED name="IED1">
          <AccessPoint>
            <LDevice inst="LD1">
              <LN0>
                <GSEControl />
                <DataSet>
                  <FCDA lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC1" prefix=""/>
                  <FCDA lnClass="LC1" lnInst="1" doName="do2" daName="da2" fc="FC1" prefix=""/>
                </DataSet>
                <DOI>
                  <DAI desc="Description1"/>
                </DOI>
              </LN0>
              <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1">
                <DOI name="do1">
                  <DAI name="da1" desc="LS SF6 Verlust">
                    <Val/>
                  </DAI>
                </DOI>
                <DOI name="do2">
                  <DAI name="da2" desc="Abgangserder QC3-Befehl blockiert">
                    <Val/>
                  </DAI>
                </DOI>
              </LN>
            </LDevice>
          </AccessPoint>
        </IED>
        <IED name="IED2">
          <AccessPoint>
            <LDevice inst="LD2">
              <LN0>
                <Inputs>
                  <ExtRef iedName="IED1" serviceType="GOOSE" ldInst="LD1" lnClass="LC1" lnInst="1" prefix="" doName="do1" daName="da1" srcLDInst="LD1" srcPrefix="" srcLNClass="LC1" srcCBName="GSEControl"/>
                </Inputs>
              </LN0>
            </LDevice>
          </AccessPoint>
        </IED>
        <IED name="IED3">
          <AccessPoint>
            <LDevice inst="LD3">
              <LN0>
                <Inputs>
                  <ExtRef iedName="IED1" serviceType="GOOSE" ldInst="LD1" lnClass="LC1" lnInst="1" prefix="" doName="do1" daName="da1" srcLDInst="LD1" srcPrefix="" srcLNClass="LC1" srcCBName="GSEControl"/>
                </Inputs>
              </LN0>
            </LDevice>
          </AccessPoint>
        </IED>
      </SCL>`;
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL')
    });
  });

  it('should extract message publishers from XML document', () => {
    const {messagePublishers ,invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(messagePublishers).toEqual([
      {
        M_text: 'LS SF6 Verlust',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      },
      {
        M_text: 'Abgangserder QC3-Befehl blockiert',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do2',
          DataAttributeName: 'da2',
          CommonDataClass: 'CDC2',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ]);
  });

  it('should find subscribing logical devices', () => {
    const messagePublishers = [
      {
        M_text: 'LS SF6 Verlust',
        signalType: SignalType.GOOSE,
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ];

    const { messageSubscribers, invaliditiesReports } = signallistStore.getSubscribingLogicalDevices(messagePublishers);

    expect(messageSubscribers).toEqual([
      {
        IDEName: 'IED2',
        ExtRef: {
          iedName: 'IED1',
          serviceType: 'GOOSE',
          ldInst: 'LD1',
          lnClass: 'LC1',
          lnInst: '1',
          prefix: '',
          doName: 'do1',
          daName: 'da1',
          srcLDInst: 'LD1',
          srcPrefix: '',
          srcLNClass: 'LC1',
          srcCBName: 'GSEControl'
        }
      },
      {
        IDEName: 'IED3',
        ExtRef: {
          iedName: 'IED1',
          serviceType: 'GOOSE',
          ldInst: 'LD1',
          lnClass: 'LC1',
          lnInst: '1',
          prefix: '',
          doName: 'do1',
          daName: 'da1',
          srcLDInst: 'LD1',
          srcPrefix: '',
          srcLNClass: 'LC1',
          srcCBName: 'GSEControl'
        }
      }
    ]);

    expect(invaliditiesReports).toEqual([]);
  });

  it('should return an empty array if no publishing logical devices are present', () => {
    const parser = new DOMParser();
    const xmlString = `<SCL>
    <DataTypeTemplates/>
    </SCL>`;
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL')
    });

    const {messagePublishers ,invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(messagePublishers).toEqual([]);
  });

  it('should add invalidities to the report if LNodeType is not found', () => {
    const parser = new DOMParser();
    const xmlString = `
      <SCL>
        <DataTypeTemplates>
          <!-- LNodeType is missing -->
          <DOType id="DOType1" cdc="CDC1">
            <DA name="da1" btype="BType1"/>
          </DOType>
        </DataTypeTemplates>
        <IED name="IED1">
          <AccessPoint>
            <LDevice inst="LD1">
              <LN0>
                <GSEControl />
                <DataSet>
                  <FCDA lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC1" prefix=""/>
                </DataSet>
                <DOI>
                  <DAI desc="Description1"/>
                </DOI>
              </LN0>
              <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1">
                <DOI name="do1">
                  <DAI name="da1" desc="LS SF6 Verlust">
                    <Val/>
                  </DAI>
                </DOI>
              </LN>
            </LDevice>
          </AccessPoint>
        </IED>
      </SCL>`;
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL')
    });

    const {messagePublishers ,invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(messagePublishers).toEqual([]);
    expect(invaliditiesReports).toEqual([
      {
        IEDName: 'IED1',
        LogicalNodeInformation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        invalidities: ['LNodeType with id LNType1 not found in DataTypeTemplates']
      }
    ]);
  });

  it('should add invalidities to the report if DO is not found', () => {
    const parser = new DOMParser();
    const xmlString = `
      <SCL>
        <DataTypeTemplates>
          <LNodeType id="LNType1">
            <!-- DO is missing -->
          </LNodeType>
          <DOType id="DOType1" cdc="CDC1">
            <DA name="da1" btype="BType1"/>
          </DOType>
        </DataTypeTemplates>
        <IED name="IED1">
          <AccessPoint>
            <LDevice inst="LD1">
              <LN0>
                <GSEControl />
                <DataSet>
                  <FCDA lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC1" prefix=""/>
                </DataSet>
                <DOI>
                  <DAI desc="Description1"/>
                </DOI>
              </LN0>
              <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1">
                <DOI name="do1">
                  <DAI name="da1" desc="LS SF6 Verlust">
                    <Val/>
                  </DAI>
                </DOI>
              </LN>
            </LDevice>
          </AccessPoint>
        </IED>
      </SCL>`;
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL')
    });

    const {messagePublishers ,invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(messagePublishers).toEqual([]);
    expect(invaliditiesReports).toEqual([
      {
        IEDName: 'IED1',
        LogicalNodeInformation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        invalidities: ['DO with name do1 not found in LNodeType with id LNType1']
      }
    ]);
  });

  it('should add invalidities to the report if DOType is not found', () => {
    const parser = new DOMParser();
    const xmlString = `
      <SCL>
        <DataTypeTemplates>
          <LNodeType id="LNType1">
            <DO name="do1" type="DOType1"/>
          </LNodeType>
          <!-- DOType is missing -->
        </DataTypeTemplates>
        <IED name="IED1">
          <AccessPoint>
            <LDevice inst="LD1">
              <LN0>
                <GSEControl />
                <DataSet>
                  <FCDA lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC1" prefix=""/>
                </DataSet>
                <DOI>
                  <DAI desc="Description1"/>
                </DOI>
              </LN0>
              <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1">
                <DOI name="do1">
                  <DAI name="da1" desc="LS SF6 Verlust">
                    <Val/>
                  </DAI>
                </DOI>
              </LN>
            </LDevice>
          </AccessPoint>
        </IED>
      </SCL>`;
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL')
    });

    const {messagePublishers ,invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(messagePublishers).toEqual([]);
    expect(invaliditiesReports).toEqual([
      {
        IEDName: 'IED1',
        LogicalNodeInformation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        invalidities: ['DOType with id DOType1 not found in DataTypeTemplates']
      }
    ]);
  });

  it('should add invalidities to the report if DA is not found', () => {
    const parser = new DOMParser();
    const xmlString = `
      <SCL>
        <DataTypeTemplates>
          <LNodeType id="LNType1">
            <DO name="do1" type="DOType1"/>
          </LNodeType>
          <DOType id="DOType1" cdc="CDC1">
            <!-- DA is missing -->
          </DOType>
        </DataTypeTemplates>
        <IED name="IED1">
          <AccessPoint>
            <LDevice inst="LD1">
              <LN0>
                <GSEControl />
                <DataSet>
                  <FCDA lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC1" prefix=""/>
                </DataSet>
                <DOI>
                  <DAI desc="Description1"/>
                </DOI>
              </LN0>
              <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1">
                <DOI name="do1">
                  <DAI name="da1" desc="LS SF6 Verlust">
                    <Val/>
                  </DAI>
                </DOI>
              </LN>
            </LDevice>
          </AccessPoint>
        </IED>
      </SCL>`;
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL')
    });

    const {messagePublishers ,invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(messagePublishers).toEqual([]);
    expect(invaliditiesReports).toEqual([
      {
        IEDName: 'IED1',
        LogicalNodeInformation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        invalidities: ['DA with name da1 not found in DOType with id DOType1']
      }
    ]);
  });

  it('should retrun empty array if FCDA doName is not in DOI name', () => {
    xmlDocument = writable<XMLDocument | undefined>(undefined);
    const parser = new DOMParser();
    const xmlString = `
      <SCL>
        <DataTypeTemplates>
          <LNodeType id="LNType1">
            <DO name="do1" type="DOType1"/>
            <DO name="do2" type="DOType2"/>
          </LNodeType>
          <DOType id="DOType1" cdc="CDC1">
            <DA name="da1" bType="BType1"/>
          </DOType>
          <DOType id="DOType2" cdc="CDC2">
            <DA name="da2" bType="BType1"/>
          </DOType>
        </DataTypeTemplates>
        <IED name="IED1">
          <AccessPoint>
            <LDevice inst="LD1">
              <LN0>
                <GSEControl />
                <DataSet>
                  <FCDA lnClass="LC1" lnInst="1" doName="do1" daName="da1" fc="FC1" prefix=""/>
                  <FCDA lnClass="LC1" lnInst="1" doName="do2" daName="da2" fc="FC1" prefix=""/>
                </DataSet>
                <DOI>
                  <DAI desc="Description1"/>
                </DOI>
              </LN0>
              <LN inst="1" lnClass="LC1" prefix="" lnType="LNType1">
                <DOI name="other do name">
                  <DAI name="da1" desc="LS SF6 Verlust">
                    <Val/>
                  </DAI>
                </DOI>
              </LN>
            </LDevice>
          </AccessPoint>
        </IED>
        <IED name="IED2">
          <AccessPoint>
            <LDevice inst="LD2">
              <LN0>
                <Inputs>
                  <ExtRef iedName="IED1" serviceType="GOOSE" ldInst="LD1" lnClass="LC1" lnInst="1" prefix="" doName="do1" daName="da1" srcLDInst="LD1" srcPrefix="" srcLNClass="LC1" srcCBName="GSEControl"/>
                </Inputs>
              </LN0>
            </LDevice>
          </AccessPoint>
        </IED>
      </SCL>`;
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL')
    });

    const {messagePublishers ,invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(messagePublishers).toEqual([]);
    expect(invaliditiesReports).toEqual([]);

  });

  it('should filter message publishers based on M_text regex', () => {
    const filter = { M_text: /LS SF6 Verlust/ };
    const { messagePublishers } = signallistStore.getPublishingLogicalDevices(filter);

    expect(messagePublishers).toEqual([
      {
        M_text: 'LS SF6 Verlust',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ]);
  });

  it('should filter message publishers based on signalType regex', () => {
    const filter = { signalType: /GOOSE/ };
    const { messagePublishers } = signallistStore.getPublishingLogicalDevices(filter);

    expect(messagePublishers).toEqual([
      {
        M_text: 'LS SF6 Verlust',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      },
      {
        M_text: 'Abgangserder QC3-Befehl blockiert',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do2',
          DataAttributeName: 'da2',
          CommonDataClass: 'CDC2',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ]);
  });

  it('should filter message publishers based on IEDName regex', () => {
    const filter = { IEDName: /IED1/ };
    const { messagePublishers } = signallistStore.getPublishingLogicalDevices(filter);

    expect(messagePublishers).toEqual([
      {
        M_text: 'LS SF6 Verlust',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      },
      {
        M_text: 'Abgangserder QC3-Befehl blockiert',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do2',
          DataAttributeName: 'da2',
          CommonDataClass: 'CDC2',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ]);
  });

  it('should filter message publishers based on logicalNodeInofrmation regex', () => {
    const filter = { logicalNodeInofrmation: { LogicalDeviceInstance: /LD1/ } };
    const { messagePublishers } = signallistStore.getPublishingLogicalDevices(filter);

    expect(messagePublishers).toEqual([
      {
        M_text: 'LS SF6 Verlust',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      },
      {
        M_text: 'Abgangserder QC3-Befehl blockiert',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do2',
          DataAttributeName: 'da2',
          CommonDataClass: 'CDC2',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ]);
  });

  it('should filter message publishers based on dataObjectInformation regex', () => {
    const filter = { dataObjectInformation: { DataObjectName: /do1/ } };
    const { messagePublishers } = signallistStore.getPublishingLogicalDevices(filter);

    expect(messagePublishers).toEqual([
      {
        M_text: 'LS SF6 Verlust',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ]);
  });

  it('should filter message publishers based on multiple regex filters', () => {
    const filter = {
      M_text: /LS SF6 Verlust/,
      signalType: /GOOSE/,
      IEDName: /IED1/,
      logicalNodeInofrmation: {
        LogicalDeviceInstance: /LD1/
      },
      dataObjectInformation: {
        DataObjectName: /do1/
      }
    };
    const { messagePublishers } = signallistStore.getPublishingLogicalDevices(filter);

    expect(messagePublishers).toEqual([
      {
        M_text: 'LS SF6 Verlust',
        signalType: 'GOOSE',
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ]);
  });

  it('should filter message subscribers based on IDEName regex', () => {
    const messagePublishers = [
      {
        M_text: 'LS SF6 Verlust',
        signalType: SignalType.GOOSE,
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ];

    const filter = { IDEName: /IED2/ };
    const { messageSubscribers } = signallistStore.getSubscribingLogicalDevices(messagePublishers, filter);

    expect(messageSubscribers).toEqual([
      {
        IDEName: 'IED2',
        ExtRef: {
          iedName: 'IED1',
          serviceType: 'GOOSE',
          ldInst: 'LD1',
          lnClass: 'LC1',
          lnInst: '1',
          prefix: '',
          doName: 'do1',
          daName: 'da1',
          srcLDInst: 'LD1',
          srcPrefix: '',
          srcLNClass: 'LC1',
          srcCBName: 'GSEControl'
        }
      }
    ]);
  });

  it('should filter message subscribers based on serviceType regex', () => {
    const messagePublishers = [
      {
        M_text: 'LS SF6 Verlust',
        signalType: SignalType.GOOSE,
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ];

    const filter = { serviceType: /GOOSE/ };
    const { messageSubscribers } = signallistStore.getSubscribingLogicalDevices(messagePublishers, filter);

    expect(messageSubscribers).toEqual([
      {
        IDEName: 'IED2',
        ExtRef: {
          iedName: 'IED1',
          serviceType: 'GOOSE',
          ldInst: 'LD1',
          lnClass: 'LC1',
          lnInst: '1',
          prefix: '',
          doName: 'do1',
          daName: 'da1',
          srcLDInst: 'LD1',
          srcPrefix: '',
          srcLNClass: 'LC1',
          srcCBName: 'GSEControl'
        }
      },
      {
        IDEName: 'IED3',
        ExtRef: {
          iedName: 'IED1',
          serviceType: 'GOOSE',
          ldInst: 'LD1',
          lnClass: 'LC1',
          lnInst: '1',
          prefix: '',
          doName: 'do1',
          daName: 'da1',
          srcLDInst: 'LD1',
          srcPrefix: '',
          srcLNClass: 'LC1',
          srcCBName: 'GSEControl'
        }
      }
    ]);
  });

  it('should filter message subscribers based on multiple regex filters', () => {
    const messagePublishers = [
      {
        M_text: 'LS SF6 Verlust',
        signalType: SignalType.GOOSE,
        IEDName: 'IED1',
        logicalNodeInofrmation: {
          IEDName: 'IED1',
          LogicalDeviceInstance: 'LD1',
          LogicalNodePrefix: '',
          LogicalNodeClass: 'LC1',
          LogicalNodeInstance: '1',
          LogicalNodeType: 'LNType1'
        },
        dataObjectInformation: {
          DataObjectName: 'do1',
          DataAttributeName: 'da1',
          CommonDataClass: 'CDC1',
          AttributeType: 'BType1',
          FunctionalConstraint: 'FC1'
        }
      }
    ];

    const filter = {
      IDEName: /IED3/,
      serviceType: /GOOSE/
    };
    const { messageSubscribers } = signallistStore.getSubscribingLogicalDevices(messagePublishers, filter);

    expect(messageSubscribers).toEqual([
      {
        IDEName: 'IED3',
        ExtRef: {
          iedName: 'IED1',
          serviceType: 'GOOSE',
          ldInst: 'LD1',
          lnClass: 'LC1',
          lnInst: '1',
          prefix: '',
          doName: 'do1',
          daName: 'da1',
          srcLDInst: 'LD1',
          srcPrefix: '',
          srcLNClass: 'LC1',
          srcCBName: 'GSEControl'
        }
      }
    ]);
  });


});