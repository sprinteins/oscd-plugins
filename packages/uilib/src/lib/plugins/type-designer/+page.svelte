<script lang="ts">
	import { TypeDesigner } from "."
	import { xmlStr } from "../../../test-files/simple_v5"
	import { Example } from "../../components/internal"

	const parser = new DOMParser()
	const doc = parser.parseFromString(
		xmlStr,
		"text/xml"
	) as unknown as Element
	const editCount = -1
</script>

<Example name="Type Designer">
	<TypeDesigner root={doc} {editCount} />
</Example>
