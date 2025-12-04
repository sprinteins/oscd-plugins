import type { IED, IEDService } from '@oscd-plugins/core'
import type jsPDF from 'jspdf'

interface CommunicationElementParameters {
	selectedBays: string[]
	selectedMessageTypes: string[]
	showLegend: boolean
	showBayList: boolean
	showIEDList: boolean
	zoom: number
	diagramDimensions: { width: number; height: number } | null
}

export function writeCommunicationContentToPdf(
	doc: jsPDF,
	marginTop: number,
	pageHeight: number,
	pageWidth: number,
	marginBottom: number,
	iedService: IEDService,
	parameters: CommunicationElementParameters,
	createNewPage: () => number,
	incrementVerticalPosition: (height?: number) => number
): number {
	const DEFAULT_LINE_HEIGHT = 7
	const DEFAULT_FONT_SIZE = 10
	let currentMarginTop = marginTop

	function contentExceedsCurrentPage(height = 10): boolean {
		return currentMarginTop + height > pageHeight - marginBottom
	}

	function renderText(
		text: string,
		fontSize = DEFAULT_FONT_SIZE,
		fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
		indent = 0
	) {
		doc.setFontSize(fontSize)
		doc.setFont('helvetica', fontStyle)

		const wrappedText: string[] = doc.splitTextToSize(
			text,
			pageWidth - (35 - indent)
		)

		for (const line of wrappedText) {
			if (contentExceedsCurrentPage()) {
				currentMarginTop = createNewPage()
			}

			const horizontalSpacing = 10 + indent
			doc.text(line, horizontalSpacing, currentMarginTop)
			currentMarginTop += DEFAULT_LINE_HEIGHT
		}
	}

	function renderHeading(text: string, fontSize: number) {
		if (contentExceedsCurrentPage(fontSize)) {
			currentMarginTop = createNewPage()
		}
		renderText(text, fontSize, 'bold')
		currentMarginTop += 2 // Extra spacing after heading
	}

	// Get relevant bays and IEDs based on selection
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

	// Render Message Type Legend
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

		// Render in a grid-like layout similar to the component
		const itemsPerRow = 2
		let currentItem = 0
		const iconRadius = 1.5 // Circle radius in mm

		while (currentItem < messageTypes.length) {
			if (contentExceedsCurrentPage()) {
				currentMarginTop = createNewPage()
			}

			const rowItems = messageTypes.slice(currentItem, currentItem + itemsPerRow)
			const columnWidth = (pageWidth - 20) / itemsPerRow

			for (let i = 0; i < rowItems.length; i++) {
				const messageType = rowItems[i]
				const xOffset = 10 + (i * columnWidth)

				// Draw filled circle icon
				doc.setFillColor(messageType.color.r, messageType.color.g, messageType.color.b)
				doc.circle(xOffset + iconRadius, currentMarginTop - 1.5, iconRadius, 'F')

				// Draw text next to icon
				doc.setFontSize(DEFAULT_FONT_SIZE)
				doc.setTextColor(0, 0, 0)
				doc.text(messageType.name, xOffset + (iconRadius * 3), currentMarginTop)
			}

			currentItem += itemsPerRow
			currentMarginTop += DEFAULT_LINE_HEIGHT
		}

		currentMarginTop += 5 // Extra spacing after section
	}

	// Render Bay List
	if (parameters.showBayList) {
		renderHeading('List of Bays', 14)

		if (relevantBays.length > 0) {
			for (const bay of relevantBays) {
				renderText(`• ${bay}`, DEFAULT_FONT_SIZE, 'normal', 5)
			}
		} else {
			renderText('No bays found', DEFAULT_FONT_SIZE, 'italic', 5)
		}

		currentMarginTop += 5 // Extra spacing after section
	}

	// Render IED List with Details
	if (parameters.showIEDList) {
		renderHeading('List of IEDs', 14)

		if (relevantIEDs.length > 0) {
			for (const ied of relevantIEDs) {
				if (contentExceedsCurrentPage(30)) {
					currentMarginTop = createNewPage()
				}

				// IED Name
				renderText(ied.iedName, 12, 'bold')

				// Bays
				if (ied.bays && ied.bays.size > 0) {
					const baysList = Array.from(ied.bays).join(', ')
					renderText(`Bays: ${baysList}`, DEFAULT_FONT_SIZE, 'normal', 5)
				}

				// IED Details
				if (ied.iedDetails) {
					// Logical Nodes
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

					// Data Objects
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

					// Data Attributes
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

				currentMarginTop += 5 // Extra spacing between IEDs
			}
		} else {
			renderText('No IEDs found', DEFAULT_FONT_SIZE, 'italic', 5)
		}
	}

	return currentMarginTop
}
