import { writable } from 'svelte/store'
// SERVICES
import {
	getIEDCommunicationInfosByBay,
	getIEDCommunicationInfosBySubNetworkBus
} from '../services/ied'
// TYPES
import type { IED } from '@oscd-plugins/core'

const iedCommunicationInfosByBay =
	writable<Map<string, IED.CommunicationInfo[]>>()
const iedCommunicationInfosBySubNetworkBus =
	writable<Map<string, IED.CommunicationInfo[]>>()

function init(newXmlDocument: XMLDocument) {
	iedCommunicationInfosByBay.set(
		getIEDCommunicationInfosByBay(newXmlDocument)
	)
	iedCommunicationInfosBySubNetworkBus.set(
		getIEDCommunicationInfosBySubNetworkBus(newXmlDocument)
	)
}

export default {
	//state
	iedCommunicationInfosByBay,
	iedCommunicationInfosBySubNetworkBus,
	//actions
	init
}
