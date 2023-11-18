<script lang="ts">
	import { IEDElement } from "."
	import { Example } from "../../internal"
	import type { IEDNode } from "../nodes"

	const node: IEDNode = {id: "0", width: 200, height: 100, label: "some longer IED name", isRelevant: true}

	let containerWidth = 200
	let containerHeight = 30

</script>

<label>width:<input type="range" min="200" max="500" step="10" bind:value={containerWidth} /></label>
<label>height:<input type="range" min="30" max="100" step="10" bind:value={containerHeight} /></label>
<hr />

<Example name="IED Element">
	
	<div class="container" style={`--width:${containerWidth}px; --height:${containerHeight}px;`}>
		<IEDElement {node}/>
	</div>

</Example>

<Example name="Disabled IED Element">
	<div class="container" style={`--width:${containerWidth}px; --height:${containerHeight}px;`}>
		<IEDElement {node} disabled={true} />
	</div>

</Example>

<Example name="Selected IED Element">
	<div class="container" style={`--width:${containerWidth}px; --height:${containerHeight}px;`}>
		<IEDElement {node} isSelected={true} />
	</div>

</Example>

<style>
	.container {
		width: var(--width,200px);
		height: var(--height,30px);
	}
</style>
