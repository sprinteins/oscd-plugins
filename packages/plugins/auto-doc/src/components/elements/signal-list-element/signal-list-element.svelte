<script lang="ts">
    import {signallistStore} from '@/stores'

	import SignalRow from './signal-row.svelte'
	import type { SignalRow as SignalRowType, HintText } from './types.signal-list'
	import {Columns, SignalType} from '@/stores/'
	import type {MessagePublisherFilter}  from '@/stores'

	export let onContentChange: (newContent: string) => void;
	
	const signallist = signallistStore.getSignallist();
	// console.log('Message Publishers:', signallist.messagePublishers);
	// console.log('Columns:', Object.entries(Columns));
    // console.log('Message Subscribers:', signallist.messageSubscribers);
    // console.log('Invalidities Reports:', signallist.invaliditiesReports);

	// console.log('PUBLISHING LD:', signallistStore.getPublishingLogicalDevices());
	// console.log('PUBLISHING LD:', signallistStore.getSubscribingLogicalDevices(signallist.messagePublishers));

	const columns: SignalRowType[] = Object.entries(Columns).map(([key, value], i) => {
		return {
			index: i,
			searchKey: key,
			isSelected: false,
			column1: value,
			column2: "",
			label: {
				col1Label: {name: value, hasSuffix: true},
				col2Label: {name: `Filter by ${value}`, hasSuffix: false}
			}
		}
	})

	const messages: SignalRowType[] = Object.entries(SignalType).map(([key,value], i) => {
		return {
			index: (columns.length + i),
			searchKey: key,
			isSelected: false,
			column1: value,
			column2: "",
			label: {
				col1Label: {name: value, hasSuffix: true},
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

		const filter: MessagePublisherFilter = {M_text: ""}

		for (const {searchKey, column2} of selectedRows) {
			filter[searchKey] = column2;
		}
		console.log("🚀 ~ searchForMatchOnSignalList ~ filter:", filter)
		console.log(signallistStore.getPublishingLogicalDevices(filter).messagePublishers);
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