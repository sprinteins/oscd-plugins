import { NODE_TYPE, TARGET_CDC_TYPES } from '@/headless/constants'
// STORES
import { pluginLocalStore, iedTreeStore } from '@/headless/stores'
// TYPES
import type { TreeItem, DataObject } from './types'

//====== MAIN FUNCTION ======//

export function mapCurrentAccessPoint(params: {
	accessPointElements: Element[]
}): TreeItem[] {
	const SelectorLDevicesWithoutLD0 = "LDevice:not([inst='LD0'])"

	return params.accessPointElements.map((accessPointElement) => {
		const accessPointName =
			accessPointElement.getAttribute('name') || 'unknown'

		return {
			id: crypto.randomUUID(),
			name: accessPointName,
			level: NODE_TYPE.accessPoint,
			children: mapCurrentLogicalDevice({
				lDElements: Array.from(
					accessPointElement.querySelectorAll(
						SelectorLDevicesWithoutLD0
					)
				),
				accessPointName
			})
		}
	})
}

//====== MAPPING FUNCTIONS ======//

function mapCurrentLogicalDevice(params: {
	lDElements: Element[]
	accessPointName: string
}): TreeItem[] {
	return params.lDElements.map((lDElement) => {
		const lDeviceId = `${iedTreeStore.selectedIED?.id}::LD_${lDElement.getAttribute('inst')}`
		const lDeviceInst = lDElement.getAttribute('inst') || 'unknown'

		return {
			id: lDeviceId,
			name: lDeviceInst,
			level: NODE_TYPE.lDevice,
			children: mapCurrentLogicalNode({
				lNElements: Array.from(lDElement.querySelectorAll('LN')),
				accessPointName: params.accessPointName,
				lDeviceId: lDeviceId,
				lDeviceInst: lDeviceInst
			})
		}
	})
}

export function mapCurrentLogicalNode(params: {
	lNElements: Element[]
	accessPointName: string
	lDeviceId: string
	lDeviceInst: string
}): TreeItem[] {
	return params.lNElements.map((lNElement) => {
		const lNId = `${params.lDeviceId}::LN_${lNElement.getAttribute('lnClass')}+LN_${lNElement.getAttribute('inst')}`
		const lNClass = lNElement.getAttribute('lnClass') || 'unknown'
		const lNInst = lNElement.getAttribute('inst') || 'unknown'
		const lnNodeType = pluginLocalStore.rootElement?.querySelector(
			`LNodeType[id="${lNElement.getAttribute('lnType') || ''}"]`
		)

		if (!lnNodeType)
			throw new Error(
				`Could not find LNodeType with id: ${lNElement.getAttribute('lnType')}`
			)

		return {
			id: lNId,
			name: `${lNClass} - ${lNInst}`,
			level: NODE_TYPE.lN,
			children: mapCurrentDataObject({
				dOElements: Array.from(lnNodeType.querySelectorAll('DO')),
				accessPointName: params.accessPointName,
				lDeviceId: params.lDeviceId,
				lDeviceInst: params.lDeviceInst,
				lNId: lNId,
				lNClass: lNClass,
				lNInst: lNInst
			})
		}
	})
}

export function mapCurrentDataObject(params: {
	dOElements: Element[]
	accessPointName: string
	lDeviceId: string
	lDeviceInst: string
	lNId: string
	lNClass: string
	lNInst: string
}): DataObject[] {
	return params.dOElements
		.map((dOElement) => {
			const [isAllowedCDC, cdc] = hasCDC(dOElement, TARGET_CDC_TYPES)
			if (!isAllowedCDC) return
			if (!iedTreeStore.selectedIED) throw new Error('No IED selected')

			return {
				id: `${params.lNId}::DO_${dOElement.getAttribute('name')}`,
				name: dOElement.getAttribute('name') || 'unknown',
				level: NODE_TYPE.dO,
				objectPath: {
					ied: {
						id: iedTreeStore.selectedIED?.id,
						name: iedTreeStore.selectedIED?.name
					},
					accessPoint: { name: params.accessPointName },
					lDevice: {
						id: params.lDeviceId,
						inst: params.lDeviceInst
					},
					ln: {
						id: params.lNId,
						lnClass: params.lNClass,
						inst: params.lNInst
					}
				},
				cdcType: cdc
			}
		})
		.filter(
			(node: TreeItem | undefined) => node !== undefined
		) as DataObject[]
}

//====== TESTER FUNCTIONS ======//

function hasCDC(dOElement: Element, targetCDC: string[]): [boolean, string] {
	const type = dOElement.getAttribute('type') || ''
	if (type === '') return [false, '']

	const doType = pluginLocalStore.rootElement?.querySelector(
		`DOType[id="${type}"]`
	)
	if (!doType) return [false, '']

	const cdc = doType.getAttribute('cdc') || ''
	if (cdc === '' || !targetCDC.includes(cdc.toLowerCase())) return [false, '']

	return [true, cdc.toLowerCase()]
}
