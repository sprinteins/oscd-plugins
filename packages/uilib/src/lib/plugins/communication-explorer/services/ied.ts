import { get } from 'svelte/store'
import { IEDService } from '@oscd-plugins/core'

export function getIEDCommunicationInfos(root: Element) {
	const iedService = new IEDService(root)
	return iedService.IEDCommunicationInfos()
}
