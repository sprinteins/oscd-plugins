<script lang="ts">
	import SignalRow from './signal-row.svelte';

	type SignalRowType = {
		index: number;
		isSelected: boolean;
		column1: string;
		column2: string;
	}

	let rows: SignalRowType[] = Array(14).fill(0).map((_, i) => {
		return {
			index: i,
			isSelected: false,
			column1: "",
			column2: ""
		}
	})


	function updateSignalRow(index: number, key: keyof SignalRowType, value: string) {
    	rows = rows.map((row, i) => i === index ? { ...row, [key]: value } : row);
}
</script>


<article class="signal-list">

	{#each rows as row (row.index)}
		<SignalRow 
			idx={row.index}
			bind:isSelected={row.isSelected}
			bind:column1={row.column1}
			bind:column2={row.column2}
			on:update={e => updateSignalRow(row.index, e.detail.key, e.detail.value)}
		/>
	{/each}
	
</article>

<style lang="scss">
	.signal-list{
		width: 99%;
	}
</style>