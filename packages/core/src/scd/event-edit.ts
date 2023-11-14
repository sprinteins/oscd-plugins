// {parent: this.doc.documentElement, node: templates}

type DetailEdit = {
	parent: Element
}
function newEditEvent(edit) {
	return new CustomEvent("oscd-edit", {
		composed: true,
		bubbles:  true,
		detail:   edit,
	})
}

function newActionEvent(action, eventInitDict) {
	return new CustomEvent("editor-action", {
		bubbles:  true,
		composed: true,
		...eventInitDict,
		detail:   {action, ...eventInitDict?.detail},
	})
}