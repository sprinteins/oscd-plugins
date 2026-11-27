<script lang="ts">
import { Accordion } from '@oscd-plugins/core-ui-svelte'
import type { SelectedNode } from '../../store'

interface Props {
	selectedIED: SelectedNode
}

let { selectedIED }: Props = $props()
</script>

<section class="ied-information">
	<h3>{selectedIED.name}</h3>
	<Accordion.Root type="multiple" class="port-list">
		{#each selectedIED.networking as networking (networking.port)}
			<Accordion.Item
				value={networking.port}
				class="port-information"
			>
				<Accordion.Trigger class="port-trigger">
					Port {networking.port} - {networking.cable}
				</Accordion.Trigger>
				<Accordion.Content
					forceMount
					class="data-[state=closed]:hidden data-[state=open]:block port-content"
				>
					<dl class="connected-ied">
						<dt>Connected IED</dt>
						<dd>{networking.connectedNetworking?.iedName || '-'}</dd>
					</dl>
					<dl class="network-information">
						<dt>IP</dt>
						<dd>{networking.ipAddress}</dd>
						<dt>Gateway</dt>
						<dd>{networking.ipGateway}</dd>
						<dt>Subnet</dt>
						<dd>{networking.ipSubnet}</dd>
						<dt>Connected AP</dt>
						<dd>{networking.connectedAP}</dd>
						<dt>Plug</dt>
						<dd>{networking.plug}</dd>
						<dt>Type</dt>
						<dd>{networking.type}</dd>
					</dl>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</section>

<style>
	.ied-information {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.ied-information h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.5;
	}

	:global(.port-list) {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	:global(.port-information) {
		border: 2px solid var(--color-cyan, #2aa198);
		border-radius: 0.375rem;
		overflow: hidden;
		background-color: var(--color-white, #f9f7f1);
	}

	:global(.port-trigger) {
		justify-content: flex-start;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.5;
		border-bottom: 1px dashed var(--color-cyan, #2aa198);
		text-align: left;
		text-decoration: none;
	}

	:global(.port-trigger > svg) {
		margin-left: auto;
	}

	:global(.port-trigger:hover) {
		text-decoration: none;
	}

	:global(.port-trigger[data-state='closed']) {
		border-bottom-color: transparent;
	}

	:global(.port-content > div) {
		padding: 0.5rem 0.75rem 0.75rem;
	}

	.connected-ied {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.connected-ied {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-cyan, #2aa198);
	}

	.connected-ied dd {
		padding: 0.25rem 0.5rem;
		border: 1px solid hsl(var(--border));
		border-radius: 0.25rem;
		background-color: hsl(var(--background));
	}

	.network-information {
		display: grid;
		grid-template-columns: minmax(6.5rem, 1fr) minmax(0, 1.5fr);
		gap: 0.125rem 0.75rem;
		margin: 0;
		padding-top: 0.375rem;
		font-size: 0.8125rem;
		line-height: 1.35;
	}

	.connected-ied dd,
	.network-information dd {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.connected-ied dt,
	.network-information dt {
		font-weight: 400;
	}

	.network-information dt {
		white-space: nowrap;
	}
</style>
