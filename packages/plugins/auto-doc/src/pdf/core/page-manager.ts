import type jsPDF from 'jspdf'
import {
	DEFAULT_LINE_HEIGHT,
	PAGE_BUFFER,
	INITIAL_PAGE_MARGIN
} from './constants'

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

	incrementPosition(lineHeight: number = DEFAULT_LINE_HEIGHT): void {
		this.currentMarginTop += lineHeight
	}

	contentExceedsPage(contentHeight: number = PAGE_BUFFER): boolean {
		return (
			this.currentMarginTop + contentHeight >
			this.pageHeight - this.marginBottom
		)
	}

	createNewPage(): void {
		this.doc.addPage()
		this.currentMarginTop = INITIAL_PAGE_MARGIN
	}

	ensureSpace(contentHeight?: number): void {
		if (this.contentExceedsPage(contentHeight)) {
			this.createNewPage()
		}
	}
}
