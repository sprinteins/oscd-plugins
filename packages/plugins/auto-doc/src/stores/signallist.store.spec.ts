import { describe, it, expect, beforeEach } from 'vitest';
import { writable, type Writable } from 'svelte/store';
import { signallistStore } from './signallist.store';
import { pluginStore } from './plugin.store';
import { SignalType } from './signallist.store.d';
import type {MessagePublisherFilter, MessageSubscriberFilter, MessagePublisher} from '@/stores/signallist.store.d'

import { signalListScd1 } from '../testfiles/signallist1';


describe('Signallist', () => {
  let xmlDocument: Writable<XMLDocument | undefined>;

  beforeEach(() => {
    xmlDocument = writable<XMLDocument | undefined>(undefined);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(signalListScd1, 'application/xml');
    xmlDocument.set(xmlDoc);
    pluginStore.init({
      newXMLDocument: xmlDoc,
      newPluginHostElement: document.createElement('SCL'),
      newEditCount: 0
    });
  });

  it('should extract message publishers from XML document', () => {
    const {pdfRows, invaliditiesReports} = signallistStore.getPublishingLogicalDevices();

    expect(invaliditiesReports).toEqual([]);

    const ied1GoosePublisher = {
        matchedFilteredValuesForPdf: [
          [ 
            "IED2, IED3",
            "",
            ""
          ],
        ],
        matchedSubscribers: {
          GOOSE: [ "IED2", "IED3" ],
          Report: [],
          SMV: []
        },
        publisher: {
          Bay: "bay1",
          IEDName: "IED1",
          M_text: "signal1",
          UW: "substation1",
          VoltageLevel: "voltagelevel1",
          signalType: "GOOSE",
          targetIEDName: "IED2",
          dataObjectInformation: {
            AttributeType: "BType1",
            CommonDataClass: "CDC1",
            DataAttributeName: "da1",
            DataObjectName: "do1",
            FunctionalConstraint: "FC1",
          },
          logicalNodeInformation: {
            IEDName: "IED1",
            LogicalDeviceInstance: "LD1",
            LogicalNodeClass: "LC1",
            LogicalNodeInstance: "1",
            LogicalNodePrefix: "",
            LogicalNodeType: "LNType1",
          }
        }
    };

    const ied1SMVPublisher = {
      matchedFilteredValuesForPdf: [
          [ 
            "",
            "",
            "IED4"
          ],
        ],
        matchedSubscribers: {
          GOOSE: [],
          Report: [],
          SMV: [ "IED4" ]
        },
        publisher: {
          Bay: "bay1",
          IEDName: "IED1",
          M_text: "signal2",
          UW: "substation1",
          VoltageLevel: "voltagelevel1",
          signalType: "SMV",
          targetIEDName: "IED4",
          dataObjectInformation: {
            AttributeType: "BType1",
            CommonDataClass: "CDC3",
            DataAttributeName: "da3",
            DataObjectName: "do3",
            FunctionalConstraint: "FC1",
          },
          logicalNodeInformation: {
            IEDName: "IED1",
            LogicalDeviceInstance: "LD2",
            LogicalNodeClass: "LC1",
            LogicalNodeInstance: "1",
            LogicalNodePrefix: "",
            LogicalNodeType: "LNType3",
          }
        }
    };

    const ied1RportPublisher = {
      matchedFilteredValuesForPdf: [
          [ 
            "",
            "IED5",
            ""
          ],
        ],
        matchedSubscribers: {
          GOOSE: [],
          Report: [ "IED5" ],
          SMV: []
        },
        publisher: {
          Bay: "bay2",
          IEDName: "IED1",
          M_text: "signal3",
          UW: "substation1",
          VoltageLevel: "voltagelevel1",
          signalType: "Report",
          targetIEDName: "IED5",
          dataObjectInformation: {
            AttributeType: "BType1",
            CommonDataClass: "CDC5",
            DataAttributeName: "da1",
            DataObjectName: "do1",
            FunctionalConstraint: "FC2",
          },
          logicalNodeInformation: {
            IEDName: "IED1",
            LogicalDeviceInstance: "LD3",
            LogicalNodeClass: "LC1",
            LogicalNodeInstance: "1",
            LogicalNodePrefix: "S",
            LogicalNodeType: "LNType4",
          }
        }
    };

    expect(pdfRows).toEqual([
      ied1GoosePublisher,
      ied1SMVPublisher,
      ied1RportPublisher
    ]);
  });

});