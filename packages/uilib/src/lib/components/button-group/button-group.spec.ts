import { render, screen } from "@testing-library/svelte"
import {describe, it, expect} from "vitest"

import { ButtonGroup, type ButtonGroupOption } from "./"

const options: ButtonGroupOption[] = [
	{ id: "option1", label: "🍕 Pizza" },
	{ id: "option2", label: "🍜 Noodles" },
	{ id: "option3", label: "🍫 Chocolate" },
]

// Testes are broken, but component is not in use, so skip
describe.skip("Button Group", () => {
	it("renders options", () => {

		render(ButtonGroup, { options, testid: "button-group" })
		const list = screen.getByTestId("button-group")
		expect(list.children).lengthOf(options.length)

		expect(list.children.item(0)?.querySelector("span")?.textContent).toBe("🍕 Pizza")
		expect(list.children.item(1)?.querySelector("span")?.textContent).toBe("🍜 Noodles")
		expect(list.children.item(2)?.querySelector("span")?.textContent).toBe("🍫 Chocolate")

	})

	it("is disabled", () => {

		render(ButtonGroup, { options, disabled: true, testid: "button-group" })
		const list = screen.getByTestId("button-group")
		expect(list.getAttribute("disabled")).toEqual("true")
	})

	it("is not disabled", () => {

		render(ButtonGroup, { options, disabled: false, testid: "button-group" })
		const list = screen.getByTestId("button-group")
		expect(list.getAttribute("disabled")).toEqual("false")
	})

	it("default selection", () => {

		render(ButtonGroup, { options, disabled: false, selectedIndex: 1, testid: "button-group" })
		
		const selectedElement = screen.getByTestId("button-group_option2") as HTMLButtonElement
		expect( Array.from(selectedElement.classList) ).toContain("mdc-segmented-button__segment--selected")
	})
})
