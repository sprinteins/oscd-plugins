import { render, screen } from "@testing-library/svelte"
import { describe, it, expect } from "vitest"
import { CategorySelector } from "."
import userEvent from "@testing-library/user-event"
import type { ElementCategory } from "./categories"
import { UIState } from "../ui-state"

describe("GroupSelector", () => {

	userEvent.setup()

	const categories: ElementCategory[] = [
		"LN Type",
		"DO Type",
		"DA Type",
		"Enum Type",
	]

	it("rendes the labels", () => {

		// Arrange
	
		// Act
		render(CategorySelector, { testid: "category-selector", labels: categories } )

		// Assert
		for(const choice of categories) {
			const testid = `category-selector_${choice}`
			expect(screen.getByTestId(testid)).toBeTruthy()
		}

	})


	// Cannot figure out why clicks does not work
	it.skip("can select an item", async () => {

		
		// // Arrange
		// const handleChange = vi.fn()
		// const container = await render(CategorySelector, { testid: "category-selector" })
		// container.component.$on("change", handleChange)
		// // container.component.$on("change", console.log)
		// console.log(container.container.innerHTML)
		
		// // Act
		// const element = await screen.getByTestId("category-selector_LN Type")
		// console.log({element: element.outerHTML})
		// // console.log("clicking")
		// await userEvent.click( screen.getByTestId("category-selector_LN Type") )
		// // console.log("clicking done")
		// await fireEvent.click(screen.getByTestId("category-selector_LN Type"))
		// await fireEvent.click(screen.getByTestId("category-selector_LN Type"))
		// await fireEvent.click(screen.getByTestId("category-selector_LN Type"))

		// // fireEvent.click(screen.getByTestId("category-selector_DO Type"))
		// expect(handleChange).toHaveBeenCalledTimes(1)
		// // expect(subscriber).toHaveBeenLastCalledWith("LN Type")


	})

})
