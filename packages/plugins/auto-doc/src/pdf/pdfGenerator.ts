import type { ImageData } from '@/ui/components/elements/image-element/types.image'
import type { SignalListOnSCD } from '@/ui/components/elements/signal-list-element/types.signal-list'
import type { ElementType } from '@/ui/components/elements/types.elements'
import CommunicationElement from '@/ui/components/elements/communication-element/communication-element.svelte'
import NetworkElement from '@/ui/components/elements/network-element/network-element.svelte'
import jsPDF from 'jspdf'
import autoTable, { type FontStyle } from 'jspdf-autotable'
import zipcelx from 'zipcelx'
import { docTemplatesStore, placeholderStore, signallistStore } from '../stores'
import { renderComponentOffscreen } from './rendering'
import { writeCommunicationContentToPdf } from './content-processing'
import { IEDService } from '@oscd-plugins/core'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	TEXT_SIZES,
	FONT_STYLES,
	DEFAULT_FONT_SIZE,
	DEFAULT_LINE_HEIGHT,
	HORIZONTAL_SPACING,
	INITIAL_PAGE_MARGIN,
	MAX_IMAGE_WIDTH,
	NESTED_LIST_INDENT,
	TEXT_MARGIN_OFFSET,
	DEFAULT_FONT
} from './core'
import { loadImage, extractImageFormat, getImageScaleFactor } from './core'
import { PdfPageManager } from './core'
import type { TextSegment, TextSize } from './core'
import {
	robotoBold,
	robotoBoldItalic,
	robotoItalic,
	robotoRegular
} from './fonts'

/*
    For jsPDF API documentation refer to: http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
*/

async function generatePdf(templateTitle: string, allBlocks: Element[]) {
	const doc = new jsPDF()

	doc.addFileToVFS('Roboto-Regular.ttf', robotoRegular)
	doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
	doc.addFileToVFS('Roboto-Bold.ttf', robotoBold)
	doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold')
	doc.addFileToVFS('Roboto-Italic.ttf', robotoItalic)
	doc.addFont('Roboto-Italic.ttf', 'Roboto', 'italic')
	doc.addFileToVFS('Roboto-BoldItalic.ttf', robotoBoldItalic)
	doc.addFont('Roboto-BoldItalic.ttf', 'Roboto', 'bolditalic')
	doc.setFont(DEFAULT_FONT, FONT_STYLES.NORMAL)
	doc.setFontSize(DEFAULT_FONT_SIZE)

	const pageHeight = doc.internal.pageSize.height
	const pageSize = doc.internal.pageSize
	const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()

	const pageManager = new PdfPageManager(
		doc,
		pageHeight,
		INITIAL_PAGE_MARGIN,
		INITIAL_PAGE_MARGIN
	)

	function extractTextSegments(
		node: Node,
		options: {
		inheritBold?: boolean
		inheritItalic?: boolean
	} = {}
	): TextSegment[] {
		const { inheritBold = false, inheritItalic = false } = options
		const segments: TextSegment[] = []

		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent ?? ''
			if (text) {
				let fontStyle: FontStyle = FONT_STYLES.NORMAL
				if (inheritBold && inheritItalic) {
					fontStyle = FONT_STYLES.BOLD_ITALIC
				} else if (inheritBold) {
					fontStyle = FONT_STYLES.BOLD
				} else if (inheritItalic) {
					fontStyle = FONT_STYLES.ITALIC
				}
				segments.push({ text, fontStyle })
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as Element
			const tagName = element.tagName.toLowerCase()

			const isBold = inheritBold || tagName === 'strong'
			const isItalic = inheritItalic || tagName === 'em'

			for (const child of element.childNodes) {
				segments.push(
					...extractTextSegments(child, {
						inheritBold: isBold,
						inheritItalic: isItalic
					})
				)
			}
		}

		return segments
	}

	const blockHandler: Record<
		ElementType,
		(block: Element) => void | Promise<void>
	> = {
		text: processRichTextBlock,
		image: processImageBlock,
		signalList: processSignalListBlock,
		table: processTableBlock,
		network: processNetworkBlock,
		communication: processCommunicationBlock
	}

	function processRichTextBlock(block: Element) {
		const parser = new DOMParser()
		const parsedBlockContent = parser.parseFromString(
			block.textContent ?? '',
			'text/html'
		)
		const HTMLElements: HTMLCollection = parsedBlockContent.body.children

		for (const element of HTMLElements) {
			switch (element.tagName.toLowerCase()) {
				case 'h1': {
					const segments = extractTextSegments(element)
					renderTextSegments(segments, TEXT_SIZES.H1)
					break
				}
				case 'h2': {
					const segments = extractTextSegments(element)
					renderTextSegments(segments, TEXT_SIZES.H2)
					break
				}
				case 'h3': {
					const segments = extractTextSegments(element)
					renderTextSegments(segments, TEXT_SIZES.H3)
					break
				}
				case 'p': {
					const segments = extractTextSegments(element)
					renderTextSegments(segments, DEFAULT_FONT_SIZE)
					break
				}
				case 'strong': {
					const segments = extractTextSegments(element, { inheritBold: true })
					renderTextSegments(segments, DEFAULT_FONT_SIZE)
					break
				}
				case 'em': {
					const segments = extractTextSegments(element, { inheritItalic: true })
					renderTextSegments(segments, DEFAULT_FONT_SIZE)
					break
				}
				case 'ul':
				case 'ol':
					processList(element, 0)
					break
				default:
					console.error(
						`Unsupported HTML element: ${element.tagName}`
					)
			}
		}
	}

	function renderText(
		text: string,
		fontSize: TextSize,
		fontStyle: FontStyle,
		indent = 0
	) {
		const textWithPlaceholder = placeholderStore.fillPlaceholder(text)
		doc.setFontSize(fontSize)
		doc.setFont(DEFAULT_FONT, fontStyle)

		const wrappedText: string[] = doc.splitTextToSize(
			textWithPlaceholder ?? '',
			pageWidth - (TEXT_MARGIN_OFFSET - indent)
		)

		for (const line of wrappedText) {
			pageManager.ensureSpace()
			doc.text(line, HORIZONTAL_SPACING, pageManager.getCurrentPosition())
			pageManager.incrementPosition()
		}
	}

	function renderTextSegments(
		segments: TextSegment[],
		fontSize: TextSize,
		indent = 0
	) {
		if (segments.length === 0) return

		const maxWidth = pageWidth - (TEXT_MARGIN_OFFSET - indent)
		let currentX = HORIZONTAL_SPACING
		let currentLineSegments: {
			text: string
			fontStyle: FontStyle
			x: number
		}[] = []

		for (const segment of segments) {
			const textWithPlaceholder =
				placeholderStore.fillPlaceholder(segment.text) ?? ''
			doc.setFontSize(fontSize)
			doc.setFont(DEFAULT_FONT, segment.fontStyle)

			const words = textWithPlaceholder.split(/(\s+)/)

			for (const word of words) {
				if (!word) continue

				const wordWidth = doc.getTextWidth(word)

				if (
					currentX + wordWidth > HORIZONTAL_SPACING + maxWidth &&
					currentLineSegments.length > 0
				) {
					pageManager.ensureSpace()
					for (const seg of currentLineSegments) {
						doc.setFont(DEFAULT_FONT, seg.fontStyle)
						doc.text(
							seg.text,
							seg.x,
							pageManager.getCurrentPosition()
						)
					}
					pageManager.incrementPosition()
					currentLineSegments = []
					currentX = HORIZONTAL_SPACING
				}

				currentLineSegments.push({
					text: word,
					fontStyle: segment.fontStyle,
					x: currentX
				})
				currentX += wordWidth
			}
		}

		if (currentLineSegments.length > 0) {
			pageManager.ensureSpace()
			for (const seg of currentLineSegments) {
				doc.setFont(DEFAULT_FONT, seg.fontStyle)
				doc.text(seg.text, seg.x, pageManager.getCurrentPosition())
			}
			pageManager.incrementPosition()
		}
	}

	function processList(list: Element, indent = 0) {
		const isOrdered = list.tagName.toLowerCase() === 'ol'
		let itemIndex = 1

		// biome-ignore lint/complexity/noForEach: <explanation>
		Array.from(list.children).forEach((li) => {
			if (li.tagName.toLowerCase() === 'li') {
				const bullet = isOrdered ? `${itemIndex}. ` : '• '
				itemIndex++

				const firstParagraph = li.querySelector('p')
				if (firstParagraph) {
					renderText(
						bullet + firstParagraph.textContent,
						DEFAULT_FONT_SIZE,
						FONT_STYLES.NORMAL,
						indent
					)
					firstParagraph.remove()
				} else {
					renderText(
						bullet + (li.textContent ?? ''),
						DEFAULT_FONT_SIZE,
						FONT_STYLES.NORMAL,
						indent
					)
				}

				// biome-ignore lint/complexity/noForEach: <explanation>
				Array.from(li.children).forEach((child) => {
					if (
						child.tagName.toLowerCase() === 'ul' ||
						child.tagName.toLowerCase() === 'ol'
					) {
						processList(child, indent + NESTED_LIST_INDENT)
					}
				})
			}
		})
	}

	function renderTextLine(text: string) {
		pageManager.ensureSpace()
		doc.text(text, HORIZONTAL_SPACING, pageManager.getCurrentPosition())
		pageManager.incrementPosition()
	}

	async function processImage(dataUrl: string, scale = 'small') {
		if (!dataUrl) {
			return
		}

		const image = await loadImage(dataUrl)
		const format = extractImageFormat(dataUrl)
		if (!format) {
			console.error('[pdfGenerator] Invalid image format in Data URL')
			return
		}

		const scaleFactor = getImageScaleFactor(scale)
		const aspectRatio = image.height / image.width
		const width = scaleFactor * MAX_IMAGE_WIDTH
		const height = width * aspectRatio

		pageManager.ensureSpace(height)

		doc.addImage(
			dataUrl,
			format.toUpperCase(),
			HORIZONTAL_SPACING,
			pageManager.getCurrentPosition(),
			width,
			height
		)

		const padding = Math.round(height) + DEFAULT_LINE_HEIGHT
		pageManager.incrementPosition(padding)
	}

	async function processImageBlock(block: Element) {
		const content = block.textContent
		if (!content) {
			return
		}

		const parsedContent = JSON.parse(content) as ImageData
		const imageSource = parsedContent.base64Data
		if (!imageSource) {
			return
		}

		await processImage(imageSource, parsedContent.scale)
	}

	function processSignalListBlock(block: Element) {
		if (!block.textContent) {
			console.error('No content found in Signal List Block')
			return
		}
		const blockId = block.getAttribute('id')
		const parsedBlockContent = JSON.parse(
			block.textContent
		) as SignalListOnSCD

		const selectedRows = parsedBlockContent.selected
		const tableRows =
			signallistStore.searchForMatchOnSignalList(selectedRows)

		const header = selectedRows.map((r) => ({
			value: r.primaryInput,
			type: 'string'
		}))
		const individualRows = tableRows.map((row) =>
			row.map((r) => ({ value: r, type: 'string' }))
		)

		const fileName = `SignalList_${blockId}`
		const pdfHintText = `Hint: check ${fileName}.xlsx`

		const table = [header, ...individualRows]
		const config = {
			filename: fileName,
			sheet: {
				data: table
			}
		}

		renderTextLine(pdfHintText)
		zipcelx(config)
	}

	function allocateSpaceForRows(
		filledBody: string[][],
		newFilledBody: string[][]
	) {
		for (let i = 0; i < filledBody.length; i++) {
			const row = filledBody[i]

			for (let j = 0; j < row.length; j++) {
				const values = row[j].split(', ')

				for (let k = 0; k < values.length; k++) {
					newFilledBody[k][j] = values[k].trim()
				}
			}
		}
	}

	function processTableBlock(block: Element) {
		const content = block.textContent
		if (!content) {
			console.error('No content found in Table Block')
			return
		}

		const data = JSON.parse(content)

		const formattedHeader: string[][] = [
			data.map((row: string[]) => row[0])
		]
		const formattedBody: string[][] = [data.map((row: string[]) => row[1])]

		const filledBody = formattedBody.map((row) =>
			row.map((cell) => placeholderStore.fillPlaceholder(cell))
		)

		let rows = data[0].length
		let maxNeededRows = rows

		for (const row of filledBody[0]) {
			const entries = row.split(', ').length
			if (entries > maxNeededRows) {
				maxNeededRows = entries
			}
		}

		let newFilledBody: string[][] = []

		if (maxNeededRows > rows) {
			const columns = filledBody[0].length

			for (let rowIndex = 0; rowIndex < maxNeededRows; rowIndex++) {
				const newColumn: string[] = new Array(columns).fill('')
				newFilledBody.push(newColumn)
			}

			rows = maxNeededRows + 1
			allocateSpaceForRows(filledBody, newFilledBody)
		}

		if (newFilledBody.length === 0) {
			newFilledBody = filledBody
		}

		autoTable(doc, {
			head: formattedHeader,
			body: newFilledBody,
			startY: pageManager.getCurrentPosition(),
			margin: {
				left: HORIZONTAL_SPACING
			},
			headStyles: {
				fillColor: 'black'
			}
		})

		const tableHeight = rows * DEFAULT_LINE_HEIGHT + DEFAULT_LINE_HEIGHT
		if (pageManager.contentExceedsPage(tableHeight)) {
			pageManager.createNewPage()
		} else {
			pageManager.incrementPosition(tableHeight)
		}
	}

	async function processCommunicationBlock(block: Element) {
		await processVisualizationElementForPdfGeneration(
			block,
			CommunicationElement
		)

		const content = block.textContent || ''
		if (!content) return

		try {
			const parameters = JSON.parse(content)
			const xmlDocument = pluginGlobalStore.xmlDocument

			if (
				xmlDocument &&
				(parameters.showLegend ||
					parameters.showBayList ||
					parameters.showIEDList)
			) {
				const iedService = new IEDService(xmlDocument.documentElement)

				writeCommunicationContentToPdf(
					doc,
					pageManager,
					pageWidth,
					iedService,
					parameters,
					xmlDocument
				)
			}
		} catch (error) {
			console.error(
				'[pdfGenerator] Error writing communication content:',
				error
			)
		}
	}

	async function processNetworkBlock(block: Element) {
		await processVisualizationElementForPdfGeneration(block, NetworkElement)
	}

	async function processVisualizationElementForPdfGeneration(
		block: Element,
		Component: typeof CommunicationElement | typeof NetworkElement
	) {
		const content = block.textContent || ''
		try {
			const dataUrl = await renderComponentOffscreen(Component, {
				content
			})

			await processImage(dataUrl, 'large')
		} catch (error) {
			console.error('[pdfGenerator] Error processing element:', error)
			// Don't fail the entire PDF generation, just skip this element
			renderTextLine('[Element Diagram - Failed to render]')
		}
	}

	for (const block of allBlocks) {
		const blockType = block.getAttribute('type') as ElementType

		if (blockType && blockHandler[blockType]) {
			await blockHandler[blockType](block)
		}
	}

	doc.save(`${templateTitle}.pdf`)
}

async function downloadAsPdf(templateId: string) {
	const template = docTemplatesStore.getDocumentTemplate(templateId)
	if (!template) {
		console.error('Template not found')
		return
	}
	const templateTitle = template.getAttribute('title') ?? 'N/A'
	const allBlocks: NodeList = template.querySelectorAll('Block')
	const blockConvertedToArray: Element[] =
		Array.prototype.slice.call(allBlocks)
	await generatePdf(templateTitle, blockConvertedToArray)
}

export const pdfGenerator = {
	downloadAsPdf
}
