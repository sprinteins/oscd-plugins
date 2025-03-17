<script lang="ts">
	import { signallistStore } from '@/stores'
	import Checkbox from '@smui/checkbox'
	import { signalDndStore } from '../../../stores/signal-dnd.store'
	
	import SignalRow from './signal-row.svelte'
	import type {
		SignalRow as SignalRowType,
		PdfRows,
		SignalListOnSCD
	} from './types.signal-list'
	import { Columns, SignalType } from '@/stores/'
	import type { MessagePublisherFilter, MessageSubscriberFilter } from '@/stores'
	
	// prop
	export let onContentChange: (newContent: string) => void
	export let content = ''
	
	const parsedContent: SignalListOnSCD = isContentNotEmpty()
		? JSON.parse(content)
		: getEmptyValues()
	const prevSelectedRows = parsedContent.selected
	
	const columns: SignalRowType[] = Object.entries(Columns).map(
		([key, value], i) => {
			const prevSelected: SignalRowType | undefined =
				getSelectedRowIfPreviouslySelected(key as keyof typeof Columns)
	
			return {
				id: `col-${key}`,
				index: i,
				searchKey: key as keyof typeof Columns,
				isSelected: prevSelected?.isSelected ?? false,
				column1: prevSelected?.column1 ?? value,
				column2: prevSelected?.column2 ?? '',
				label: {
					col1Label: { name: value, hasSuffix: true },
					col2Label: { name: `Filter by ${value}`, hasSuffix: false }
				}
			}
		}
	)
	
	const messages: SignalRowType[] = Object.entries(SignalType).map(
		([key, value], i) => {
			const prevSelected: SignalRowType | undefined =
				getSelectedRowIfPreviouslySelected(key as keyof typeof SignalType)
	
			return {
				id: `msg-${key}`,
				index: columns.length + i,
				searchKey: key as keyof typeof SignalType,
				isSelected: prevSelected?.isSelected ?? false,
				column1: prevSelected?.column1 ?? value,
				column2: prevSelected?.column2 ?? '',
				label: {
					col1Label: { name: value, hasSuffix: true },
					col2Label: { name: 'Filter by IED Name', hasSuffix: false }
				}
			}
		}
	)
	
	$: mergedColsAndMessages = [...columns, ...messages]
	$: selectedRows = mergedColsAndMessages.filter((row) => row.isSelected)
	
	$: results = {
		selected: selectedRows,
		matches: searchForMatchOnSignalList()
	}
	
	function getEmptyValues(): SignalListOnSCD {
		return { selected: [], matches: { matchedRowsForTablePdf: [] } }
	}
	
	function isContentNotEmpty() {
		return content.trim()
	}
	
	function updateSignalRow(
		index: number,
		key: keyof SignalRowType,
		value: string
	) {
		mergedColsAndMessages = mergedColsAndMessages.map((row, i) =>
			i === index ? { ...row, [key]: value } : row
		)
		emitSelectedRows()
	}
	
    let areAllCheckboxesSelected = false
	function toggleAllCheckboxes(newValue: boolean) {
		mergedColsAndMessages = mergedColsAndMessages.map((row) => ({
			...row,
			isSelected: !newValue
		}))
		emitSelectedRows()
	}
	
	function emitSelectedRows() {
		onContentChange(JSON.stringify(results))
	}
	function getSelectedRowIfPreviouslySelected(
		searchKey: keyof typeof Columns | keyof typeof SignalType
	): SignalRowType | undefined {
		return prevSelectedRows.find((selected) => selected.searchKey === searchKey)
	}
	
	function searchForMatchOnSignalList(): PdfRows {
		const publisherFilter: MessagePublisherFilter = {}
		const subscriberFilter: MessageSubscriberFilter = {}
	
		for (const { searchKey, column2 } of selectedRows) {
			if (doesIncludeSignalType(searchKey)) {
				subscriberFilter[searchKey as keyof MessageSubscriberFilter] =
					column2
			} else {
				publisherFilter[searchKey as keyof MessagePublisherFilter] = column2
			}
		}
	
		const { messagePublishers } =
			signallistStore.getPublishingLogicalDevices(publisherFilter)
		const { matchedRows } = signallistStore.getSubscribingLogicalDevices(
			messagePublishers,
			subscriberFilter
		)
	
		return { matchedRowsForTablePdf: matchedRows }
	}
	
	function doesIncludeSignalType(searchKey: string) {
		return [
			SignalType.GOOSE,
			SignalType.MMS,
			SignalType.SV,
			SignalType.UNKNOWN
		].includes(SignalType[searchKey as unknown as keyof typeof SignalType])
	}
	
	function handleReorder(
		event: CustomEvent<{ draggedIndex: number; dropIndex: number }>
	) {
		console.log('handleReorder', event.detail)
		const { draggedIndex, dropIndex } = event.detail
		const newRows = [...mergedColsAndMessages]
		const [draggedRow] = newRows.splice(draggedIndex, 1)
		newRows.splice(dropIndex, 0, draggedRow)
	
		newRows.forEach((row, index) => {
			row.index = index
		})
	
		mergedColsAndMessages = newRows
		emitSelectedRows()
	}
	</script>
	
	
	<article 
		class="signal-list"
	>
	<div class="signal-list-header">
		<div>
			<Checkbox
			on:click={() => toggleAllCheckboxes(areAllCheckboxesSelected)}
			bind:checked={areAllCheckboxesSelected}
			/>
		</div>
		<small>Choose the columns you want to display and rename if needed</small>
		<small>Use the filter to limit the content of the columns to certain values</small>
	</div>
	
	{#each mergedColsAndMessages as row (row.id)}
		<SignalRow 
			idx={row.index}
			id={row.id}
			label={row.label}
			bind:isSelected={row.isSelected}
			bind:column1={row.column1}
			bind:column2={row.column2}
			on:update={e => updateSignalRow(row.index, e.detail.key, e.detail.value)}
			on:toggleAllCheckboxes={e => toggleAllCheckboxes(e.detail.value)}
			on:reorder={handleReorder}
		/>
	{/each}
	</article>
	
	<style lang="scss">
	.signal-list {
		width: 99%;
		display: flex;
		flex-direction: column;
	}

	.signal-list-header{
        display: grid;
        grid-template-columns: 3% repeat(2, 1fr);
        grid-gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;

        small{
            color: #4d5d63;
            text-align: center;
        }
	}
	</style>
	