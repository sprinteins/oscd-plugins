<script lang="ts">
	import SignalRow from './signal-row.svelte';
	import type { SignalRow as SignalRowType, HintText, LabelText } from './types.signal-list';
	import {signalColumns,  messageTypes} from './signal-list';
	export let onContentChange: (newContent: string) => void;




	let columns: SignalRowType[] = signalColumns.map((col, i) => {
		return {
			index: i,
			isSelected: false,
			column1: col,
			column2: ""
		}
	})

	let messages: SignalRowType[] = messageTypes.map((message, i) => {
		return {
			index: i,
			isSelected: false,
			column1: message,
			column2: ""
		}
	})

	const messageHintText: HintText = {
		col1Hint: "Choose the message types you want to display",
		col2Hint: "Filter Target IEDS with Regex"
	}
	const columnsHintText: HintText = {
		col1Hint: "Choose the columns you want to display",
		col2Hint: "Use Regex to filter columns"
	}

	const columnsLabelText: LabelText = {
		col1Label: {name: "Column", hasSuffix: true},
		col2Label: {name: "Column", hasSuffix: true}
	}

	const messagesLabelText: LabelText = {
		col1Label: {name: "Message type", hasSuffix: true},
		col2Label: {name: "IED Name", hasSuffix: false},
		
	}

	function updateSignalRow(index: number, key: keyof SignalRowType, value: string) {
    	columns = columns.map((row, i) => i === index ? { ...row, [key]: value } : row);
		emitSelectedRows();

	}
	function updateMessageType(index: number, key: keyof SignalRowType, value: string) {
    	messages = messages.map((message, i) => i === index ? { ...message, [key]: value } : message);
		emitSelectedRows();
	}

	function emitSelectedRows() {
        const selectedColumns = columns.filter(row => row.isSelected);
        const selectedMessages = messages.filter(message => message.isSelected);
        onContentChange({ columns: selectedColumns, messages: selectedMessages });
    }
</script>


<article class="signal-list">

	{#each columns as row (row.index)}
		<SignalRow 
			idx={row.index}
			label={columnsLabelText}
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
			label={messagesLabelText}
			hintText={messageHintText}
			bind:isSelected={message.isSelected}
			bind:column1={message.column1}
			bind:column2={message.column2}
			on:update={e => updateMessageType(message.index, e.detail.key, e.detail.value)}
		/>
	{/each}
	
</article>

<style lang="scss">
	.signal-list{
		width: 99%;
	}
</style>