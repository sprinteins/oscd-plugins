import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import {
	buildUpdatesForBayLNode,
	createMultipleLNodesInAccessPoint,
	resolveScdEqFunctionUuid,
	resolveScdFunctionUuid
} from '@/headless/scl'
import {
	assignedLNodesStore,
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils/get-document-and-Editor'
import {
	applyBayType,
	commitEdits,
	generateCommitTitle,
	shouldApplyBayType
} from './drop-handler'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate' | 'lNode'
	lNodes: LNodeTemplate[]
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	parentUuid: string
	functionScopeUuid: string
	equipmentUuid?: string
}

function validateDraggedItem(
	draggedItem: DraggedItem | null
): draggedItem is DraggedItem {
	if (!draggedItem) {
		console.warn('[DnD] No dragged item to drop')
		return false
	}

	if (draggedItem.lNodes.length === 0) {
		console.warn('[DnD] Dragged item contains no LNodes')
		return false
	}

	if (!draggedItem.parentUuid) {
		console.warn('[DnD] Missing parentUuid in dragged item')
		return false
	}

	if (!draggedItem.functionScopeUuid) {
		console.warn('[DnD] Missing functionScopeUuid in dragged item')
		return false
	}

	return true
}

class UseDndStore {
	isDragging = $state(false)
	draggedItem = $state<DraggedItem | null>(null)

	handleDragStart(item: DraggedItem) {
		this.isDragging = true
		this.draggedItem = item
	}

	handleDragEnd() {
		this.isDragging = false
		this.draggedItem = null
	}

	handleDrop(accessPoint: Element, targetSIedName: string) {
		if (!validateDraggedItem(this.draggedItem)) {
			this.handleDragEnd()
			return
		}

		const {
			lNodes,
			sourceFunction: functionFromSSD,
			equipmentUuid,
			parentUuid,
			functionScopeUuid
		} = this.draggedItem

		try {
			const didApplyBayType = shouldApplyBayType({
				assignedBayTypeUuid: bayStore.assignedBayTypeUuid,
				selectedBayType: ssdImportStore.selectedBayType,
				validationResult: equipmentMatchingStore.validationResult,
				manualMatchingConfirmed: bayStore.manualMatchingConfirmed
			})
			const freshMatches = didApplyBayType ? applyBayType() : null
			const equipmentMatches = freshMatches ?? bayStore.equipmentMatches

			const { doc } = getDocumentAndEditor()
			const lnodeTypes = ssdImportStore.lnodeTypes
			const functionUuidOverride = equipmentUuid
				? resolveScdEqFunctionUuid({
						sourceFunction: functionFromSSD,
						equipmentUuid,
						equipmentMatches
					})
				: resolveScdFunctionUuid(parentUuid)
			const allEdits: (Insert | SetAttributes)[] = [
				...createMultipleLNodesInAccessPoint({
					sourceFunction: functionFromSSD,
					lNodes,
					accessPoint,
					equipmentMatches,
					equipmentUuid,
					doc,
					lnodeTypes,
					functionUuidOverride
				})
			]

			const shouldUpdateBay =
				!!bayStore.assignedBayTypeUuid || didApplyBayType

			if (shouldUpdateBay) {
				allEdits.push(
					...buildUpdatesForBayLNode({
						lNodes,
						iedName: targetSIedName,
						sourceFunction: functionFromSSD,
						equipmentUuid,
						equipmentMatches,
						scdEqFunctionUuid: functionUuidOverride
					})
				)
			}

			if (allEdits.length > 0) {
				const title = generateCommitTitle({
					lNodes,
					functionName: functionFromSSD.name,
					targetSIedName,
					didApplyBayType
				})

				commitEdits({ edits: allEdits, title, squash: didApplyBayType })

				assignedLNodesStore.markAsAssigned({
					parentUuid,
					lNodes,
					functionScopeUuid
				})
			}
		} catch (error) {
			console.error('[DnD] Error creating LNodes:', error)
		}

		this.handleDragEnd()
	}

	get currentDraggedItem() {
		return this.draggedItem
	}

	isDraggingItem(
		type: DraggedItem['type'],
		sourceFunctionUuid: string,
		parentUuid?: string
	): boolean {
		if (!this.isDragging || !this.draggedItem) return false

		return (
			this.draggedItem.type === type &&
			this.draggedItem.sourceFunction.uuid === sourceFunctionUuid &&
			this.draggedItem.parentUuid === parentUuid
		)
	}
}

export const dndStore = new UseDndStore()
