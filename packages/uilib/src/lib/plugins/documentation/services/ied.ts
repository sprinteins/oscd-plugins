import { IEDService } from '@oscd-plugins/core'

export function getIEDCommunicationInfosByBay(currentXmlDocument: XMLDocument) {
	const iedService = new IEDService(currentXmlDocument.documentElement)
	return iedService.IEDCommunicationInfosByBay()
}

export function getIEDCommunicationInfosBySubNetworkBus(
	currentXmlDocument: XMLDocument
) {
	const iedService = new IEDService(currentXmlDocument.documentElement)
	return iedService.IEDCommunicationInfosBySubNetworkBus()
}
