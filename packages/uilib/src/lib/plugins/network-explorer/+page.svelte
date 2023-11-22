<script lang="ts">
	import { NetworkExplorer } from "."
	import { xmlStr } from "../../../test-files/.local_demo"
	import { Example } from "../../components/internal"

	const parser = new DOMParser()
	const doc = parser.parseFromString(
		xmlStr,
		"text/xml"
	) as unknown as Element
</script>

<Example name="Network Explorer">
	<NetworkExplorer root={doc} />
</Example>
