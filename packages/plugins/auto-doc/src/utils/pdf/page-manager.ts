import type jsPDF from 'jspdf'
import { PDF_CONSTANTS } from './constants'

export class PdfPageManager {
	private currentMarginTop: number

	constructor(
		private readonly doc: jsPDF,
		private readonly pageHeight: number,
		private readonly marginBottom: number,
		initialMarginTop: number
	) {
		this.currentMarginTop = initialMarginTop
	}

	getCurrentPosition(): number {
		return this.currentMarginTop
	}

	incrementPosition(
		lineHeight: number = PDF_CONSTANTS.DEFAULT_LINE_HEIGHT
	): void {
		this.currentMarginTop += lineHeight
	}

	contentExceedsPage(
		contentHeight: number = PDF_CONSTANTS.PAGE_BUFFER
	): boolean {
		return (
			this.currentMarginTop + contentHeight >
			this.pageHeight - this.marginBottom
		)
	}

	createNewPage(): void {
		this.doc.addPage()
		this.currentMarginTop = PDF_CONSTANTS.INITIAL_PAGE_MARGIN
	}

	ensureSpace(contentHeight?: number): void {
		if (this.contentExceedsPage(contentHeight)) {
			this.createNewPage()
		}
	}
}
