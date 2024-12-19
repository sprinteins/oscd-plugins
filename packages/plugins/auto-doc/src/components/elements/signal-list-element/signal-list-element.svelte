<script lang="ts">
	import SignalRow from './signal-row.svelte';
	import type { SignalRow as SignalRowType, HintText } from './types.signal-list';
	import {signalColumns, messageColumns} from './signal-list';



	let rows: SignalRowType[] = signalColumns.map((col, i) => {
		return {
			index: i,
			isSelected: false,
			column1: col,
			column2: ""
		}
	})

	let messages: SignalRowType[] = messageColumns.map((message, i) => {
		return {
			index: i,
			isSelected: false,
			column1: message,
			column2: ""
		}
	})

	const messageHintText: HintText = {
		col1: "Choose the message types you want to display",
		col2: "Filter Target IEDS with Regex"
	}
	const columnsHintText: HintText = {
		col1: "Choose the columns you want to display",
		col2: "Use Regex to filter columns"
	}

	function updateSignalRow(index: number, key: keyof SignalRowType, value: string) {
    	rows = rows.map((row, i) => i === index ? { ...row, [key]: value } : row);
}
</script>


<article class="signal-list">

	{#each rows as row (row.index)}
		<SignalRow 
			idx={row.index}
			label="Column"
			hintText={columnsHintText}
			bind:isSelected={row.isSelected}
			bind:column1={row.column1}
			bind:column2={row.column2}
			on:update={e => updateSignalRow(row.index, e.detail.key, e.detail.value)}
		/>
	{/each}
	{#each messages as message (message.index)}
		<SignalRow 
			idx={message.index}
			label={"Message type"}
			hintText={messageHintText}
			bind:isSelected={message.isSelected}
			bind:column1={message.column1}
			bind:column2={message.column2}
			on:update={e => updateSignalRow(message.index, e.detail.key, e.detail.value)}
		/>
	{/each}
	
</article>

<style lang="scss">
	.signal-list{
		width: 99%;
	}
</style>