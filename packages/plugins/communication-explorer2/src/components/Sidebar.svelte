<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Icons } from '@transnet-bw/oscd-uilib';
	import type { DiagramConnection, MessageType } from '../types/diagram.js';
	import MessageTypeFilter from './MessageTypeFilter.svelte';

	let connection: DiagramConnection;
	let messageType: MessageType;
	const dispatch = createEventDispatcher();

	function handleFilterChange(event: CustomEvent<MessageType>) {
		messageType = event.detail;
		dispatch('filterChange', { messageType });
	}
</script>

<MessageTypeFilter on:filterChange={handleFilterChange} />
<Icons name="filter" />