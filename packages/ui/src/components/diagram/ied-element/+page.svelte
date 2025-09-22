<script lang="ts">
import { IEDElement } from '.'
import { Example } from '../../internal'
import type { IEDNode } from '../nodes'

const node: IEDNode = {
	id: '0',
	iedWidth: 200,
	iedHeight: 30,
	bayLabelHeight: 15,
	bayLabelGap: 2,
	label: 'some longer IED name',
	isRelevant: true,
	children: []
}
</script>

<label>width:<input type="range" min="200" max="500" step="10" bind:value={node.iedWidth} /></label>
<label>height:<input type="range" min="30" max="100" step="10" bind:value={node.iedHeight} /></label>
<hr />

<Example name="IED Element">
	
	<div class="container" style={`--width:${node.iedWidth}px; --height:${node.iedHeight}px;`}>
		<IEDElement {node}/>
	</div>

</Example>

<Example name="Disabled IED Element">
	<div class="container" style={`--width:${node.iedWidth}px; --height:${node.iedHeight}px;`}>
		<IEDElement {node} disabled={true} />
	</div>

</Example>

<Example name="Selected IED Element">
	<div class="container" style={`--width:${node.iedWidth}px; --height:${node.iedHeight}px;`}>
		<IEDElement {node} isIEDSelected={true} isBaySelected={true} />
	</div>

</Example>

<style>
	.container {
		width: var(--width,200px);
		height: var(--height,30px);
	}
</style>
