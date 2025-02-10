

<span>IEDs:</span>
<ul>
	{#each ieds as ied}
		<li>{ied.name}</li>
	{/each}
</ul>



<script lang="ts">

import type { IED } from "./ied";


type Props = {
	ieds: IED[]
}

let {ieds}:Props = $props()

</script>



