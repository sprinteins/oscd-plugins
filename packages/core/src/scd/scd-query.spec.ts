import { expect, suite, test } from "vitest"
import { GSEElement, SCDQueries } from "./scd-query"

suite("SCD Queries", () => {
	suite("GSE Queries", () => {

		interface TestCase {
			desc:   string
			xmlStr: string
			expectedElements: Partial<GSEElement>[]
		}

		const featureTests: TestCase[] = [
			{
				desc:             "first test",
				xmlStr:           "<GSE ldInst=\"CircuitBreaker_CB1\" cbName=\"GCB\"></GSE>",
				expectedElements: [
					{
						ldInst: "CircuitBreaker_CB1",
						cbName: "GCB",
					},
				],
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			test(tc.desc, () => {
				// 
				// Arrange
				// 
				const parser = new DOMParser()
				const doc = parser.parseFromString(tc.xmlStr, "text/xml") as unknown as Element
				const scdQuery = new SCDQueries(doc)

				// 
				// Action
				//
				const gses = scdQuery.searchGSEs()

				// 
				// Assert	
				// 
				tc.expectedElements.forEach( el => gses.some( gse => expect(gse).toMatchObject(el)) )

			})
		}
	}) // GSE Queries

}) // SCD Queries