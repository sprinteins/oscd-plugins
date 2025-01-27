import { expect, describe, it } from 'vitest'
import { IEDService } from './service.ied'
import { xmlStr } from '../../../testfiles/simple_v5'
// TYPES
import type { ExtRefElement } from '../types.scd-queries'
import type { IED } from './types.ied'

// TODO (test are not working yet, migrating from uses-case)

describe('UCCommunicationInformation', () => {
	it('IEDCommInfos', () => {
		//
		// Arrange
		//
		const parser = new DOMParser()
		const doc = parser.parseFromString(
			xmlStr,
			'text/xml'
		) as unknown as Element

		const iedService = new IEDService(doc)

		// Note: use this if you want to debug the document in browser
		// globalThis.scd = doc

		//
		// Action
		//
		const iedCommInfos: IED.CommunicationInfo[] =
			iedService.IEDCommunicationInfos()

		//
		// Assert
		//
		const expectedIEDCommunicationInfos: IED.CommunicationInfo[] = [
			{
				iedName: 'IED2',
				iedDetails: {
					logicalNodes: [],
					dataObjects: [],
					dataAttributes: []
				},
				published: [
					{
						id: 'IED2/CBSW/XSWI/SwitchGearBRCB_1',
						name: 'ReportCb',
						targetIEDName: 'IED1',
						serviceType: 'MMS',
						serviceCbName: '',
						serviceDatSet: ''
					},
					{
						id: 'IED2/CBSW/XSWI/SwitchGearBRCB_2',
						name: 'ReportCb',
						targetIEDName: 'IED1',
						serviceType: 'MMS',
						serviceCbName: '',
						serviceDatSet: ''
					}
				],
				received: []
			}
			// {
			// 	iedName: "IED2",
			// 	published: [
			// 		gseCont
			// 	],
			// }
		]

		// we don't check it yet
		for (const iedCommInfo of iedCommInfos) {
			iedCommInfo.received = []
		}
		expectedIEDCommunicationInfos.forEach((expectedInfo) =>
			expect(iedCommInfos).toContainEqual(expectedInfo)
		)
	})

	describe('groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName', () => {
		const parser = new DOMParser()
		const doc = parser.parseFromString(
			xmlStr,
			'text/xml'
		) as unknown as Element
		// const scdQueries = new SCDQueries(doc)
		// const ucci = new UCCommunicationInformation(scdQueries)
		const iedService = new IEDService(doc)

		type TestCase = {
			desc: string
			elements: ExtRefElement[]
			expectedGroups: IED.ReceivedMessage[]
		}

		const testCases: TestCase[] = [
			{
				desc: 'find a message',
				elements: [
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB'
					})
				],
				expectedGroups: [
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB'
								}),
								datSet: ''
							}
						]
					}
				]
			},
			{
				desc: 'group data of the same message',
				elements: [
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB',
						daName: 'q'
					}),
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB',
						daName: 'stVal'
					})
				],
				expectedGroups: [
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB',
									daName: 'q'
								}),
								datSet: ''
							},
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB',
									daName: 'stVal'
								}),
								datSet: ''
							}
						]
					}
				]
			},
			{
				desc: 'separate data of different messages',
				elements: [
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_1'
					}),
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_2'
					})
				],
				expectedGroups: [
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_1',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB_1'
								}),
								datSet: ''
							}
						]
					},
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_2',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB_2'
								}),
								datSet: ''
							}
						]
					}
				]
			},
			{
				desc: 'group the data of the same message and separate data of different messages',
				elements: [
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB'
					}),
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB'
					}),
					makeInputExtRefElement({
						iedName: 'IED2',
						serviceType: 'SMV',
						srcCBName: 'MSVCB01'
					}),
					makeInputExtRefElement({
						iedName: 'IED2',
						serviceType: 'SMV',
						srcCBName: 'MSVCB01'
					})
				],
				expectedGroups: [
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB'
								}),
								datSet: ''
							},
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB'
								}),
								datSet: ''
							}
						]
					},
					{
						iedName: 'IED2',
						serviceType: 'SMV',
						srcCBName: 'MSVCB01',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED2',
									serviceType: 'SMV',
									srcCBName: 'MSVCB01'
								}),
								datSet: ''
							},
							{
								...makeInputExtRefElement({
									iedName: 'IED2',
									serviceType: 'SMV',
									srcCBName: 'MSVCB01'
								}),
								datSet: ''
							}
						]
					}
				]
			},
			{
				desc: 'seperate data of different messages even if same service type',
				elements: [
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_1'
					}),
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_2'
					}),
					makeInputExtRefElement({
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_3'
					})
				],
				expectedGroups: [
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_1',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB_1'
								}),
								datSet: ''
							}
						]
					},
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_2',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB_2'
								}),
								datSet: ''
							}
						]
					},
					{
						iedName: 'IED1',
						serviceType: 'GOOSE',
						srcCBName: 'GCB_3',
						datSet: '',
						data: [
							{
								...makeInputExtRefElement({
									iedName: 'IED1',
									serviceType: 'GOOSE',
									srcCBName: 'GCB_3'
								}),
								datSet: ''
							}
						]
					}
				]
			}
		]

		testCases.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, () => {
				const messages = new IEDService(
					new Element()
				).groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(
					tc.elements
				)
				expect(messages).toEqual(tc.expectedGroups)
			})
		}
	})
})

const defaultExtRef: ExtRefElement = {
	iedName: 'string',
	serviceType: 'string',
	ldInst: 'string',
	lnClass: 'string',
	lnInst: 'string',
	prefix: 'string',
	doName: 'string',
	daName: 'string',
	srcLDInst: 'string',
	srcPrefix: 'string',
	srcCBName: 'string',
	intAddr: 'string',
	element: document.createElement('ExtRef')
}
function makeInputExtRefElement(extRef: Partial<ExtRefElement>) {
	return { ...defaultExtRef, ...extRef }
}
