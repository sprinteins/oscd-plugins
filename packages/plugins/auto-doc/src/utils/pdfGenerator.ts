import type { ImageData } from '@/ui/components/elements/image-element/types.image'
import type { SignalListOnSCD } from '@/ui/components/elements/signal-list-element/types.signal-list'
import type { ElementType } from '@/ui/components/elements/types.elements'
import CommunicationElement from '@/ui/components/elements/communication-element/communication-element.svelte'
import NetworkElement from '@/ui/components/elements/network-element/network-element.svelte'
import jsPDF from 'jspdf'
import autoTable, { type FontStyle } from 'jspdf-autotable'
import zipcelx from 'zipcelx'
import { docTemplatesStore, placeholderStore, signallistStore } from '../stores'
import { renderComponentOffscreen } from './renderComponentOffscreen'
import { writeCommunicationContentToPdf } from './communicationPdfContent'
import { IEDService } from '@oscd-plugins/core'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { PDF_CONSTANTS, TEXT_SIZES, FONT_STYLES } from './pdf/constants'
import {
	loadImage,
	extractImageFormat,
	getImageScaleFactor
} from './pdf/image-utils'
import { PdfPageManager } from './pdf/page-manager'
import type { TextSize } from './pdf/pdf.types'

/*
    For jsPDF API documentation refer to: http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
*/

async function generatePdf(templateTitle: string, allBlocks: Element[]) {
	const doc = new jsPDF()
	doc.setFontSize(PDF_CONSTANTS.DEFAULT_FONT_SIZE)

	const pageHeight = doc.internal.pageSize.height
	const pageSize = doc.internal.pageSize
	const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()

	const pageManager = new PdfPageManager(
		doc,
		pageHeight,
		PDF_CONSTANTS.INITIAL_PAGE_MARGIN,
		PDF_CONSTANTS.INITIAL_PAGE_MARGIN
	)

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
				case 'h1':
					renderText(
						element.textContent ?? '',
						TEXT_SIZES.H1,
						FONT_STYLES.BOLD
					)
					break
				case 'h2':
					renderText(
						element.textContent ?? '',
						TEXT_SIZES.H2,
						FONT_STYLES.BOLD
					)
					break
				case 'h3':
					renderText(
						element.textContent ?? '',
						TEXT_SIZES.H3,
						FONT_STYLES.BOLD
					)
					break
				case 'p':
					processParagraph(element)
					break
				case 'strong':
					renderText(
						element.textContent ?? '',
						PDF_CONSTANTS.DEFAULT_FONT_SIZE,
						FONT_STYLES.BOLD
					)
					break
				case 'em':
					renderText(
						element.textContent ?? '',
						PDF_CONSTANTS.DEFAULT_FONT_SIZE,
						FONT_STYLES.ITALIC
					)
					break
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
		doc.setFont('helvetica', fontStyle)

		const wrappedText: string[] = doc.splitTextToSize(
			textWithPlaceholder ?? '',
			pageWidth - (PDF_CONSTANTS.TEXT_MARGIN_OFFSET - indent)
		)

		for (const line of wrappedText) {
			pageManager.ensureSpace()
			doc.text(
				line,
				PDF_CONSTANTS.HORIZONTAL_SPACING,
				pageManager.getCurrentPosition()
			)
			pageManager.incrementPosition()
		}
	}

	function processParagraph(paragraph: Element) {
		for (const node of paragraph.childNodes) {
			if (node.nodeType === Node.TEXT_NODE) {
				renderText(
					node.textContent ?? '',
					PDF_CONSTANTS.DEFAULT_FONT_SIZE,
					FONT_STYLES.NORMAL
				)
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				const element = node as Element
				let fontStyle: FontStyle = FONT_STYLES.NORMAL
				if (element.tagName.toLowerCase() === 'strong') {
					fontStyle = FONT_STYLES.BOLD
				} else if (element.tagName.toLowerCase() === 'em') {
					fontStyle = FONT_STYLES.ITALIC
				}
				renderText(
					element.textContent ?? '',
					PDF_CONSTANTS.DEFAULT_FONT_SIZE,
					fontStyle
				)
			}
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
						PDF_CONSTANTS.DEFAULT_FONT_SIZE,
						FONT_STYLES.NORMAL,
						indent
					)
					firstParagraph.remove()
				} else {
					renderText(
						bullet + (li.textContent ?? ''),
						PDF_CONSTANTS.DEFAULT_FONT_SIZE,
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
						processList(
							child,
							indent + PDF_CONSTANTS.NESTED_LIST_INDENT
						)
					}
				})
			}
		})
	}

	function renderTextLine(text: string) {
		pageManager.ensureSpace()
		doc.text(
			text,
			PDF_CONSTANTS.HORIZONTAL_SPACING,
			pageManager.getCurrentPosition()
		)
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
		const width = scaleFactor * PDF_CONSTANTS.MAX_IMAGE_WIDTH
		const height = width * aspectRatio

		pageManager.ensureSpace(height)

		doc.addImage(
			dataUrl,
			format.toUpperCase(),
			PDF_CONSTANTS.HORIZONTAL_SPACING,
			pageManager.getCurrentPosition(),
			width,
			height
		)

		const padding = Math.round(height) + PDF_CONSTANTS.DEFAULT_LINE_HEIGHT
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
				left: PDF_CONSTANTS.HORIZONTAL_SPACING
			},
			headStyles: {
				fillColor: 'black'
			}
		})

		const tableHeight =
			rows * PDF_CONSTANTS.DEFAULT_LINE_HEIGHT +
			PDF_CONSTANTS.DEFAULT_LINE_HEIGHT
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
		// Then add the legend, bay list, and IED list as text
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
					parameters
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
