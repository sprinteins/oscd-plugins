import type { ConnectionFilter, ResolvedFilter } from '@/headless/types'
import { MESSAGE_TYPE_TO_SCL_MAP } from '../message-type-to-scl-map'
import { queryIEDsByPattern } from '../utils/xml-query'

function normalizeMessageType(displayType: string): string {
	return MESSAGE_TYPE_TO_SCL_MAP[displayType] ?? displayType
}

export function resolveConnectionFilter(
	filter: ConnectionFilter,
	xmlDocument: XMLDocument | null
): ResolvedFilter {
	const sourceIEDs = queryIEDsByPattern(xmlDocument, filter.sourceIEDPattern)
	const targetIEDs = queryIEDsByPattern(xmlDocument, filter.targetIEDPattern)

	const sourceMatchAll =
		!filter.sourceIEDPattern || filter.sourceIEDPattern.trim() === ''
	const targetMatchAll =
		!filter.targetIEDPattern || filter.targetIEDPattern.trim() === ''

	const normalizedType = normalizeMessageType(filter.messageType)

	return {
		sourceIEDs,
		targetIEDs,
		sourceMatchAll,
		targetMatchAll,
		messageType: normalizedType
	}
}
