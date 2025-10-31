<script lang="ts">
import Checkbox from '@smui/checkbox'

import { Columns, SignalType } from '@/stores/'
import type { SignalRow as SignalRowType } from '@/stores/signallist.store.d'
import SignalRow from './signal-row.svelte'
import type { SignalListOnSCD } from './types.signal-list'

interface Props {
	// prop
	onContentChange: (newContent: string) => void
	content?: string
	doc?: XMLDocument
}

let { onContentChange, content = '' }: Props = $props()

const parsedContent: SignalListOnSCD = isContentNotEmpty()
	? JSON.parse(content)
	: getEmptyValues()
const prevSelectedRows = parsedContent.selected

const columns: SignalRowType[] = $state(
	Object.entries(Columns).map(([key, value], i) => {
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
				secondaryInputLabel: {
					name: `Filter by ${value}`,
					hasSuffix: false
				}
			}
		}
	})
)

const messages: SignalRowType[] = $state(
	Object.entries(SignalType).map(([key, value], i) => {
		const prevSelected: SignalRowType | undefined =
			getSelectedRowIfPreviouslySelected(key as keyof typeof SignalType)

		return {
			id: `msg-${key}`,
			index: prevSelected?.index ?? columns.length + i,
			searchKey: key as keyof typeof SignalType,
			isSelected: prevSelected?.isSelected ?? false,
			primaryInput: prevSelected?.primaryInput ?? value,
			secondaryInput: prevSelected?.secondaryInput ?? '',
			label: {
				primaryInputLabel: { name: value, hasSuffix: true },
				secondaryInputLabel: {
					name: 'Filter by IED Name',
					hasSuffix: false
				}
			}
		}
	})
)

let mergedColsAndMessages = $derived(
	[...columns, ...messages].sort((a, b) => a.index - b.index)
)
let columnsLength = $derived(columns.length)
let areAllCheckboxesSelected = $derived(
	mergedColsAndMessages.every((r) => r.isSelected)
)

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
	let row = mergedColsAndMessages[index]
	row[key] = value as unknown as never
	emitSelectedRows()
}

function toggleAllCheckboxes(isSelected: boolean) {
	mergedColsAndMessages.forEach((row) => (row.isSelected = isSelected))
	emitSelectedRows()
}

function emitSelectedRows() {
	const allRowsWithOrder = mergedColsAndMessages.map((row, index) => ({
		...row,
		index
	}))

	const selectedWithOrder = allRowsWithOrder.filter((row) => row.isSelected)

	const results = {
		selected: selectedWithOrder
	}
	onContentChange(JSON.stringify(results))
}
function getSelectedRowIfPreviouslySelected(
	searchKey: keyof typeof Columns | keyof typeof SignalType
): SignalRowType | undefined {
	return prevSelectedRows.find((selected) => selected.searchKey === searchKey)
}

function handleReorder(event: { draggedIndex: number; dropIndex: number }) {
	const { draggedIndex, dropIndex } = event
	const newOrder = [...mergedColsAndMessages]
	const [draggedRow] = newOrder.splice(draggedIndex, 1)
	newOrder.splice(dropIndex, 0, draggedRow)

	// Update index in underlying state
	newOrder.forEach((row, idx) => {
		row.index = idx
	})

	// Mutate columns and messages in-place
	const updatedColumns = newOrder.filter((row) => row.id.startsWith('col-'))
	const updatedMessages = newOrder.filter((row) => row.id.startsWith('msg-'))

	columns.splice(0, columns.length, ...updatedColumns)
	messages.splice(0, messages.length, ...updatedMessages)

	emitSelectedRows()
}

function isInColumnsZone(index: number): boolean {
	return index < columns.length
}
</script>
	
	
	<article>
	<div class="header">
		<div class="controls-column">
			<div></div>
			<Checkbox checked={areAllCheckboxesSelected} oninput={e => toggleAllCheckboxes(e.target.checked)} />
		</div>
		<small>Choose the columns you want to display and rename if needed</small>
		<small>Use the filter to limit the content of the columns to certain values</small>
	</div>
	
	{#each mergedColsAndMessages as row, i (row.id)}
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
	