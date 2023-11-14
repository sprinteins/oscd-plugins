<script lang="ts">
	import { TypeSwitcher } from "."
	import { Example } from "../../components/internal"
	import { xmlStr } from "../../../test-files/simple_v5"

	const parser = new DOMParser()
	const doc = parser.parseFromString(
		xmlStr,
		"text/xml"
	) as unknown as Element
</script>

<Example name="Type Switcher Plugin">
	<container>
		<TypeSwitcher {doc} />
	</container>
</Example>

<style>
	container {
		height: 70vh;
		display: block;
	}
</style>
