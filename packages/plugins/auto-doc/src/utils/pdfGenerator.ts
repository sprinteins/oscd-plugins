import type { ImageData } from '@/components/elements/image-element/types.image'
import type {
	SignalListOnSCD,
	SignalRow
} from '@/components/elements/signal-list-element/types.signal-list'
import type { ElementType } from '@/components/elements/types.elements'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import zipcelx from 'zipcelx'
import { docTemplatesStore, placeholderStore } from '../stores'
import type { Columns, SignalType } from '../stores'

/*
    For jsPDF API documentation refer to: http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
*/

async function generatePdf(templateTitle: string, allBlocks: Element[]) {
	const doc = new jsPDF()
	const DEFAULT_FONT_SIZE = 10
	doc.setFontSize(DEFAULT_FONT_SIZE)
	const INITIAL_UPPER_PAGE_COORDINATE = 10
	const INITIAL_LOWER_PAGE_COORDINATE = 10
	const DEFAULT_LINE_HEIGHT = 7

	let marginTop = INITIAL_UPPER_PAGE_COORDINATE
	const pageHeight = doc.internal.pageSize.height
	const pageSize = doc.internal.pageSize
	const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
	const marginBottom = INITIAL_LOWER_PAGE_COORDINATE

	const blockHandler: Record<ElementType, (block: Element) => void> = {
		text: handleRichTextEditorBlock,
		image: processImageForPdfGeneration,
		signalList: processSignalListForPdfGeneration,
		table: processTableForPdfGeneration
	}

	function incrementVerticalPositionForNextLine(lineHeight?: number) {
		marginTop += lineHeight || DEFAULT_LINE_HEIGHT
	}

	function contentExceedsCurrentPage(height?: number) {
		const bufferToBottomPage = height || 10
		return marginTop + bufferToBottomPage > pageHeight - marginBottom
	}

	function createNewPage() {
		doc.addPage()
		marginTop = INITIAL_UPPER_PAGE_COORDINATE
	}

	function handleRichTextEditorBlock(block: Element) {
		const parser = new DOMParser()
		const parsedBlockContent = parser.parseFromString(
			block.textContent ?? '',
			'text/html'
		)
		const HTMLElements: HTMLCollection = parsedBlockContent.body.children

		for (const element of HTMLElements) {
			switch (element.tagName.toLowerCase()) {
				case 'h1':
					handleText(element.textContent ?? '', 20, 'bold')
					break
				case 'h2':
					handleText(element.textContent ?? '', 16, 'bold')
					break
				case 'h3':
					handleText(element.textContent ?? '', 14, 'bold')
					break
				case 'p':
					processParagraph(element)
					break
				case 'strong':
					handleText(
						element.textContent ?? '',
						DEFAULT_FONT_SIZE,
						'bold'
					)
					break
				case 'em':
					handleText(
						element.textContent ?? '',
						DEFAULT_FONT_SIZE,
						'italic'
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

	function handleText(
		text: string,
		fontSize: number,
		fontStyle: 'normal' | 'bold' | 'italic',
		indent = 0
	) {
		const textWithPlaceholder = placeholderStore.fillPlaceholder(text)
		doc.setFontSize(fontSize)
		doc.setFont('helvetica', fontStyle)

		const wrappedText: string[] = doc.splitTextToSize(
			textWithPlaceholder ?? '',
			pageWidth - (35 - indent)
		)

		for (const line of wrappedText) {
			if (contentExceedsCurrentPage()) {
				createNewPage()
			}

			const horizontalSpacing = 10
			doc.text(line, horizontalSpacing, marginTop)
			incrementVerticalPositionForNextLine()
		}
	}

	function processParagraph(paragraph: Element) {
		for (const node of paragraph.childNodes) {
			if (node.nodeType === Node.TEXT_NODE) {
				handleText(node.textContent ?? '', DEFAULT_FONT_SIZE, 'normal')
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				const element = node as Element
				let fontStyle: 'normal' | 'bold' | 'italic' = 'normal'
				if (element.tagName.toLowerCase() === 'strong') {
					fontStyle = 'bold'
				} else if (element.tagName.toLowerCase() === 'em') {
					fontStyle = 'italic'
				}
				handleText(
					element.textContent ?? '',
					DEFAULT_FONT_SIZE,
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
					handleText(
						bullet + firstParagraph.textContent,
						10,
						'normal',
						indent
					)
					firstParagraph.remove() // Prevent duplicate text processing
				} else {
					handleText(
						bullet + (li.textContent ?? ''),
						10,
						'normal',
						indent
					)
				}

				// Check for nested lists inside this list item
				// biome-ignore lint/complexity/noForEach: <explanation>
				Array.from(li.children).forEach((child) => {
					if (
						child.tagName.toLowerCase() === 'ul' ||
						child.tagName.toLowerCase() === 'ol'
					) {
						processList(child, indent + 10) // Increase indent for nested lists
					}
				})
			}
		})
	}

	function renderTextLine(text: string) {
		if (contentExceedsCurrentPage()) {
			createNewPage()
		}
		const horizontalSpacing = 10
		doc.text(text, horizontalSpacing, marginTop)
		incrementVerticalPositionForNextLine()
	}

	async function loadImage(base64: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.onload = () => {
				resolve(img)
			}
			img.onerror = (error) => reject(error)
			img.src = base64
		})
	}

	function getImageScaleFactor(scale: string) {
		switch (scale.toLowerCase()) {
			case 'small':
				return 0.25
			case 'medium':
				return 0.5
			case 'large':
				return 1
			default:
				return 0.25
		}
	}

	async function processImageForPdfGeneration(block: Element) {
		const content = block.textContent
		if (!content) {
			return
		}

		const parsedContent = JSON.parse(content) as ImageData
		const imageSource = parsedContent.base64Data
		if (!imageSource) {
			return
		}

		const image = await loadImage(imageSource)
		const format = content.split(';')[0].split('/')[1]

		const maxWidth = 186
		const scaleFactor = getImageScaleFactor(parsedContent.scale)

		const aspectRatio = image.height / image.width

		const width = scaleFactor * maxWidth
		const height = width * aspectRatio

		if (contentExceedsCurrentPage(height)) {
			createNewPage()
		}

		doc.addImage(
			imageSource,
			format.toUpperCase(),
			10,
			marginTop,
			width,
			height
		)

		const padding = Math.round(height) + DEFAULT_LINE_HEIGHT
		incrementVerticalPositionForNextLine(padding)
	}

	function processSignalListForPdfGeneration(block: Element) {
		if (!block.textContent) {
			console.error('No content found in Signal List Block')
			return
		}
		const blockId = block.getAttribute('id')
		const parsedBlockContent = JSON.parse(
			block.textContent
		) as SignalListOnSCD

		const selectedRows = parsedBlockContent.selected
		const tableRows = parsedBlockContent.matches.matchedRowsForTablePdf

		const rows = tableRows.flatMap((row) => {
			return row.matchedFilteredValuesForPdf
		})
		const header = selectedRows.map((r) => ({
			value: r.column1,
			type: 'string'
		}))
		const individualRows = rows.map((row) =>
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

	function processTableForPdfGeneration(block: Element) {
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
			row.map((cell) => (cell = placeholderStore.fillPlaceholder(cell)))
		)

		let rows = data[0].length
		let maxNeededRows = rows

		filledBody[0].forEach((row) => {
			const entries = row.split(', ').length
			if (entries > maxNeededRows) {
				maxNeededRows = entries
			}
		})

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
			startY: marginTop,
			margin: {
				left: 10
			},
			headStyles: {
				fillColor: 'black'
			}
		})

		const tableHeight = rows * DEFAULT_LINE_HEIGHT + DEFAULT_LINE_HEIGHT
		if (contentExceedsCurrentPage(tableHeight)) {
			createNewPage()
		} else {
			incrementVerticalPositionForNextLine(tableHeight)
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

function generateTableBody(tableRows: string[][], tableHeader: TableHeader[]) {
	const generatedRows = tableRows.map((row) => {
		return tableHeader.reduce(
			(acc: Record<string, string>, col, index) => {
				acc[col.dataKey as string] = row[index]
				return acc
			},
			{} as Record<string, string>
		)
	})
	return generatedRows
}

type TableHeader = {
	header: string
	dataKey: keyof typeof SignalType | keyof typeof Columns
}

function generateTableHeader(selectedRows: SignalRow[]): TableHeader[] {
	return selectedRows.map((row) => ({
		header: row.column1,
		dataKey: row.searchKey
	}))
}

function downloadAsPdf(templateId: string) {
	const template = docTemplatesStore.getDocumentTemplate(templateId)
	if (!template) {
		console.error('Template not found')
		return
	}
	const templateTitle = template.getAttribute('title') ?? 'N/A'
	const allBlocks: NodeList = template.querySelectorAll('Block')
	const blockConvertedToArray: Element[] =
		Array.prototype.slice.call(allBlocks)
	generatePdf(templateTitle, blockConvertedToArray)
}

export const pdfGenerator = {
	downloadAsPdf
}
