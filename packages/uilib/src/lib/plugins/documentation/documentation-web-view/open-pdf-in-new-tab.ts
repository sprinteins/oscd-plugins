export enum PdfType {
    Documentation = 1,
    Telegram,
  }


export async function exportPdfInNewTab(type: PdfType) {
	let printContent: Element | null | undefined = undefined
	let websiteRunsInLocalUiLib = false

	if (type === PdfType.Telegram) {
		printContent = document
			?.querySelector("open-scd")?.shadowRoot
			?.querySelector(".editor")?.shadowRoot
			?.querySelector("#tscd-documentation-print-content-communication")

	} else if (type === PdfType.Documentation) {
		printContent = document
			?.querySelector("open-scd")?.shadowRoot
			?.querySelector(".editor")?.shadowRoot
			?.querySelector("#tscd-documentation-print-content-documentation")
	} else {
		alert("unknown pdf export type")
		return
	}

	// just for debugging puroses, so it works in uilib
	if (printContent === undefined) {
		if(type === PdfType.Telegram) {
			printContent = document.querySelector("#tscd-documentation-print-content-communication")
		} else if (type === PdfType.Documentation) {
			printContent = document.querySelector("#tscd-documentation-print-content-documentation")
		}
		// make 100% sure, code runs in uilib 
		if(printContent !== undefined) {
			websiteRunsInLocalUiLib = true
		}
	}

	const printPreview = window.open("about:blank", "_blank")
	printPreview?.document.write(printContent?.innerHTML ?? "")

	const newStyleSheetElement = printPreview?.document.createElement("style")
	if (newStyleSheetElement == null) {
		alert("Unexpected Error. Could not open new tab")
		return
	}

	const newStyleSheet = printPreview?.document
		.querySelector("head")
		?.appendChild(newStyleSheetElement).sheet

	const globalStyleSheet = getGlobalStyleSheet()
	globalStyleSheet.forEach((rule) => {
		if (newStyleSheet != null) {
			newStyleSheet.insertRule(rule)
		}
	})
	setTimeout(() => {
		if (websiteRunsInLocalUiLib === false) {
			printPreview?.print()
			printPreview?.close()
		}
	}, 200)
}

function getGlobalStyleSheet() {
	const documentStyles = document.styleSheets

	const openScdStyles =
      document.querySelector("open-scd")?.shadowRoot?.styleSheets

	const editorStyles = document
		?.querySelector("open-scd")
		?.shadowRoot?.querySelector(".editor")?.shadowRoot?.styleSheets

	const allStyleSheets = [
		...Array.from(documentStyles),
		...Array.from(openScdStyles ?? []),
		...Array.from(editorStyles ?? []),
	]

	const documentStylesheet = allStyleSheets.reduce(
		(sum: string[], sheet: CSSStyleSheet) => {
			try {
				return [
					...sum,
					...Array.from(sheet.cssRules).map((rule) => rule.cssText),
				]
			} catch (e) {
				return sum
			}
		},
		[],
	)

	return documentStylesheet
}