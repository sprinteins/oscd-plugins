export function removeInstanceWarningAndIssueToast(node: HTMLElement) {
	const oscdElement = document.querySelector('open-scd')
	const oscdElementShadowRoot = oscdElement?.shadowRoot

	const oscdHistoryElement =
		oscdElementShadowRoot?.querySelector('oscd-history')
	const oscdHistoryElementShadowRoot = oscdHistoryElement?.shadowRoot

	const warningElement =
		oscdHistoryElementShadowRoot?.getElementById('warning')
	const issueElement = oscdHistoryElementShadowRoot?.getElementById('issue')

	$effect(() => {
		if (warningElement && issueElement) {
			warningElement.style.display = 'none'
			issueElement.style.display = 'none'
		}

		return () => {
			if (warningElement && issueElement) {
				warningElement.style.display = 'block'
				issueElement.style.display = 'block'
			}
		}
	})
}
