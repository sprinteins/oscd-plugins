<script lang="ts">
	import { signallistStore } from '@/stores'
	import Checkbox from '@smui/checkbox'
	
	import SignalRow from './signal-row.svelte'
	import type {
		SignalRow as SignalRowType,
		PdfRows,
		SignalListOnSCD
	} from './types.signal-list'
	import { Columns, SignalType } from '@/stores/'
	import type { MessagePublisherFilter, MessageSubscriberFilter } from '@/stores'
	
	
	interface Props {
		// prop
		onContentChange: (newContent: string) => void;
		content?: string;
	}

	let { onContentChange, content = '' }: Props = $props();
	
	const parsedContent: SignalListOnSCD = isContentNotEmpty()
		? JSON.parse(content)
		: getEmptyValues()
	const prevSelectedRows = parsedContent.selected
	
	const columns: SignalRowType[] = $state(Object.entries(Columns).map(
		([key, value], i) => {
			const prevSelected: SignalRowType | undefined =
				getSelectedRowIfPreviouslySelected(key as keyof typeof Columns)
	
			return {
				id: `col-${key}`,
				index: prevSelected?.index ?? i,
				searchKey: key as keyof typeof Columns,
				isSelected: prevSelected?.isSelected ?? false,
				primaryInput: prevSelected?.primaryInput ?? value,
				secondaryInput: prevSelected?.secondaryInput ?? '',
				label: {
					primaryInputLabel: { name: value, hasSuffix: true },
					secondaryInputLabel: { name: `Filter by ${value}`, hasSuffix: false }
				}
			}
		}
	))
	
	const messages: SignalRowType[] = $state(Object.entries(SignalType).map(
		([key, value], i) => {
			const prevSelected: SignalRowType | undefined =
				getSelectedRowIfPreviouslySelected(key as keyof typeof SignalType)
	
			return {
				id: `msg-${key}`,
				index: prevSelected?.index ?? (columns.length + i),
				searchKey: key as keyof typeof SignalType,
				isSelected: prevSelected?.isSelected ?? false,
				primaryInput: prevSelected?.primaryInput ?? value,
				secondaryInput: prevSelected?.secondaryInput ?? '',
				label: {
					primaryInputLabel: { name: value, hasSuffix: true },
					secondaryInputLabel: { name: 'Filter by IED Name', hasSuffix: false }
				}
			}
		}
	))
	
	let mergedColsAndMessages = $derived([...columns, ...messages].sort((a, b) => a.index - b.index))
	let selectedRows = $derived(mergedColsAndMessages.filter((row) => row.isSelected))
	let columnsLength = $derived(columns.length)
	
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
		/* TODO: Remove
		mergedColsAndMessages = mergedColsAndMessages.map((row, i) =>
			i === index ? { ...row, [key]: value } : row
		)
		*/

		let row = mergedColsAndMessages[index]
		row[key] = value as unknown as never
		emitSelectedRows()
	}
	
    let areAllCheckboxesSelected = $state(false)

	$effect(() => {
		console.log('effect on all checkboxes selected ' + areAllCheckboxesSelected);
		mergedColsAndMessages.forEach(row => row.isSelected = areAllCheckboxesSelected);
	})
	/*
	function toggleAllCheckboxes(newValue: boolean) {
		mergedColsAndMessages.forEach(row => row.isSelected = !newValue)
		emitSelectedRows()
	}
	*/
	
	function emitSelectedRows() {
		const allRowsWithOrder = mergedColsAndMessages.map((row, index) => ({
			...row,
			index
		}));

		const selectedWithOrder = allRowsWithOrder.filter(row => row.isSelected);
		
		const results = {
			selected: selectedWithOrder,
			matches: searchForMatchOnSignalList()
		};
		onContentChange(JSON.stringify(results));
	}
	function getSelectedRowIfPreviouslySelected(
		searchKey: keyof typeof Columns | keyof typeof SignalType
	): SignalRowType | undefined {
		return prevSelectedRows.find((selected) => selected.searchKey === searchKey)
	}
	
	function searchForMatchOnSignalList(): PdfRows {
		const publisherFilter: MessagePublisherFilter = {};
		const subscriberFilter: MessageSubscriberFilter = {};
	
		for (const { searchKey, secondaryInput } of selectedRows) {
			if (doesIncludeSignalType(searchKey)) {
				subscriberFilter[searchKey as keyof MessageSubscriberFilter] = secondaryInput
			} else {
				publisherFilter[searchKey as keyof MessagePublisherFilter] = secondaryInput
			}
		}
	
		const { pdfRows, invaliditiesReports } = signallistStore.getPublishingLogicalDevices(publisherFilter, subscriberFilter);
	
		return { matchedRowsForTablePdf: pdfRows }
	}
	
	function doesIncludeSignalType(searchKey: string) {
		return [
			SignalType.GOOSE,
			SignalType.MMS,
			SignalType.SV
		].includes(SignalType[searchKey as unknown as keyof typeof SignalType])
	}
	
	function handleReorder(
		event: { draggedIndex: number; dropIndex: number }
	) {
		// TODO: Reimplement reorder once mergedColsAndMessages is state
		/*
		const { draggedIndex, dropIndex } = event.detail
		const newRows = [...mergedColsAndMessages]
		const [draggedRow] = newRows.splice(draggedIndex, 1)
		newRows.splice(dropIndex, 0, draggedRow)
		
		newRows.forEach((row, index) => {
			row.index = index
		})
		
		mergedColsAndMessages = newRows
		emitSelectedRows()
		*/
	}
	
	function isInColumnsZone(index: number): boolean {
		return index < columns.length;
	}
</script>
	
	
	<article>
	<div class="header">
		<div class="controls-column">
			<div></div>
			<!-- TODO: Fix checkbox toggle all -->
			<Checkbox bind:checked={areAllCheckboxesSelected} />
		</div>
		<small>Choose the columns you want to display and rename if needed</small>
		<small>Use the filter to limit the content of the columns to certain values</small>
	</div>
	
	{#each mergedColsAndMessages as row, i (row.id)}
		<!-- TODO: is this relevant? toggleAllCheckboxes={e => toggleAllCheckboxes(e.value)} -->
		<SignalRow 
			idx={i}
			id={row.id}
			isInColumnsZone={isInColumnsZone(i)}
			columnsLength={columnsLength}
			label={row.label}
			bind:isSelected={row.isSelected}
			bind:primaryInput={row.primaryInput}
			bind:secondaryInput={row.secondaryInput}
			update={e => updateSignalRow(i, e.key, e.value)}
			reorder={handleReorder}
		/>
	{/each}
	</article>
	
	<style lang="scss">
	.header {
		display: grid;
		grid-template-columns: 100px repeat(2, 1fr);
		grid-gap: 1rem;
		margin-left: 0.6rem;
		margin-bottom: 0.5rem;
	}

	.controls-column {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	small {
		color: #4d5d63;
		text-align: left;
	}
	</style>
	