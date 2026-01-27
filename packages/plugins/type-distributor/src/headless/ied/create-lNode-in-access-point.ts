import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { Insert } from '@openscd/oscd-api'
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

	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor found')
	}

	const serverElement = doc.createElement('Server')
	const authElement = doc.createElement('Authentication')
	authElement.setAttribute('none', 'true')
	serverElement.appendChild(authElement)

	const edit: Insert = {
		node: serverElement,
		parent: accessPoint,
		reference: null
	}

	editor.commit(edit, {
		title: 'Add Server element'
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

	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor found')
	}

	const lDevice = doc.createElement('LDevice')
	lDevice.setAttribute('inst', ldInst)

	const edit: Insert = {
		node: lDevice,
		parent: server,
		reference: null
	}

	editor.commit(edit, {
		title: `Add LDevice ${ldInst}`
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

	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor found')
	}

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
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
			const edit: Insert = {
				node: lnElement,
				parent: lDevice,
				reference: null
			}

			editor.commit(edit, {
				title: `Add LN ${lnode.lnClass} to ${iedName}`
			})
			console.log('[createLNodesInAccessPoint] Edit event dispatched successfully')
		} catch (error) {
			console.error('[createLNodesInAccessPoint] Error dispatching edit event:', error)
			throw error
		}
	}

	console.log('[createLNodesInAccessPoint] Complete')
}
