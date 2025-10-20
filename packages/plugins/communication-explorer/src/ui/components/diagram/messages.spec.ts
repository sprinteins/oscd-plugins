import { render, screen, fireEvent, act } from "@testing-library/svelte"
import {describe, it, expect } from "vitest"

import Message  from "./message.svelte"
import type { IEDConnection } from "./nodes"



describe("Messages", () => {

	type TestCase = {
		desc: string,
		isSelected: boolean,
		isSelectedClassExpected: boolean,
	}

	const featureTests: TestCase[] = [
		{
			desc:                    "has selected class if isSelected is true",
			isSelected:              true,
			isSelectedClassExpected: true,
		},
		{
			desc:                    "does not have selected class if isSelected is false",
			isSelected:              false,
			isSelectedClassExpected: false,
		},
	]

	featureTests.forEach(testIsSelectedAttribute)

	function testIsSelectedAttribute(tc: TestCase) {
		it(tc.desc, () => {
	
			const connection: IEDConnection = {
				id:       "not_relevant",
				sources:  [],
				targets:  [],
				sections: [
					{
						id:         "connection",
						startPoint: {x: 0, y: 0},
						endPoint:   {x: 0, y: 200},
						bendPoints: [],
					},
				],
			}
	
			render(Message, { edge: connection, isSelected: tc.isSelected, testid: "connection" })
			const element = screen.getByTestId("connection")
			expect(element).toBeDefined
			if(tc.isSelectedClassExpected) {
				expect(Array.from(element.classList)).toContain("selected")
			} else {
				expect(Array.from(element.classList)).not.toContain("selected")
			}
		})
	}

})
