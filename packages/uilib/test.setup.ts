import {cleanup} from "@testing-library/svelte"
import { afterEach } from "vitest"

// for some reason this is not there by default
// even if the articale says it is: 
// https://testing-library.com/docs/svelte-testing-library/api/#cleanup
afterEach(() => {
	cleanup()
})
