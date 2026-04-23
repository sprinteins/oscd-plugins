import type { Insert, Remove, SetAttributes } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import { v4 as uuidv4 } from 'uuid'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { getScdEquipmentMatchKey } from '@/headless/domain/matching'
import { createLNodeElementInBay } from '@/headless/scl/elements'
import { buildEditsForEquipmentUpdates } from '@/headless/scl/edits/bay-type-edits'
import { buildRemovesForEqFunctions } from '@/headless/scl/edits/function-edits'
import {
	buildEditsForLDeviceRename,
	computeLDeviceInst
} from '@/headless/scl/edits/ldevice-rename-edits'
import {
	assignedLNodesStore,
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils'

function buildNewMatches(
	scdBay: Element,
	oldMatches: EquipmentMatch[]
): EquipmentMatch[] {
	const bayTypeUuid = scdBay.getAttribute('templateUuid')
	const bayType = ssdImportStore.bayTypes.find((bt) => bt.uuid === bayTypeUuid)
	if (!bayType) return []

	const scdEquipment = Array.from(
		scdBay.querySelectorAll(':scope > ConductingEquipment')
	)
	const usedBayTypeCeUuids = new Set<string>()
	const newMatches: EquipmentMatch[] = []

	for (const [index, scdElement] of scdEquipment.entries()) {
		const key = getScdEquipmentMatchKey(scdElement, index)
		const manualTemplateUuid = equipmentMatchingStore.manualMatches.get(key)

		const oldMatch = oldMatches.find((m) => m.scdElement === scdElement)
		if (!oldMatch) continue

		const newTemplateUuid = manualTemplateUuid ?? oldMatch.templateEquipment.uuid
		const newTemplate = ssdImportStore.conductingEquipmentTemplates.find(
			(t) => t.uuid === newTemplateUuid
		)
		if (!newTemplate) continue

		const newBayTypeCe = bayType.conductingEquipments.find(
			(btce) =>
				btce.templateUuid === newTemplateUuid &&
				!usedBayTypeCeUuids.has(btce.uuid)
		)
		if (!newBayTypeCe) continue

		usedBayTypeCeUuids.add(newBayTypeCe.uuid)
		newMatches.push({
			scdElement,
			bayTypeEquipment: newBayTypeCe,
			templateEquipment: newTemplate
		})
	}

	return newMatches
}

export function reMatchEquipment(bayName: string): void {
	const { doc, editor } = getDocumentAndEditor()

	const scdBay = bayStore.scdBay
	if (!scdBay) throw new Error('No bay selected')

	const assignedBayTypeUuid = bayStore.assignedBayTypeUuid
	if (!assignedBayTypeUuid) throw new Error('Bay has no assigned bay type')

	const bayType = ssdImportStore.bayTypes.find(
		(bt) => bt.uuid === assignedBayTypeUuid
	)
	if (!bayType) throw new Error(`BayType "${assignedBayTypeUuid}" not found`)

	const oldMatches = bayStore.equipmentMatches
	const newMatches = buildNewMatches(scdBay, oldMatches)

	const edits: (Insert | Remove | SetAttributes)[] = []

	for (const newMatch of newMatches) {
		const oldMatch = oldMatches.find(
			(m) => m.scdElement === newMatch.scdElement
		)
		if (!oldMatch) continue

		if (oldMatch.templateEquipment.uuid === newMatch.templateEquipment.uuid) {
			continue
		}

		const ceName = newMatch.scdElement.getAttribute('name') ?? ''
		const newTemplate = newMatch.templateEquipment
		const oldEqFunctions = Array.from(
			newMatch.scdElement.querySelectorAll(':scope > EqFunction')
		)

		// Each CE may be assigned to a different IED — resolve per CE
		const iedName =
			newMatch.scdElement
				.querySelector('LNode[iedName]')
				?.getAttribute('iedName') ?? null
		const ied = iedName
			? doc.querySelector(`IED[name="${iedName}"]`)
			: null

		for (const [idx, oldEqFunc] of oldEqFunctions.entries()) {
			const newEqFuncTemplate = newTemplate.eqFunctions[idx]
			if (!newEqFuncTemplate) continue

			const oldEqFuncUuid = oldEqFunc.getAttribute('uuid') ?? ''
			const oldEqFuncName = oldEqFunc.getAttribute('name') ?? ''
			const oldInst = computeLDeviceInst(oldEqFuncName, oldEqFuncUuid, ceName)

			const newEqFuncUuid = uuidv4()
			const newInst = computeLDeviceInst(
				newEqFuncTemplate.name,
				newEqFuncUuid,
				ceName
			)

			const lDeviceExists =
				ied?.querySelector(
					`AccessPoint > Server > LDevice[inst="${oldInst}"]`
				) !== null && ied !== null

			if (lDeviceExists && ied) {
				edits.push(
					...buildEditsForLDeviceRename({
						ied,
						oldInst,
						newInst,
						newLNodeTemplates: newEqFuncTemplate.lnodes,
						doc
					})
				)
			}

			const eqFunctionElement = createElement(doc, 'EqFunction', {
				name: newEqFuncTemplate.name,
				uuid: newEqFuncUuid
			})
			for (const lnodeTemplate of newEqFuncTemplate.lnodes) {
				const lnodeEl = createLNodeElementInBay(doc, lnodeTemplate)
				if (lDeviceExists && iedName) {
					lnodeEl.setAttribute('iedName', iedName)
				}
				eqFunctionElement.appendChild(lnodeEl)
			}

			const terminals = Array.from(
				newMatch.scdElement.querySelectorAll('Terminal')
			)
			const referenceNode =
				terminals.length > 0
					? terminals[terminals.length - 1].nextSibling
					: null

			edits.push({
				node: eqFunctionElement,
				parent: newMatch.scdElement,
				reference: referenceNode
			} as Insert)
		}

		edits.push(...buildRemovesForEqFunctions(oldMatch))
		edits.push(...buildEditsForEquipmentUpdates([newMatch]))
	}

	if (edits.length === 0) return

	editor.commit(edits, {
		title: `Re-match equipment in Bay "${bayName}"`
	})

	assignedLNodesStore.rebuild()
}

