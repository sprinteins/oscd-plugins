<script lang="ts">
import { Accordion } from '@oscd-plugins/core-ui-svelte'
import type { SelectedNode } from '../../store'

interface Props {
	selectedIED: SelectedNode
}

let { selectedIED }: Props = $props()
</script>

<section>
	<h3>{selectedIED.name}</h3>
	<Accordion.Root type="multiple">
			{#each selectedIED.networking as networking (networking.port)}
				<Accordion.Item value={networking.port}>
					<Accordion.Trigger class="text-sm">
						Port {networking.port} - {networking.cable}
					</Accordion.Trigger>
					<Accordion.Content
						forceMount
						class="data-[state=closed]:hidden data-[state=open]:block"
					>
						<dl class="network-information">
							<dt>Connected IED</dt>
							<dd>{networking.connectedNetworking?.iedName || '-'}</dd>
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
	.network-information {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.5rem;
		margin: 0;
		font-family: monospace;
	}

	.network-information dd {
		margin: 0;
		overflow-wrap: anywhere;
	}
</style>
