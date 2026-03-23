import type { LDeviceData, LNodeTemplate } from '../../common-types'
import { parseLDeviceInst } from '../elements'

export function queryLDeviceDisplayLabel(
	doc: XMLDocument,
	ldInst: string
): string | undefined {
	let parsed: ReturnType<typeof parseLDeviceInst>
	try {
		parsed = parseLDeviceInst(ldInst)
	} catch {
		return undefined
	}

	if (parsed.isLD0) return undefined

	const { functionPrefixUuid } = parsed

	const el = doc.querySelector(
		`EqFunction[uuid^="${functionPrefixUuid}"], Function[uuid^="${functionPrefixUuid}"]`
	)

	if (!el) return undefined

	const fnName = el.getAttribute('name')
	if (!fnName) return undefined

	if (el.tagName === 'EqFunction') {
		const ceName = el.parentElement?.getAttribute('name')
		if (ceName) return `${ceName}_${fnName}`
	}

	return fnName
}

export function queryLDevicesFromAccessPoint(
	accessPoint: Element,
	doc?: XMLDocument
): LDeviceData[] {
	const lDevices: LDeviceData[] = []

	const servers = accessPoint.querySelectorAll(':scope > Server')

	for (const server of servers) {
		const lDeviceElements = server.querySelectorAll(':scope > LDevice')

		for (const lDevice of lDeviceElements) {
			const ldInst = lDevice.getAttribute('inst') ?? undefined
			const lnElements = lDevice.querySelectorAll(
				':scope > LN, :scope > LN0'
			)

			const lNodes: LNodeTemplate[] = []
			for (const lnode of lnElements) {
				lNodes.push({
					lnClass: lnode.getAttribute('lnClass') ?? '',
					lnType: lnode.getAttribute('lnType') ?? '',
					lnInst: lnode.getAttribute('lnInst') ?? '',
					iedName: lnode.getAttribute('iedName') ?? undefined,
					ldInst
				})
			}
			if (lNodes.length > 0 && ldInst) {
				const displayLabel = doc
					? queryLDeviceDisplayLabel(doc, ldInst)
					: undefined
				lDevices.push({ ldInst, lNodes, displayLabel })
			}
		}
	}
	return lDevices
}
