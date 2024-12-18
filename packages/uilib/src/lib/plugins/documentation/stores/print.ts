import { writable } from 'svelte/store'
//==== INITIALIZER

const PRINTABLE_INIT_CONSTANT = {
	telemetry: {
		isSelected: false,
		selector: 'svg',
		element: null
	},
	documentation: {
		isSelected: false,
		selector: null,
		element: null
	}
} as const

//==== STATE

const printableElements = writable({
	telemetry: { ...PRINTABLE_INIT_CONSTANT.telemetry },
	documentation: { ...PRINTABLE_INIT_CONSTANT.documentation }
})

//==== ACTIONS

function selectCurrentPrintableElement(
	type: keyof typeof PRINTABLE_INIT_CONSTANT
) {
	printableElements.update((printableElements) => {
		for (const key in printableElements) {
			printableElements[key] = {
				...printableElements[key],
				isSelected: key === type
			}
		}
		return printableElements
	})
}

export default {
	// constants
	PRINTABLE_INIT_CONSTANT,
	//state
	printableElements,
	//actions
	selectCurrentPrintableElement
}
