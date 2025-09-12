<script lang="ts">
	import type { Subscription } from '../types/subscription';
	import { MessageType } from '@oscd-plugins/core/legacy';

	export let subscriptions: Subscription[] = [];

	function getMessageTypeLabel(type: MessageType): string {
		switch (type) {
			case MessageType.GOOSE:
				return 'GOOSE';
			case MessageType.SMV:
				return 'SMV';
			case MessageType.REPORT:
				return 'Report';
			default:
				return 'Unknown';
		}
	}

	function formatDataSet(dataSet: string): string {
		return dataSet || 'N/A';
	}

	function formatControlBlock(controlBlock: string): string {
		return controlBlock || 'N/A';
	}
</script>

<div class="subscription-list">
	{#if subscriptions.length === 0}
		<div class="empty-state">
			<p>No subscriptions found matching the current filters.</p>
		</div>
	{:else}
		<div class="subscription-grid">
			<div class="header">
				<span>Type</span>
				<span>Publisher</span>
				<span>Subscriber</span>
				<span>DataSet</span>
				<span>Control Block</span>
			</div>
			{#each subscriptions as subscription}
				<div class="subscription-row">
					<span class="message-type {subscription.type.toLowerCase()}">
						{getMessageTypeLabel(subscription.type)}
					</span>
					<span class="publisher">{subscription.publisher}</span>
					<span class="subscriber">{subscription.subscriber}</span>
					<span class="dataset">{formatDataSet(subscription.dataSet)}</span>
					<span class="control-block">{formatControlBlock(subscription.controlBlock)}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.subscription-list {
		margin-top: 1rem;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--mdc-theme-text-secondary-on-background, #666);
	}

	.subscription-grid {
		display: grid;
		grid-template-columns: 80px 1fr 1fr 1fr 1fr;
		gap: 0;
		border: 1px solid var(--mdc-theme-outline, #e0e0e0);
		border-radius: 4px;
		overflow: hidden;
	}

	.header {
		display: contents;
	}

	.header > span {
		background-color: var(--mdc-theme-surface-variant, #f5f5f5);
		padding: 0.75rem 0.5rem;
		font-weight: 500;
		border-bottom: 1px solid var(--mdc-theme-outline, #e0e0e0);
		font-size: 0.875rem;
	}

	.subscription-row {
		display: contents;
	}

	.subscription-row:hover > span {
		background-color: var(--mdc-theme-surface-variant, #f9f9f9);
	}

	.subscription-row > span {
		padding: 0.75rem 0.5rem;
		border-bottom: 1px solid var(--mdc-theme-outline, #e0e0e0);
		font-size: 0.875rem;
		word-break: break-word;
	}

	.subscription-row:last-child > span {
		border-bottom: none;
	}

	.message-type {
		font-weight: 500;
		text-align: center;
		color: white;
		border-radius: 3px;
		margin: 0.125rem;
		padding: 0.375rem 0.25rem !important;
	}

	.message-type.goose {
		background-color: #2196f3;
	}

	.message-type.smv {
		background-color: #4caf50;
	}

	.message-type.report {
		background-color: #ff9800;
	}

	.publisher {
		font-weight: 500;
	}

	.subscriber {
		color: var(--mdc-theme-text-secondary-on-background, #666);
	}

	.dataset {
		font-family: monospace;
		font-size: 0.8rem;
	}

	.control-block {
		font-family: monospace;
		font-size: 0.8rem;
	}

	@media (max-width: 768px) {
		.subscription-grid {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.header {
			display: none;
		}

		.subscription-row {
			display: block;
			border: 1px solid var(--mdc-theme-outline, #e0e0e0);
			border-radius: 4px;
			margin-bottom: 0.5rem;
		}

		.subscription-row > span {
			display: block;
			border-bottom: 1px solid var(--mdc-theme-outline, #e0e0e0);
			position: relative;
			padding-left: 6rem;
		}

		.subscription-row > span:last-child {
			border-bottom: none;
		}

		.subscription-row > span::before {
			content: attr(data-label);
			position: absolute;
			left: 0.5rem;
			font-weight: 500;
			color: var(--mdc-theme-text-secondary-on-background, #666);
			width: 5rem;
		}

		.message-type {
			padding-left: 0.5rem !important;
			text-align: left;
		}
	}
</style>