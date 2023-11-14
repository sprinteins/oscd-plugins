const disableElementsByID = [
	"menu",
	"log",
	"diagnostic",
	"info",
	"warning",
	"error",
	"issue",
	"pluginManager",
	"pluginAdd",
	"settings",
] as const

const disableElementsByComponentName = [
	"mwc-circular-progress-four-color",
	"wizard-dialog",
] as const

export function disableOpenSCDComponentsForPrintView() {
	const openSCDHeader = document.querySelector("open-scd")

	if (openSCDHeader !== null) {
		disableElementsByID.forEach((elementID) => {
			createCSSRuleByID(openSCDHeader, "id", elementID)
		})

		disableElementsByComponentName.forEach((elementName) => {
			createCSSRuleByID(openSCDHeader, "component", elementName)
		})
	}
}


function createCSSRuleByID(
	component: Element,
	type: "id" | "component",
	name: string,
) {
	let rule: string
	const printStylesheet = document.createElement("style")

	if (type === "id") {
		rule = `@media print { #${name} { display: none; } }`
	} else {
		rule = `@media print { ${name} { display: none; } }`
	}

	printStylesheet.innerHTML = rule
	component.shadowRoot?.appendChild(printStylesheet)
}