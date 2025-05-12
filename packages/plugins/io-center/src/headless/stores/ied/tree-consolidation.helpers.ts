// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
// CONSTANTS
import {
	TREE_LEVEL,
	TARGET_CDC_TYPES,
	PORT_SIDE,
	PORT_KIND
} from '@/headless/constants'
import { pluginLocalStore, iedStore } from '@/headless/stores'
// TYPES
import type {
	TreeItem,
	DataObject,
	LogicalConditionerClass,
	LogicalPhysicalClass
} from '@/headless/stores'

//====== MAIN FUNCTION ======//

export function mapCurrentAccessPoint(params: {
	accessPointElements: Element[]
}): TreeItem[] {
	const SelectorLDevicesWithoutLD0 = "LDevice:not([inst='LD0'])"

	return params.accessPointElements.map((accessPointElement) => {
		const accessPointName = accessPointElement.getAttribute('name')
		if (!accessPointName) throw new Error('AccessPoint name not found')

		const uuid = accessPointElement.getAttribute('uuid')
		if (!uuid) throw new Error('AccessPoint uuid not found')

		return {
			id: uuid,
			name: accessPointName,
			level: TREE_LEVEL.accessPoint,
			children: mapCurrentLogicalDevice({
				lDElements: Array.from(
					accessPointElement.querySelectorAll(
						SelectorLDevicesWithoutLD0
					)
				)
			})
		}
	})
}

//====== MAPPING FUNCTIONS ======//

function mapCurrentLogicalDevice(params: {
	lDElements: Element[]
}): TreeItem[] {
	return params.lDElements.map((lDElement) => {
		if (!iedStore.selectedIED) throw new Error('No IED selected')

		const uuid = lDElement.getAttribute('uuid')
		if (!uuid) throw new Error('LDevice uuid not found')

		const ldInst = lDElement.getAttribute('inst')
		if (!ldInst) throw new Error('LDevice instance not found')

		return {
			id: uuid,
			name: ldInst,
			level: TREE_LEVEL.lDevice,
			children: mapCurrentLogicalNode({
				lNElements: Array.from(lDElement.querySelectorAll('LN')),
				ldInst
			})
		}
	})
}

export function mapCurrentLogicalNode(params: {
	lNElements: Element[]
	ldInst: string
}): TreeItem[] {
	return params.lNElements.map((lNElement) => {
		const uuid = lNElement.getAttribute('uuid')
		if (!uuid) throw new Error('LN uuid not found')

		const lnClass = lNElement.getAttribute('lnClass') as
			| LogicalConditionerClass
			| LogicalPhysicalClass
			| null
		if (!lnClass) throw new Error('lnClass not found')

		const lnInst = lNElement.getAttribute('inst')
		if (!lnInst) throw new Error('lnInst instance not found')

		const lnType = lNElement.getAttribute('lnType')
		if (!lnType) throw new Error('lnType not found')

		const lnNodeType = pluginLocalStore.rootElement?.querySelector(
			`LNodeType[id="${lnType}"]`
		)
		if (!lnNodeType)
			throw new Error(`Could not find LNodeType with id: ${lnType}`)

		return {
			id: uuid,
			name: `${lnClass} - ${lnInst}`,
			level: TREE_LEVEL.lN,
			children: mapCurrentDataObject({
				dOElements: Array.from(lnNodeType.querySelectorAll('DO')),
				lnType,
				ldInst: params.ldInst,
				lnUuid: uuid,
				lnClass,
				lnInst
			})
		}
	})
}

export function mapCurrentDataObject(params: {
	dOElements: Element[]
	lnType: string
	ldInst: string
	lnUuid: string
	lnClass: LogicalConditionerClass | LogicalPhysicalClass
	lnInst: string
}): DataObject[] {
	const { dOElements, ...lnRefAttributes } = params

	return dOElements
		.map((dOElement) => {
			const [isAllowedCDC, commonDataClass] = hasCDC(dOElement)
			if (!isAllowedCDC) return
			if (!iedStore.selectedIED) throw new Error('No IED selected')

			const dOElementName = dOElement.getAttribute('name')
			if (!dOElementName) throw new Error('DO name not found')

			const lnRefElementUuid =
				iedStore.selectedIED.element
					?.querySelector(
						`LNRef[ldInst="${params.ldInst}"][lnUuid="${params.lnUuid}"][lnClass="${params.lnClass}"][lnInst="${params.lnInst}"][doName="${dOElementName}"]`
					)
					?.getAttribute('uuid') || crypto.randomUUID()

			return {
				id: `${params.lnType}-${dOElementName}`,
				name: dOElementName,
				level: TREE_LEVEL.dO,
				ports: [
					{
						kind: PORT_KIND.dataObject,
						allowedTarget: {
							kind: PORT_KIND.logicalConditioner,
							side: PORT_SIDE.left
						},
						name: dOElementName,
						side: PORT_SIDE.right,
						index: 0,
						commonDataClass,
						payload: {
							...lnRefAttributes,
							uuid: lnRefElementUuid
						}
					}
				]
			}
		})
		.filter(
			(node: TreeItem | undefined) => node !== undefined
		) as DataObject[]
}

//====== TESTER FUNCTIONS ======//

function hasCDC(dOElement: Element): [boolean, string] {
	const type = dOElement.getAttribute('type')
	if (!type) return [false, '']

	const doType = pluginLocalStore.rootElement?.querySelector(
		`DOType[id="${type}"]`
	)
	if (!doType) return [false, '']

	const cdc = doType.getAttribute('cdc')?.toLocaleLowerCase()
	if (!cdc || !typeGuard.isTuplesIncludingString(cdc, TARGET_CDC_TYPES))
		return [false, '']

	return [true, cdc]
}
