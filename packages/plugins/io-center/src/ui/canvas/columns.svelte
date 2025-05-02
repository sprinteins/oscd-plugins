<script lang="ts">
// CONSTANTS
import { LOGICAL_KIND } from '@/headless/constants'
// STORES
import { iedStore, logicalStore } from '@/headless/stores'
// ACTIONS
import { calculateCoordinates } from '@/headless/actions'
// COMPONENTS
import Container from './container.svelte'
import NodeCard from './node-card.svelte'
</script>
	

<article 
	use:calculateCoordinates
	class="grid grid-cols-3 h-full p-2 gap-2"
>
	<Container title="Data Objects" >
		{#if iedStore.selectedDataObject}
			<NodeCard title={iedStore.selectedDataObject.name} node={iedStore.selectedDataObject} />
		{/if}
	</Container>

	<Container title="Logical Conditioners">
		{#each logicalStore.conditioners.selected as logicalConditioner (logicalConditioner.id)}
			<NodeCard title={logicalConditioner.name} node={logicalConditioner} logicalKind={LOGICAL_KIND.conditioner}/>
		{/each}
	</Container>

	<Container title="Logical Physicals">
		{#each logicalStore.physicals.selected as logicalPhysical (logicalPhysical.id)}
			<NodeCard title={logicalPhysical.name} node={logicalPhysical} logicalKind={LOGICAL_KIND.physical}/>
		{/each}
	</Container>
</article>