import type { Insert, Remove } from '@openscd/oscd-api'
import type { LNodeType } from '@/headless/common-types'
import { getDocument } from '../../utils'
import { createBasicIEDElement } from '../elements/ied-element'
import {
	queryAccessPointsFromIed,
	queryIEDInsertionReference,
	queryIedElement
} from '../queries'
import { buildInsertsForAccessPoints } from './accesspoint-edits'
import { buildInsertsForLd0DataTypes } from './data-type-edits'

export function buildEditForCreateIed(
	name: string,
	description?: string
): Insert {
	const doc = getDocument()

	const iedElement = createBasicIEDElement(name, doc, description)
	const sclRoot = doc.documentElement

	const reference = queryIEDInsertionReference(sclRoot)

	const edit: Insert = {
		node: iedElement,
		parent: sclRoot,
		reference: reference
	}

	return edit
}

type buildInsertsForCreateIedWithAccessPointsParams = {
	name: string
	description?: string
	accessPoints: { name: string; description?: string }[]
	lnodeTypes: LNodeType[]
	ssdDoc?: XMLDocument | null
}

export function buildInsertsForCreateIedWithAccessPoints({
	name,
	description,
	accessPoints,
	lnodeTypes,
	ssdDoc
}: buildInsertsForCreateIedWithAccessPointsParams): Insert[] {
	const doc = getDocument()

	const iedElement = createBasicIEDElement(name, doc, description)
	const sclRoot = doc.documentElement
	const reference = queryIEDInsertionReference(sclRoot)

	const iedEdit: Insert = {
		node: iedElement,
		parent: sclRoot,
		reference
	}

	const allEdits: Insert[] = [
		iedEdit,
		...buildInsertsForAccessPoints({
			doc,
			parent: iedElement,
			accessPoints,
			lnodeTypes
		})
	]

	if (ssdDoc) {
		allEdits.push(
			...buildInsertsForLd0DataTypes({ doc, lnodeTypes, ssdDoc })
		)
	}

	return allEdits
}

export function buildEditForDeleteEmptyIed(iedName: string): Remove | null {
	const doc = getDocument()
	const iedElement = queryIedElement(doc, iedName)

	if (!iedElement) {
		console.warn(`IED with name "${iedName}" not found.`)
		return null
	}

	const hasAccessPoints = queryAccessPointsFromIed(doc, iedName).length > 0
	if (hasAccessPoints) {
		console.warn(`IED with name "${iedName}" is not empty.`)
		return null
	}

	return { node: iedElement } as Remove
}
