import {
	LC_TYPE,
	LP_TYPE,
	NODE_ELEMENT_TYPE,
	PORTS_CONFIG_PER_TYPE
} from './headless/constants'
import type { IED } from './ied/ied'
import { store } from './store.svelte'
import type { Nullable } from './types'
import type {
	Connection,
	ConnectionPort,
	LogicalConditioner
} from './ui/components/canvas/types.canvas'
import type { LpElement } from './ui/components/right-bar/lp-list/types.lp-list'
// STORES
import { iedTreeStore } from '@/headless/stores'
// TYPES
import type { DataObject } from '@/headless/stores'

/**
 * Note: the `store.editCount` is only there to trigger the effect. This is
 * how OpenSCD lets us know that the doucment has been updated.
 */
export function useQuery() {
	$effect(() =>
		storeLogicalConditioners(
			store.doc,
			iedTreeStore.selectedIED,
			store.editCount
		)
	)
	$effect(() =>
		storeLogicalPhysicals(
			store.doc,
			iedTreeStore.selectedIED,
			store.editCount
		)
	)
	$effect(() =>
		storeConnections(
			store.doc,
			iedTreeStore.selectedIED,
			iedTreeStore.selectedDataObject,
			store.editCount
		)
	)
}

function storeLogicalConditioners(
	doc: Nullable<XMLDocument>,
	selectedIED: IED | undefined,
	_: unknown
) {
	if (!doc || !selectedIED) {
		console.warn('no doc or no ied selected')
		return
	}

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) {
		console.warn(`IED (name:${selectedIED.name}) not found`)
		return
	}

	const lcQuery = Object.values(LC_TYPE)
		.map(
			(lcType) =>
				`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lcType}"]`
		)
		.join(',')

	const lcElements = Array.from(iedElement.querySelectorAll(lcQuery))

	store.logicalConditioners = lcElements.map(lcElementToLC)
}

function lcElementToLC(lcElement: Element): LogicalConditioner {
	return {
		id: lcElement.getAttribute('uuid') || crypto.randomUUID(),
		type:
			(lcElement.getAttribute('lnClass') as keyof typeof LC_TYPE) ||
			'unknown',
		instance: `${lcElement.getAttribute('inst') || ''}`,
		isLinked: false,
		numberOfLCIVPorts:
			Number.parseInt(
				lcElement.getAttribute('numberOfLCIVPorts') || ''
			) || undefined
	}
}

export function storeLogicalPhysicals(
	doc: Nullable<XMLDocument>,
	selectedIED: IED | undefined,
	_: unknown
) {
	if (!doc || !selectedIED) return

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) {
		console.warn(`IED (name:${selectedIED.name}) not found`)
		return
	}

	const lpQuery = Object.values(LP_TYPE)
		.map(
			(lpType) =>
				`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lpType}"]`
		)
		.join(',')

	const lpElements = Array.from(iedElement.querySelectorAll(lpQuery))
	const iedName = iedElement.getAttribute('name') || 'unknown'

	store.lpList = lpElements.map((el) => lpElementToLP(iedName, el))
}

function lpElementToLP(iedName: string, lpElement: Element): LpElement {
	return {
		id: lpElement.getAttribute('uuid') || crypto.randomUUID(),
		type:
			(lpElement.getAttribute('lnClass') as keyof typeof LP_TYPE) ||
			'unknown',
		name: `${lpElement.getAttribute('lnType') || ''}`,
		instance: `${lpElement.getAttribute('inst') || ''}`,
		description: `${lpElement.getAttribute('desc') || ''}`,
		isLinked: false,
		numberOfLPDOPorts:
			Number.parseInt(
				lpElement.getAttribute('numberOfLPDOPorts') || ''
			) || undefined
	}
}

function storeConnections(
	doc: Nullable<XMLDocument>,
	selectedIED: IED | undefined,
	selectedDataObject: DataObject | undefined,
	_: unknown
) {
	if (!doc || !selectedIED) {
		console.warn('no doc or no ied selected')
		return
	}
	if (!selectedDataObject) return

	const iedElement = doc.querySelector(`IED[name="${selectedIED.name}"]`)

	if (!iedElement) {
		console.warn(`IED (name:${selectedIED.name}) not found`)
		return
	}

	const lcQuery = Object.values(LC_TYPE)
		.map(
			(lcType) =>
				`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lcType}"]`
		)
		.join(',')

	const lnRefElements = Array.from(iedElement.querySelectorAll(lcQuery)).map(
		(lcElement) => ({
			lc: lcElement,
			dois: Array.from(lcElement.querySelectorAll('DOI')).map(
				(doiElement) => ({
					doi: doiElement,
					lnRefs: Array.from(doiElement.querySelectorAll('LNRef'))
				})
			)
		})
	)

	const lcsToSelect: LogicalConditioner[] = []
	const lpsToSelect: LpElement[] = []

	store.connections = lnRefElements
		.flatMap((lcElement) => {
			return lcElement.dois.flatMap((doiElement) => {
				const doiName = doiElement.doi.getAttribute('name')
				const connectionType = doiElement.doi.getAttribute('desc')

				if (!connectionType || !doiName) {
					console.warn('connection type or name not defined!')
					return
				}

				if (!selectedDataObject) {
					return
				}

				return doiElement.lnRefs.flatMap((lnRefElement) => {
					const lcAttrs = lcElement.lc
					const refDO = lnRefElement.getAttribute('refDO') || ''
					const refLDInst =
						lnRefElement.getAttribute('refLDInst') || ''
					const refLNClass =
						lnRefElement.getAttribute('refLNClass') || ''
					const refLNInst =
						lnRefElement.getAttribute('refLNInst') || ''
					const lnClass = lcAttrs.getAttribute('lnClass') || ''
					const inst = lcAttrs.getAttribute('inst') || ''

					const from = {
						name:
							connectionType === 'output'
								? `${refDO}-right`
								: `${lnClass}-${inst}-right`,
						type:
							connectionType === 'output'
								? NODE_ELEMENT_TYPE.DO
								: NODE_ELEMENT_TYPE.LC,
						port:
							connectionType === 'output'
								? ({
										name: refDO,
										side: 'right'
									} as ConnectionPort)
								: ({
										name: doiName,
										side: 'right'
									} as ConnectionPort)
					}

					const to = {
						name:
							connectionType === 'output'
								? `${lnClass}-${inst}-left`
								: `${refLNClass}-${refLNInst}-left`,
						type:
							connectionType === 'output'
								? NODE_ELEMENT_TYPE.LC
								: NODE_ELEMENT_TYPE.LP,
						port:
							connectionType === 'output'
								? PORTS_CONFIG_PER_TYPE[lnClass].filter(
										(port) => doiName.includes(port.name)
									)[0]
								: ({
										name: refDO,
										side: 'left'
									} as ConnectionPort)
					}

					const connection: Connection = {
						id: crypto.randomUUID(),
						from,
						to
					}

					if (
						connectionType === 'output' &&
						refDO === selectedDataObject.name &&
						refLNClass ===
							selectedDataObject.objectPath.ln?.lnClass &&
						refLNInst === selectedDataObject.objectPath.ln?.inst &&
						refLDInst ===
							selectedDataObject.objectPath.lDevice?.inst
					) {
						const selectedLC = store.findLC(lnClass, inst)

						if (!selectedLC) {
							console.warn('LC and LP to be connected not found!')
							return
						}

						if (!lcsToSelect.includes(selectedLC)) {
							selectedLC.isLinked = true
							lcsToSelect.push(selectedLC)
						}
						return connection
					}

					if (connectionType === 'input' && selectedDataObject) {
						const selectedLP = store.findLP(refLNClass, refLNInst)
						const selectedLC = store.findLC(lnClass, inst)

						if (!selectedLP || !selectedLC) {
							console.warn('LC and LP to be connected not found!')
							return
						}

						const isConnectedLcConnectedToSelectedDo = Boolean(
							lcElement.lc.querySelector(
								`DOI[desc="output"] > LNRef[refLDInst="${selectedDataObject.objectPath.lDevice?.inst}"][refLNClass="${selectedDataObject.objectPath.ln?.lnClass}"][refLNInst="${selectedDataObject.objectPath.ln?.inst}"][refDO="${selectedDataObject.name}"]`
							)
						)

						if (isConnectedLcConnectedToSelectedDo) {
							if (!lpsToSelect.includes(selectedLP)) {
								selectedLP.isLinked = true
								lpsToSelect.push(selectedLP)
							}
							if (!lcsToSelect.includes(selectedLC)) {
								selectedLC.isLinked = true
								lcsToSelect.push(selectedLC)
							}
							return connection
						}
					}
				})
			})
		})
		.filter((connection) => connection !== undefined)

	const currentSelectedLogicalConditionerIDs =
		store._selectedLogicalConditioners.map((lc) => lc.id)

	for (const lcToSelect of lcsToSelect) {
		if (currentSelectedLogicalConditionerIDs.includes(lcToSelect.id))
			continue
		currentSelectedLogicalConditionerIDs.push(lcToSelect.id)
		store._selectedLogicalConditioners.push(lcToSelect)
	}

	const currentSelectedLogicalPhysicalsIDs =
		store._selectedLogicalPhysicals.map((lp) => lp.id)

	for (const lpToSelect of lpsToSelect) {
		if (currentSelectedLogicalPhysicalsIDs.includes(lpToSelect.id)) continue
		currentSelectedLogicalPhysicalsIDs.push(lpToSelect.id)
		store._selectedLogicalPhysicals.push(lpToSelect)
	}
}
