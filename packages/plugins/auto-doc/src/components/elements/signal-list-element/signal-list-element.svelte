<script lang="ts">
    import {signallistStore} from '@/stores';

	import SignalRow from './signal-row.svelte';
	import type { SignalRow as SignalRowType, SignalListMach} from './types.signal-list';
	import {Columns, SignalType} from '@/stores/';
	import type {MessagePublisherFilter, MessageSubscriberFilter}  from '@/stores';

	export let onContentChange: (newContent: string) => void;
	


	const columns: SignalRowType[] = Object.entries(Columns).map(([key, value], i) => {
		return {
			index: i,
			searchKey: key as keyof typeof Columns,
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
			searchKey: key as keyof typeof SignalType,
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



	$: results = {
		selected: selectedRows,
		matches: searchForMatchOnSignalList()
	}

	function updateSignalRow(index: number, key: keyof SignalRowType, value: string) {
    	mergedColsAndMessages = mergedColsAndMessages.map((row, i) => i === index ? { ...row, [key]: value } : row);
		emitSelectedRows();
	}

	function toggleAllCheckboxes(newValue: boolean) {
		mergedColsAndMessages = mergedColsAndMessages.map(row => ({...row, isSelected: !newValue}));
		emitSelectedRows();
	}

	function emitSelectedRows() {	
        onContentChange(JSON.stringify(results));
    }


	function searchForMatchOnSignalList(): SignalListMach{
		const publisherFilter: MessagePublisherFilter = {}
		const subscriberFilter: MessageSubscriberFilter = {}

		for (const {searchKey, column2} of selectedRows) {
			
			if(doesIncludeSignalType(searchKey)){			
				setFilterCriteriaForMessageSubscribers(searchKey, column2);
			}else{
				publisherFilter[searchKey as keyof MessagePublisherFilter] = column2;
			}
		}
		
		function setFilterCriteriaForMessageSubscribers(searchKey: string,column2: string) {
			subscriberFilter.serviceType = searchKey as  keyof typeof SignalType;
			subscriberFilter.IDEName = column2;
		}

		const {messagePublishers} = signallistStore.getPublishingLogicalDevices(publisherFilter);
		const {matchedRows} = signallistStore.getSubscribingLogicalDevices(messagePublishers, subscriberFilter);

		return {matchedRowsForTablePdf: matchedRows};

	}

	function doesIncludeSignalType(searchKey: string){	
		return [
			SignalType.GOOSE, 
			SignalType.MMS, 
			SignalType.SV, 
			SignalType.UNKNOWN
		].includes(SignalType[searchKey as unknown as keyof typeof SignalType]);

	}
</script>


<article class="signal-list">
	{#each mergedColsAndMessages as row (row.index)}
		<SignalRow 
			idx={row.index}
			label={row.label}
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
