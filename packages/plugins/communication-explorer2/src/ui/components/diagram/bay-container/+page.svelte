<script lang="ts">
	import { BayContainer } from "."
	 //TODO: in readme it is stated, to not use internal package in app
	import { Example } from "../../../../../../../uilib/src/lib/components/internal/example"
	import type { BayNode, IEDNode } from "../nodes"

	const iedNode1: IEDNode = {id: "0", width: 150, height: 50, label: "IED 1", isRelevant: true, children:[]}
	const iedNode2: IEDNode = {id: "1", width: 150, height: 50, label: "IED 2", isRelevant: true, children:[]}
	const iedNode3: IEDNode = {id: "2", width: 250, height: 50, label: "IED 3", isRelevant: true, children:[]}
	const node: BayNode = {
		id:        "1",
		isBayNode: true,
		children:  [
			iedNode1,
			iedNode2,
			// iedNode3
		],
		width:  200,
		height: 100,
		label:  "BV1",
	}

	let containerWidth = 400
	let containerHeight = 200
</script>

<Example name="Bay container">
	
	<div class="container" style={`--width:${containerWidth}px; --height:${containerHeight}px;`}>
		<BayContainer {node}/>
	</div>

</Example>

<style>
	.container {
		width: var(--width,200px);
		height: var(--height,30px);
	}
</style>
