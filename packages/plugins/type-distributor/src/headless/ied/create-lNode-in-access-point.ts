import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '../types'

type CreateLNodesParams = {
	accessPoint: Element
	lNodes: LNodeTemplate[]
	iedName: string
	ldInst?: string
}

function ensureServer(accessPoint: Element, doc: XMLDocument): Element {
	const existingServer = Array.from(accessPoint.children).find(
		(child) => child.localName === 'Server'
	)
	if (existingServer) return existingServer

	const serverElement = doc.createElement('Server')
	const authElement = doc.createElement('Authentication')
	authElement.setAttribute('none', 'true')
	serverElement.appendChild(authElement)

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host!,
		edit: {
			node: serverElement,
			parent: accessPoint,
			reference: null
		}
	})

	return serverElement
}

function ensureLDevice(
	server: Element,
	doc: XMLDocument,
	ldInst: string
): Element {
	const existing = Array.from(server.children).find(
		(child) => child.localName === 'LDevice' && child.getAttribute('inst') === ldInst
	)
	if (existing) return existing

	const lDevice = doc.createElement('LDevice')
	lDevice.setAttribute('inst', ldInst)

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host!,
		edit: {
			node: lDevice,
			parent: server,
			reference: null
		}
	})

	return lDevice
}

export function createLNodesInAccessPoint({
	accessPoint,
	lNodes,
	iedName,
	ldInst = 'LD1'
}: CreateLNodesParams): void {
	console.log('[createLNodesInAccessPoint] Started', { 
		ldInst, 
		iedName, 
		lNodesCount: lNodes.length,
		apName: accessPoint.getAttribute('name')
	})

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}
	if (!pluginGlobalStore.host) {
		throw new Error('No host element found')
	}

	const doc = pluginGlobalStore.xmlDocument
	console.log('[createLNodesInAccessPoint] Ensuring server...')
	const server = ensureServer(accessPoint, doc)
	console.log('[createLNodesInAccessPoint] Server ready:', server.tagName)

	console.log('[createLNodesInAccessPoint] Ensuring LDevice with inst:', ldInst)
	const lDevice = ensureLDevice(server, doc, ldInst)
	console.log('[createLNodesInAccessPoint] LDevice ready:', lDevice.getAttribute('inst'))

	for (const lnode of lNodes) {
		console.log('[createLNodesInAccessPoint] Creating LN:', {
			lnClass: lnode.lnClass,
			lnType: lnode.lnType,
			lnInst: lnode.lnInst
		})

		// use LN elements for user-dragged functions; keep lnClass/lnType/lnInst from template
		const lnElement = doc.createElement('LN')
		lnElement.setAttribute('lnClass', lnode.lnClass)
		lnElement.setAttribute('lnType', lnode.lnType)
		lnElement.setAttribute('lnInst', lnode.lnInst)
		lnElement.setAttribute('iedName', iedName)

		console.log('[createLNodesInAccessPoint] Dispatching edit event for LN')
		try {
			createAndDispatchEditEvent({
				host: pluginGlobalStore.host,
				edit: {
					node: lnElement,
					parent: lDevice,
					reference: null
				}
			})
			console.log('[createLNodesInAccessPoint] Edit event dispatched successfully')
		} catch (error) {
			console.error('[createLNodesInAccessPoint] Error dispatching edit event:', error)
			throw error
		}
	}

	console.log('[createLNodesInAccessPoint] Complete')
}
