import { formatXml } from '@/instance/v1/utils/formatter'
// SAMPLES
import { sclMockA } from '@/mocks/v1'
// TYPES
import type { Menu } from './types'

//====== PRIVATE FUNCTIONS ======//

async function loadDocumentFromEvent(event: Event) {
	const file =
		(<HTMLInputElement | null>event.target)?.files?.item(0) ?? false
	if (!file) throw new Error('No file selected')

	const rawXmlDocument = await file.text()
	const xmlDocumentName = file.name
	const xmlDocument = new DOMParser().parseFromString(
		rawXmlDocument,
		'application/xml'
	)

	return {
		xmlDocument,
		xmlDocumentName,
		rawXmlDocument
	}
}

function loadDocumentFromSample() {
	const xmlDocument = new DOMParser().parseFromString(sclMockA, 'text/xml')
	return {
		xmlDocument,
		xmlDocumentName: 'simple_v5.scd',
		rawXmlDocument: sclMockA
	}
}

//====== PUBLIC FUNCTIONS ======//

export async function parseXmlDocument(
	event?: Event
): Promise<Menu.LoadedDocument> {
	let loadedDocument: Menu.LoadedDocument

	if (event) loadedDocument = await loadDocumentFromEvent(event)
	else loadedDocument = loadDocumentFromSample()

	console.log(loadedDocument)

	return loadedDocument
}

export async function serializeAndFormatXmlDocument(
	xmlDocument: XMLDocument,
	xmlDocumentName: string
): Promise<void> {
	const documentAsString = formatXml(
		new XMLSerializer().serializeToString(xmlDocument)
	)

	// Add XML declaration/prolog if it's been stripped
	// TODO: This can be removed once the improved OpenSCD core edit API is present
	// documentAsString = documentAsString.startsWith('<?xml')
	// 	? documentAsString
	// 	: '<?xml version="1.0" encoding="UTF-8"?>' + '\n' + documentAsString;

	const blob = new Blob([documentAsString], {
		type: 'application/xml'
	})

	const a = document.createElement('a')
	a.download = xmlDocumentName
	a.href = URL.createObjectURL(blob)
	a.dataset.downloadurl = ['application/xml', a.download, a.href].join(':')
	a.style.display = 'none'
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	setTimeout(() => {
		URL.revokeObjectURL(a.href)
	}, 5000)
}
