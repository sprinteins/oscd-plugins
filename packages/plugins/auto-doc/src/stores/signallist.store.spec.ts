import type {
	MessagePublisher,
	MessagePublisherFilter,
	MessageSubscriberFilter
} from '@/stores/signallist.store.d'
import { type Writable, writable } from 'svelte/store'
import { beforeEach, describe, expect, it } from 'vitest'
import { pluginStore } from './plugin.store'
import { signallistStore } from './signallist.store'
import { SignalType } from './signallist.store.d'

import { signalListScd1 } from '../../tests/testfiles/signallist1'
import { signalListScd2 } from '../../tests/testfiles/signallist2'

describe('Signallist', () => {
	beforeEach(() => {
		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(signalListScd1, 'application/xml')

		pluginStore.init({
			newXMLDocument: xmlDoc,
			newPluginHostElement: document.createElement('SCL'),
			newEditCount: 0
		})
	})

	it('should extract message publishers from XML document', () => {
		const { pdfRows, invaliditiesReports } =
			signallistStore.getPublishingLogicalDevices()

		expect(invaliditiesReports).toEqual([])

		const ied1GoosePublisher = {
			matchedFilteredValuesForPdf: [['IED2, IED3', '', '']],
			matchedSubscribers: {
				GOOSE: ['IED2', 'IED3'],
				Report: [],
				SMV: []
			},
			publisher: {
				Bay: 'bay1',
				IEDName: 'IED1',
				M_text: 'signal1',
				UW: 'substation1',
				VoltageLevel: 'voltagelevel1',
				signalType: 'GOOSE',
				targetIEDName: 'IED2',
				dataObjectInformation: {
					AttributeType: 'BType1',
					CommonDataClass: 'CDC1',
					DataAttributeName: 'da1',
					DataObjectName: 'do1',
					FunctionalConstraint: 'FC1'
				},
				logicalNodeInformation: {
					IEDName: 'IED1',
					LogicalDeviceInstance: 'LD1',
					LogicalNodeClass: 'LC1',
					LogicalNodeInstance: '1',
					LogicalNodePrefix: '',
					LogicalNodeType: 'LNType1'
				}
			}
		}

		const ied1SMVPublisher = {
			matchedFilteredValuesForPdf: [['', '', 'IED4']],
			matchedSubscribers: {
				GOOSE: [],
				Report: [],
				SMV: ['IED4']
			},
			publisher: {
				Bay: 'bay1',
				IEDName: 'IED1',
				M_text: 'signal2',
				UW: 'substation1',
				VoltageLevel: 'voltagelevel1',
				signalType: 'SMV',
				targetIEDName: 'IED4',
				dataObjectInformation: {
					AttributeType: 'BType1',
					CommonDataClass: 'CDC3',
					DataAttributeName: 'da3',
					DataObjectName: 'do3',
					FunctionalConstraint: 'FC1'
				},
				logicalNodeInformation: {
					IEDName: 'IED1',
					LogicalDeviceInstance: 'LD2',
					LogicalNodeClass: 'LC1',
					LogicalNodeInstance: '1',
					LogicalNodePrefix: '',
					LogicalNodeType: 'LNType3'
				}
			}
		}

		const ied1ReportPublisher = {
			matchedFilteredValuesForPdf: [['', 'IED5', '']],
			matchedSubscribers: {
				GOOSE: [],
				Report: ['IED5'],
				SMV: []
			},
			publisher: {
				Bay: 'bay2',
				IEDName: 'IED1',
				M_text: 'signal3',
				UW: 'substation1',
				VoltageLevel: 'voltagelevel1',
				signalType: 'Report',
				targetIEDName: 'IED5',
				dataObjectInformation: {
					AttributeType: 'BType1',
					CommonDataClass: 'CDC5',
					DataAttributeName: 'da1',
					DataObjectName: 'do1',
					FunctionalConstraint: 'FC2'
				},
				logicalNodeInformation: {
					IEDName: 'IED1',
					LogicalDeviceInstance: 'LD3',
					LogicalNodeClass: 'LC1',
					LogicalNodeInstance: '1',
					LogicalNodePrefix: 'S',
					LogicalNodeType: 'LNType4'
				}
			}
		}

		expect(pdfRows).toEqual([
			ied1GoosePublisher,
			ied1SMVPublisher,
			ied1ReportPublisher
		])
	})

	describe('should handle nested data objects and attributes', () => {
		beforeEach(() => {
			const parser = new DOMParser()
			const xmlDoc = parser.parseFromString(
				signalListScd2,
				'application/xml'
			)

			pluginStore.init({
				newXMLDocument: xmlDoc,
				newPluginHostElement: document.createElement('SCL'),
				newEditCount: 0
			})
		})

		it('should map nested DOs and DAs', () => {
			const { pdfRows, invaliditiesReports } =
				signallistStore.getPublishingLogicalDevices()

			expect(invaliditiesReports).toEqual([])

			const ied1GoosePublisher = {
				matchedFilteredValuesForPdf: [['IED2', '', '']],
				matchedSubscribers: {
					GOOSE: ['IED2'],
					Report: [],
					SMV: []
				},
				publisher: {
					Bay: 'bay1',
					IEDName: 'IED1',
					M_text: 'signal1',
					UW: 'substation1',
					VoltageLevel: 'voltagelevel1',
					signalType: 'GOOSE',
					targetIEDName: 'IED2',
					dataObjectInformation: {
						AttributeType: 'BOOLEAN',
						CommonDataClass: 'CDC1.CDC2.CDC3',
						DataAttributeName: 'da1.da2.da3',
						DataObjectName: 'do1.do2.do3',
						FunctionalConstraint: 'FC1'
					},
					logicalNodeInformation: {
						IEDName: 'IED1',
						LogicalDeviceInstance: 'LD1',
						LogicalNodeClass: 'LC1',
						LogicalNodeInstance: '1',
						LogicalNodePrefix: '',
						LogicalNodeType: 'LNType1'
					}
				}
			}

			expect(pdfRows).toEqual([ied1GoosePublisher])
		})
	})
})
