import { describe, it, expect, beforeEach } from 'vitest';
import { get, writable, type Writable } from 'svelte/store';
import { signallistStore } from './signellist.store';
import { pluginStore } from './plugin.store';

enum SignalType {
    GOOSE = 'GOOSE',
    MMS = 'MMS',
    SVM = 'SVM',
    UNKOWN = 'UNKOWN',
}

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
                <DOI name="InsAlm">
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
  });

  it('should extract message publishers from XML document', () => {
    const {messagePublishers ,invaliditiesReports} = signallistStore.findPublishingLogicalDevices();

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

    const { messageSubscribers, invaliditiesReports } = signallistStore.findSubscribingLogicalDevices(messagePublishers);

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

    const {messagePublishers ,invaliditiesReports} = signallistStore.findPublishingLogicalDevices();

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
                <DOI name="InsAlm">
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

    const {messagePublishers ,invaliditiesReports} = signallistStore.findPublishingLogicalDevices();

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
                <DOI name="InsAlm">
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

    const {messagePublishers ,invaliditiesReports} = signallistStore.findPublishingLogicalDevices();

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
                <DOI name="InsAlm">
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

    const {messagePublishers ,invaliditiesReports} = signallistStore.findPublishingLogicalDevices();

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
                <DOI name="InsAlm">
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

    const {messagePublishers ,invaliditiesReports} = signallistStore.findPublishingLogicalDevices();

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

  it('should add invalidities to the report if LN0 is not found', () => {
    const parser = new DOMParser();
    const xmlString = `
      <SCL>
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
                <DOI name="InsAlm">
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
              <!-- LN0 is missing -->
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

    const { messageSubscribers, invaliditiesReports } = signallistStore.findSubscribingLogicalDevices(messagePublishers);

    expect(messageSubscribers).toEqual([]);
    expect(invaliditiesReports).toEqual([
      {
        IEDName: 'IED2',
        LogicalNodeInformation: {
          IEDName: '',
          LogicalDeviceInstance: '',
          LogicalNodePrefix: '',
          LogicalNodeClass: '',
          LogicalNodeInstance: '',
          LogicalNodeType: ''
        },
        invalidities: ['LN0 Element not found']
      }
    ]);
  });

});