import type { IEDService } from '@oscd-plugins/core'
import type jsPDF from 'jspdf'
import type { PdfPageManager } from '../core'
import {
	DEFAULT_FONT_SIZE,
	DEFAULT_LINE_HEIGHT,
	FONT_STYLES,
	HORIZONTAL_SPACING,
	LIST_INDENT,
	NESTED_LIST_INDENT,
	TEXT_MARGIN_OFFSET,
	TEXT_SIZES
} from '../core'
import type { CommunicationElementParameters } from '@/ui/components/elements/communication-element'
import type { FontStyle } from 'jspdf-autotable'

interface MessageType {
	name: string
	color: { r: number; g: number; b: number }
}

interface RenderContext {
	doc: jsPDF
	pageManager: PdfPageManager
	pageWidth: number
}

const MESSAGE_TYPES: MessageType[] = [
	{ name: 'MMS', color: { r: 50, g: 83, b: 168 } },
	{ name: 'GOOSE', color: { r: 40, g: 132, b: 9 } },
	{ name: 'Sampled Values', color: { r: 199, g: 60, b: 97 } },
	{ name: 'Unknown', color: { r: 1, g: 27, b: 34 } }
]

function createTextRenderer(context: RenderContext) {
	const { doc, pageManager, pageWidth } = context
	return {
		renderText(
			text: string,
			fontSize: number = DEFAULT_FONT_SIZE,
			fontStyle: FontStyle = FONT_STYLES.NORMAL,
			indent = 0
		) {
			doc.setFontSize(fontSize)
			doc.setFont('helvetica', fontStyle)

			const wrappedText: string[] = doc.splitTextToSize(
				text,
				pageWidth - (TEXT_MARGIN_OFFSET - indent)
			)

			for (const line of wrappedText) {
				pageManager.ensureSpace()
				const horizontalSpacing = HORIZONTAL_SPACING + indent
				doc.text(
					line,
					horizontalSpacing,
					pageManager.getCurrentPosition()
				)
				pageManager.incrementPosition(DEFAULT_LINE_HEIGHT)
			}
		},

		renderHeading(text: string, fontSize: number) {
			pageManager.ensureSpace(fontSize)
			this.renderText(text, fontSize, FONT_STYLES.BOLD)
			pageManager.incrementPosition(2)
		}
	}
}

function filterRelevantBays(
	iedService: IEDService,
	selectedBays: string[]
): string[] {
	const selectedBaysSet = new Set(selectedBays)
	const allBays = Array.from(iedService.Bays()).sort()
	return selectedBaysSet.size > 0
		? Array.from(selectedBaysSet).sort()
		: allBays
}

function filterRelevantIEDs(
	iedService: IEDService,
	selectedBays: string[]
): ReturnType<IEDService['IEDCommunicationInfos']> {
	const selectedBaysSet = new Set(selectedBays)
	const allIEDs = iedService.IEDCommunicationInfos()

	if (selectedBaysSet.size === 0) {
		return allIEDs
	}

	return allIEDs.filter((ied) => {
		if (!ied.bays || ied.bays.size === 0) return false
		return Array.from(ied.bays).some((bay) => selectedBaysSet.has(bay))
	})
}

function renderLegendIcon(
	doc: jsPDF,
	messageType: MessageType,
	x: number,
	y: number,
	iconRadius: number
) {
	doc.setFillColor(
		messageType.color.r,
		messageType.color.g,
		messageType.color.b
	)
	doc.circle(x + iconRadius, y - 1.5, iconRadius, 'F')
	doc.setTextColor(0, 0, 0)
	doc.text(messageType.name, x + iconRadius * 3, y)
}

function renderMessageTypeLegend(
	context: RenderContext,
	renderer: ReturnType<typeof createTextRenderer>
) {
	const { doc, pageManager, pageWidth } = context
	renderer.renderHeading('Message Type Legend', TEXT_SIZES.H3)

	const itemsPerRow = 2
	const iconRadius = 1.5
	let currentItem = 0

	while (currentItem < MESSAGE_TYPES.length) {
		pageManager.ensureSpace()

		const rowItems = MESSAGE_TYPES.slice(
			currentItem,
			currentItem + itemsPerRow
		)
		const columnWidth = (pageWidth - 20) / itemsPerRow
		const currentY = pageManager.getCurrentPosition()

		for (let i = 0; i < rowItems.length; i++) {
			const xOffset = HORIZONTAL_SPACING + i * columnWidth
			doc.setFontSize(DEFAULT_FONT_SIZE)
			renderLegendIcon(doc, rowItems[i], xOffset, currentY, iconRadius)
		}

		currentItem += itemsPerRow
		pageManager.incrementPosition(DEFAULT_LINE_HEIGHT)
	}

	pageManager.incrementPosition(5)
}

function renderBaysList(
	relevantBays: string[],
	renderer: ReturnType<typeof createTextRenderer>,
	pageManager: PdfPageManager
) {
	renderer.renderHeading('List of Bays', TEXT_SIZES.H3)

	if (relevantBays.length > 0) {
		for (const bay of relevantBays) {
			renderer.renderText(
				`• ${bay}`,
				DEFAULT_FONT_SIZE,
				FONT_STYLES.NORMAL,
				LIST_INDENT
			)
		}
	} else {
		renderer.renderText(
			'No bays found',
			DEFAULT_FONT_SIZE,
			FONT_STYLES.ITALIC,
			LIST_INDENT
		)
	}

	pageManager.incrementPosition(5)
}

function renderIEDDetails(
	ied: ReturnType<IEDService['IEDCommunicationInfos']>[0],
	renderer: ReturnType<typeof createTextRenderer>
) {
	if (!ied.iedDetails) return

	const sections = [
		{ title: 'Logical Nodes:', items: ied.iedDetails.logicalNodes },
		{ title: 'Data Objects:', items: ied.iedDetails.dataObjects },
		{ title: 'Data Attributes:', items: ied.iedDetails.dataAttributes }
	]

	for (const section of sections) {
		if (section.items.length > 0) {
			renderer.renderText(
				section.title,
				DEFAULT_FONT_SIZE,
				FONT_STYLES.BOLD,
				LIST_INDENT
			)
			for (const item of section.items) {
				renderer.renderText(
					`- ${item}`,
					9,
					FONT_STYLES.NORMAL,
					NESTED_LIST_INDENT
				)
			}
		}
	}
}

function renderIEDsList(
	relevantIEDs: ReturnType<IEDService['IEDCommunicationInfos']>,
	renderer: ReturnType<typeof createTextRenderer>,
	pageManager: PdfPageManager
) {
	renderer.renderHeading('List of IEDs', TEXT_SIZES.H3)

	if (relevantIEDs.length === 0) {
		renderer.renderText(
			'No IEDs found',
			DEFAULT_FONT_SIZE,
			FONT_STYLES.ITALIC,
			5
		)
		return
	}

	for (const ied of relevantIEDs) {
		pageManager.ensureSpace(30)

		renderer.renderText(ied.iedName, 12, FONT_STYLES.BOLD)

		if (ied.bays && ied.bays.size > 0) {
			const baysList = Array.from(ied.bays).join(', ')
			renderer.renderText(
				`Bays: ${baysList}`,
				DEFAULT_FONT_SIZE,
				FONT_STYLES.NORMAL,
				LIST_INDENT
			)
		}

		renderIEDDetails(ied, renderer)
		pageManager.incrementPosition(5)
	}
}

export function writeCommunicationContentToPdf(
	doc: jsPDF,
	pageManager: PdfPageManager,
	pageWidth: number,
	iedService: IEDService,
	parameters: CommunicationElementParameters
): void {
	const context: RenderContext = { doc, pageManager, pageWidth }
	const renderer = createTextRenderer(context)

	const relevantBays = filterRelevantBays(iedService, parameters.selectedBays)
	const relevantIEDs = filterRelevantIEDs(iedService, parameters.selectedBays)

	if (parameters.showLegend) {
		renderMessageTypeLegend(context, renderer)
	}

	if (parameters.showBayList) {
		renderBaysList(relevantBays, renderer, pageManager)
	}

	if (parameters.showIEDList) {
		renderIEDsList(relevantIEDs, renderer, pageManager)
	}
}
