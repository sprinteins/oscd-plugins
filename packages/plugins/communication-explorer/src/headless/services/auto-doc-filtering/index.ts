export { filterIEDsByBays } from './filters/bay-filters'
export { resolveConnectionFilter } from './filters/resolve-filter'
export {
	determineVisibleIEDs,
	removeDetachedIEDs,
	ensureReferencedIEDsIncluded
} from './filters/ied-filters'
export {
	filterPublishedConnections,
	filterReceivedConnections
} from './filters/connection-filters'
export { queryIEDsByPattern, createNamespaceResolver } from './utils/xml-query'
export { MESSAGE_TYPE_TO_SCL_MAP } from './message-type-to-scl-map'

// Legacy export for backward compatibility
export * from './connection-filter'