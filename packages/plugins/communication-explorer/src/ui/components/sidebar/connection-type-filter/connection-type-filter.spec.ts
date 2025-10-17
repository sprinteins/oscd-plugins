/* eslint-disable no-mixed-spaces-and-tabs */
import { describe, expect, it } from "vitest"
import { FilterChip } from "../../../../components/filter-chip"
import { render, screen } from "@testing-library/svelte"

describe("Connection Type Filter", () => {
	describe("Incoming Publisher", () => {

        type TestCase = {
            desc: string
            label: string
			expectedLabel: string
			isSelected: boolean
			expectedClasses?: string[]
        }

        const featureTests: TestCase[] = [
        	{
        		desc:          "incoming chip has incoming === true",
        		label:         "Publisher",
        		expectedLabel: "Publisher",
        		isSelected:    true,
        	},
        ]

        featureTests.forEach(testFeature)

        function testFeature(tc: TestCase) {
        	it(tc.desc, () => {
        		//
        		// Arrange
        		//
        		const props = {
        			label:      tc.label,
        			testid:     "incoming-chip",
        			isSelected: true,
        		}

        		//
        		// Act
        		//
        		
        		render(FilterChip, props)

        		//
        		// Assert
        		//
        		const chip = screen.getByTestId("incoming-chip")
        		const incomingProp = chip.querySelector(".button-label")
        		expect(incomingProp?.innerHTML, incomingProp?.outerHTML).toEqual(tc.expectedLabel)
        		tc.expectedClasses?.forEach( cssClass => expect(Array.from(chip.classList)).toContain(cssClass) )


        	})
        }

	})
})

