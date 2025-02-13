import { get } from 'svelte/store'
import { IEDService } from '@oscd-plugins/core'

export function getIEDCommunicationInfos(root: Element) {
	const iedService = new IEDService(root)
	return iedService.IEDCommunicationInfos()
}

//why is this necessary? can't i just expose the IEDService?
export function getIEDCommunicationInfosByBay(root: Element) {
	const iedService = new IEDService(root)
	return iedService.IEDCommunicationInfosByBay()
}