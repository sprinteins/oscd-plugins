import { IEDService } from '@oscd-plugins/core'

export function getIEDCommunicationInfos(root: Element) {
	const iedService = new IEDService(root)
	return iedService.IEDCommunicationInfos()
}

//this function fails sometimes
export function getIEDCommunicationInfosByBay(root: Element) {
	const iedService = new IEDService(root)
	return iedService.IEDCommunicationInfosByBay()
}

export function getBays(root: Element): Set<string> {
	const iedService = new IEDService(root)
	return iedService.Bays()
}