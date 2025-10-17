import { render, screen } from "@testing-library/svelte"
import {describe, it, expect} from "vitest"

import { TypeLinker } from "."

describe("Type Linker", () => {
	it("renders options", () => {

		render(TypeLinker, { testid: "type-linker" })
		const list = screen.getByTestId("type-linker")
		expect(list).toBeTruthy()

	})

})
