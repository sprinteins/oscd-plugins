import type { IEDService } from '@oscd-plugins/core'
import type jsPDF from 'jspdf'
import type { PdfPageManager } from './pdf/page-manager'
import { PDF_CONSTANTS } from './pdf/constants'
import type { CommunicationElementParameters } from '@/ui/components/elements/communication-element'
import type { FontStyle } from 'jspdf-autotable'

export function writeCommunicationContentToPdf(
	doc: jsPDF,
	pageManager: PdfPageManager,
	pageWidth: number,
	iedService: IEDService,
	parameters: CommunicationElementParameters
): void {
	const DEFAULT_LINE_HEIGHT = PDF_CONSTANTS.DEFAULT_LINE_HEIGHT
	const DEFAULT_FONT_SIZE = PDF_CONSTANTS.DEFAULT_FONT_SIZE

	function renderText(
		text: string,
		fontSize: number = DEFAULT_FONT_SIZE,
		fontStyle: FontStyle = 'normal',
		indent = 0
	) {
		doc.setFontSize(fontSize)
		doc.setFont('helvetica', fontStyle)

		const TEXT_MARGIN = 35
		const wrappedText: string[] = doc.splitTextToSize(
			text,
			pageWidth - (TEXT_MARGIN - indent)
		)

		for (const line of wrappedText) {
			pageManager.ensureSpace()

			const horizontalSpacing = PDF_CONSTANTS.HORIZONTAL_SPACING + indent
			doc.text(line, horizontalSpacing, pageManager.getCurrentPosition())
			pageManager.incrementPosition(DEFAULT_LINE_HEIGHT)
		}
	}

	function renderHeading(text: string, fontSize: number) {
		pageManager.ensureSpace(fontSize)
		renderText(text, fontSize, 'bold')
		pageManager.incrementPosition(2)
	}

	const selectedBaysSet = new Set(parameters.selectedBays)
	const allBays = Array.from(iedService.Bays()).sort()
	const relevantBays =
		selectedBaysSet.size > 0 ? Array.from(selectedBaysSet).sort() : allBays

	const allIEDs = iedService.IEDCommunicationInfos()
	const relevantIEDs =
		selectedBaysSet.size === 0
			? allIEDs
			: allIEDs.filter((ied) => {
					if (!ied.bays || ied.bays.size === 0) return false
					return Array.from(ied.bays).some((bay) =>
						selectedBaysSet.has(bay)
					)
				})

	if (parameters.showLegend) {
		renderHeading('Message Type Legend', 14)

		const messageTypes = [
			{
				name: 'MMS',
				color: { r: 50, g: 83, b: 168 } // #3253A8
			},
			{
				name: 'GOOSE',
				color: { r: 40, g: 132, b: 9 } // #288409
			},
			{
				name: 'Sampled Values',
				color: { r: 199, g: 60, b: 97 } // #C73C61
			},
			{
				name: 'Unknown',
				color: { r: 1, g: 27, b: 34 } // #011B22
			}
		]

		const itemsPerRow = 2
		let currentItem = 0
		const iconRadius = 1.5

		while (currentItem < messageTypes.length) {
			pageManager.ensureSpace()

			const rowItems = messageTypes.slice(
				currentItem,
				currentItem + itemsPerRow
			)
			const columnWidth = (pageWidth - 20) / itemsPerRow
			const currentY = pageManager.getCurrentPosition()

			for (let i = 0; i < rowItems.length; i++) {
				const messageType = rowItems[i]
				const xOffset =
					PDF_CONSTANTS.HORIZONTAL_SPACING + i * columnWidth

				doc.setFillColor(
					messageType.color.r,
					messageType.color.g,
					messageType.color.b
				)
				doc.circle(
					xOffset + iconRadius,
					currentY - 1.5,
					iconRadius,
					'F'
				)

				doc.setFontSize(DEFAULT_FONT_SIZE)
				doc.setTextColor(0, 0, 0)
				doc.text(messageType.name, xOffset + iconRadius * 3, currentY)
			}

			currentItem += itemsPerRow
			pageManager.incrementPosition(DEFAULT_LINE_HEIGHT)
		}

		pageManager.incrementPosition(5)
	}

	if (parameters.showBayList) {
		renderHeading('List of Bays', 14)

		if (relevantBays.length > 0) {
			for (const bay of relevantBays) {
				renderText(`• ${bay}`, DEFAULT_FONT_SIZE, 'normal', 5)
			}
		} else {
			renderText('No bays found', DEFAULT_FONT_SIZE, 'italic', 5)
		}

		pageManager.incrementPosition(5)
	}

	if (parameters.showIEDList) {
		renderHeading('List of IEDs', 14)

		if (relevantIEDs.length > 0) {
			for (const ied of relevantIEDs) {
				pageManager.ensureSpace(30)

				renderText(ied.iedName, 12, 'bold')

				if (ied.bays && ied.bays.size > 0) {
					const baysList = Array.from(ied.bays).join(', ')
					renderText(
						`Bays: ${baysList}`,
						DEFAULT_FONT_SIZE,
						'normal',
						5
					)
				}

				if (ied.iedDetails) {
					if (ied.iedDetails.logicalNodes.length > 0) {
						renderText(
							'Logical Nodes:',
							DEFAULT_FONT_SIZE,
							'bold',
							5
						)
						for (const node of ied.iedDetails.logicalNodes) {
							renderText(`- ${node}`, 9, 'normal', 10)
						}
					}

					if (ied.iedDetails.dataObjects.length > 0) {
						renderText(
							'Data Objects:',
							DEFAULT_FONT_SIZE,
							'bold',
							5
						)
						for (const obj of ied.iedDetails.dataObjects) {
							renderText(`- ${obj}`, 9, 'normal', 10)
						}
					}

					if (ied.iedDetails.dataAttributes.length > 0) {
						renderText(
							'Data Attributes:',
							DEFAULT_FONT_SIZE,
							'bold',
							5
						)
						for (const attr of ied.iedDetails.dataAttributes) {
							renderText(`- ${attr}`, 9, 'normal', 10)
						}
					}
				}

				pageManager.incrementPosition(5)
			}
		} else {
			renderText('No IEDs found', DEFAULT_FONT_SIZE, 'italic', 5)
		}
	}
}
