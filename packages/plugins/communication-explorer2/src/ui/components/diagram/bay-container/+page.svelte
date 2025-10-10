<script lang="ts">
	import { BayContainer } from "."
	 //TODO: in readme it is stated, to not use internal package in app
	import { Example } from "../../../utils/internal/example"
	import type { BayElkNode, IEDElkNode } from "../nodes"

	const iedElkNode1: IEDElkNode = {id: "0", width: 150, height: 50, label: "IED 1", isRelevant: true, children:[]}
	const iedElkNode2: IEDElkNode = {id: "1", width: 150, height: 50, label: "IED 2", isRelevant: true, children:[]}
	const iedElkNode3: IEDElkNode = {id: "2", width: 250, height: 50, label: "IED 3", isRelevant: true, children:[]}
	const node: BayElkNode = {
		id:        "1",
		isBayNode: true,
		children:  [
			iedElkNode1,
			iedElkNode2,
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
