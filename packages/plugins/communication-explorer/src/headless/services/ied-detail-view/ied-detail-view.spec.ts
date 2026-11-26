import { describe, expect, it } from 'vitest'
import {
	ConnectionTypeDirection,
	createServiceItems,
	filterVisibleServiceItems
} from '.'

describe('GIVEN connected IED relations', () => {
	const relations = {
		subscribedFrom: [
			{
				node: { label: 'Publisher' },
				serviceType: 'GOOSE' as const,
				serviceTypeLabel: 'trip'
			}
		],
		publishedTo: [
			{
				node: { label: 'Subscriber' },
				serviceType: 'MMS' as const,
				serviceTypeLabel: 'report'
			}
		]
	}

	it('WHEN service items are created THEN each relation receives its display direction', () => {
		expect(createServiceItems(relations)).toEqual([
			{
				node: { label: 'Publisher' },
				serviceType: 'GOOSE',
				serviceTypeLabel: 'trip',
				connectionDirection: ConnectionTypeDirection.OUTGOING
			},
			{
				node: { label: 'Subscriber' },
				serviceType: 'MMS',
				serviceTypeLabel: 'report',
				connectionDirection: ConnectionTypeDirection.INCOMING
			}
		])
	})
})

describe('GIVEN IED service items', () => {
	const services = [
		{
			node: { label: 'Publisher' },
			serviceType: 'GOOSE' as const,
			connectionDirection: ConnectionTypeDirection.OUTGOING
		},
		{
			node: { label: 'Subscriber' },
			serviceType: 'MMS' as const,
			connectionDirection: ConnectionTypeDirection.INCOMING
		}
	]

	it('WHEN direction and message filters match THEN only matching items remain visible', () => {
		expect(
			filterVisibleServiceItems(services, {
				selectedMessageTypes: ['GOOSE'],
				incomingConnections: true,
				outgoingConnections: true
			})
		).toEqual([services[0]])
	})

	it('WHEN a service direction is hidden THEN that service is not visible', () => {
		expect(
			filterVisibleServiceItems(services, {
				selectedMessageTypes: ['GOOSE', 'MMS'],
				incomingConnections: false,
				outgoingConnections: true
			})
		).toEqual([services[0]])
	})
})
