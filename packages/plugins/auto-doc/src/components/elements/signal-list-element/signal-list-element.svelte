<script lang="ts">
    import {signallistStore} from '@/stores'

	import SignalRow from './signal-row.svelte';
	import type { SignalRow as SignalRowType, HintText } from './types.signal-list';
	import {signalColumns,  messageTypes} from './signal-list';
	export let onContentChange: (newContent: string) => void;

	const signallist = signallistStore.getSignallist();
	console.log('Message Publishers:', signallist.messagePublishers);
    console.log('Message Subscribers:', signallist.messageSubscribers);
    console.log('Invalidities Reports:', signallist.invaliditiesReports);

	const columns: SignalRowType[] = signalColumns.map((col, i) => {
		return {
			index: i,
			searchKey: col,
			isSelected: false,
			column1: col,
			column2: "",
			label: {
				col1Label: {name: col, hasSuffix: true},
				col2Label: {name: `Filter by ${col}`, hasSuffix: false}
			}
		}
	})

	const messages: SignalRowType[] = messageTypes.map((message, i) => {
		return {
			index: (signalColumns.length + i),
			searchKey: message,
			isSelected: false,
			column1: message,
			column2: "",
			label: {
				col1Label: {name: message, hasSuffix: true},
				col2Label: {name: "Filter by IED Name", hasSuffix: false}
			}
		}
	})

	$: mergedColsAndMessages = [...columns, ...messages];
	$: selectedRows = mergedColsAndMessages.filter(row => row.isSelected);

	const columnsHintText: HintText = {
		col1Hint: "Choose the columns you want to display and rename if needed",
		col2Hint: "Use the filter to limit the content of the columns to certain values"
	}

	function updateSignalRow(index: number, key: keyof SignalRowType, value: string) {
    	mergedColsAndMessages = mergedColsAndMessages.map((row, i) => i === index ? { ...row, [key]: value } : row);
		searchForMatchOnSignalList();
		emitSelectedRows();
	}

	function toggleAllCheckboxes(newValue: boolean) {
		mergedColsAndMessages = mergedColsAndMessages.map(row => ({...row, isSelected: !newValue}));
		emitSelectedRows();
	}

	function emitSelectedRows() {
        onContentChange({ columns: selectedRows});
    }


	function searchForMatchOnSignalList(){
	return;
	}
</script>


<article class="signal-list">
	{#each mergedColsAndMessages as row (row.index)}
		<SignalRow 
			idx={row.index}
			label={row.label}
			hintText={columnsHintText}
			bind:isSelected={row.isSelected}
			bind:column1={row.column1}
			bind:column2={row.column2}
			on:update={e => updateSignalRow(row.index, e.detail.key, e.detail.value)}
			on:toggleAllCheckboxes={e => toggleAllCheckboxes(e.detail.value)}
		/>
	{/each}
</article>

<style lang="scss">
	.signal-list{
		width: 99%;
	}
</style>