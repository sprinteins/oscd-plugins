<script lang="ts">
	import { Example } from "../../../components/internal"
	import GroupCard from "./group-card.svelte"

	export let items: string[] = [
		"phaseA",
		"phaseB",
		"phaseC",
		"phaseD",
	]

</script>
  
<Example name="Group Card">
	<GroupCard icon="dOIcon" {items} on:click={console.log}/>
	<GroupCard icon="dOIcon" items={items.slice(0,2)} on:click={console.log}/>
	<GroupCard icon="dOIcon" items={items.slice(0,1)} on:click={console.log}/>
	<GroupCard icon="dOIcon" items={items.slice(0,3)} on:click={console.log}/>
</Example>
