import { IEDService } from '@oscd-plugins/core'
import type { IED } from '@oscd-plugins/core'

/**
 * Extract IED communication information from SCL document
 */
export function getIEDCommunicationInfos(root: Element): IED.CommunicationInfo[] {
	const iedService = new IEDService(root)
	return iedService.IEDCommunicationInfos()
}

/**
 * Extract IED communication information grouped by bay from SCL document
 */
export function getIEDCommunicationInfosByBay(root: Element): Map<string, IED.CommunicationInfo[]> {
	const iedService = new IEDService(root)
	return iedService.IEDCommunicationInfosByBay()
}

/**
 * Extract bay information from SCL document  
 */
export function getBays(root: Element): Set<string> {
	const iedService = new IEDService(root)
	return iedService.Bays()
}