<script lang="ts">
	import { onMount } from 'svelte';
	import { MessageType, allMessageTypes } from '@oscd-plugins/core/legacy';
	import { SubscriptionService } from './services/SubscriptionService';
	import SubscriptionList from './components/SubscriptionList.svelte';
	import MessageTypeFilter from './components/MessageTypeFilter.svelte';
	import ControlBlockFilter from './components/ControlBlockFilter.svelte';
	import type { Subscription } from './types/subscription';

	let subscriptions: Subscription[] = [];
	let selectedMessageType: MessageType | null = null;
	let selectedControlBlock: string | null = null;

	onMount(() => {
		SubscriptionService.getSubscriptions().then((data) => {
			subscriptions = data;
		});
	});

	function filterSubscriptions() {
		return subscriptions.filter((subscription) => {
			const matchesMessageType =
				!selectedMessageType || subscription.messageType === selectedMessageType;
			const matchesControlBlock =
				!selectedControlBlock || subscription.controlBlock === selectedControlBlock;
			return matchesMessageType && matchesControlBlock;
		});
	}
</script>

<template>
	<MessageTypeFilter
		{allMessageTypes}
		bind:selectedMessageType
	/>
	<ControlBlockFilter
		bind:selectedControlBlock
	/>
	<SubscriptionList
		{filterSubscriptions()}
	/>
</template>