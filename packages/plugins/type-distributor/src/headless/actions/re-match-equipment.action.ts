import type { Insert, Remove, SetAttributes } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import { v4 as uuidv4 } from 'uuid'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { getScdEquipmentMatchKey } from '@/headless/domain/matching'
import { buildEditsForEquipmentUpdates } from '@/headless/scl/edits/bay-type-edits'
import { buildRemovesForEqFunctions } from '@/headless/scl/edits/function-edits'
import { buildEditsForLDeviceRename } from '@/headless/scl/edits/ldevice-rename-edits'
import { createLNodeElementInBay, generateLDeviceInst } from '@/headless/scl/elements'
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
	const bayType = ssdImportStore.bayTypes.find(
		(bt) => bt.uuid === bayTypeUuid
	)
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

		const newTemplateUuid =
			manualTemplateUuid ?? oldMatch.templateEquipment.uuid
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

function resolveIedNameForLNodeByIndex(
	sourceEqFunc: Element | undefined,
	lnodeIndex: number
): string | null {
	if (!sourceEqFunc) return null
	const sourceLNodes = Array.from(sourceEqFunc.querySelectorAll(':scope > LNode'))
	return sourceLNodes[lnodeIndex]?.getAttribute('iedName') ?? null
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

		if (
			oldMatch.templateEquipment.uuid === newMatch.templateEquipment.uuid
		) {
			continue
		}

		const ceName = newMatch.scdElement.getAttribute('name') ?? ''
		const newTemplate = newMatch.templateEquipment
		const oldEqFunctions = Array.from(
			newMatch.scdElement.querySelectorAll(':scope > EqFunction')
		)

		// iedName follows the type: find which old CE previously had this template.
		// This ensures that when types are swapped, the IED assignment travels with
		// the type rather than staying on the physical equipment.
		const sourceOldMatch = oldMatches.find(
			(m) => m.templateEquipment.uuid === newMatch.templateEquipment.uuid
		)
		const sourceElement = sourceOldMatch?.scdElement ?? newMatch.scdElement
		const sourceCeName = sourceElement.getAttribute('name') ?? ''
		const sourceOldEqFunctions = Array.from(
			sourceElement.querySelectorAll(':scope > EqFunction')
		)

		for (const [idx, oldEqFunc] of oldEqFunctions.entries()) {
			const newEqFuncTemplate = newTemplate.eqFunctions[idx]
			if (!newEqFuncTemplate) continue

			const sourceOldEqFunc = sourceOldEqFunctions[idx]

			const eqFuncIedName =
				sourceOldEqFunc
					?.querySelector(':scope > LNode[iedName]')
					?.getAttribute('iedName') ?? null
			const ied = eqFuncIedName
				? doc.querySelector(`IED[name="${eqFuncIedName}"]`)
				: null

			const oldEqFuncUuid =
				sourceOldEqFunc?.getAttribute('uuid') ??
				oldEqFunc.getAttribute('uuid') ??
				''
			const oldEqFuncName =
				sourceOldEqFunc?.getAttribute('name') ??
				oldEqFunc.getAttribute('name') ??
				''
			const oldInst = generateLDeviceInst(
				oldEqFuncName,
				oldEqFuncUuid,
				sourceCeName
			)

			const newEqFuncUuid = uuidv4()
			const newInst = generateLDeviceInst(
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

				const lnodeIedName = resolveIedNameForLNodeByIndex(
					sourceOldEqFunc,
					newEqFuncTemplate.lnodes.indexOf(lnodeTemplate)
				)
				if (lDeviceExists && lnodeIedName) {
					lnodeEl.setAttribute('iedName', lnodeIedName)
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
