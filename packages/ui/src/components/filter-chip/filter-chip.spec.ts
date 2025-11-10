/* eslint-disable no-mixed-spaces-and-tabs */
import { describe, it, expect } from "vitest"
import { FilterChip } from "."
import { render, screen } from "@testing-library/svelte"

describe("Filter Chip", () => {

	describe("rendering", () => {

        type TestCase = {
            desc: string
			label: string
			expectedLabel: string
			isSelected: boolean
			expectedClasses?: string[]
        }

        const featureTests: TestCase[] = [
        	{
        		desc:          "chip shows given label",
        		label:         "select me",
        		expectedLabel: "select me",
        		isSelected:    false,
        	},
        	{
        		desc:          "chip is rendered even with empty label",
        		label:         "",
        		expectedLabel: "",
        		isSelected:    false,
        	},
        	{
        		desc:            "it has the class isSelected when isSelected === true",
        		label:           "",
        		expectedLabel:   "",
        		isSelected:      true,
        		expectedClasses: ["isSelected"],
        	},
        ]

        featureTests.forEach(testFeature)

        function testFeature(tc: TestCase) {
        	// eslint-disable-next-line @typescript-eslint/no-empty-function
        	it(tc.desc, () => {
        		// 
        		// Arrange
        		// 

        		//
        		// Act
        		//
        		const props = {
        			label:      tc.label, 
        			testid:     "a-chip", 
        			isSelected: tc.isSelected,
        		}
        		render(FilterChip, props)

        		// 
        		// Assert
        		// 
        		const chip = screen.getByTestId("a-chip")
        		const buttonLabel = chip.querySelector(".button-label")
        		expect(buttonLabel?.innerHTML).toEqual(tc.expectedLabel)
        		tc.expectedClasses?.forEach( cssClass => expect(Array.from(chip.classList)).toContain(cssClass) )

        		
        		// screen.getByText("")

        	})
        }

	})

})