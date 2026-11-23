<script lang="ts">
import type { Networking } from '@oscd-plugins/core'
import { Accordion } from '@oscd-plugins/core-ui-svelte'

interface Props {
	open?: boolean
	color: string
	networking: Networking
}

let { open = $bindable(false), color, networking }: Props = $props()
let accordionValue = $state(open ? 'networking' : '')

$effect(() => {
	open = accordionValue === 'networking'
})
</script>

<Accordion.Root type="single" bind:value={accordionValue} class="w-full">
	<Accordion.Item
		value="networking"
		class="rounded-md border-2 border-[var(--color-accent)] bg-[#ede8d7]"
		style={`border-color: var(${color})`}
	>
		<Accordion.Trigger class="px-3 py-2 hover:no-underline">
			<span>Port {networking.port} - {networking.cable}</span>
		</Accordion.Trigger>
		<Accordion.Content
			class="px-3 data-[state=closed]:hidden data-[state=open]:block"
		>
			<div>Connected IED</div>
			<div class="my-2 rounded-md border border-[#4d5d63] bg-[#fdfbf2] px-4 py-1.5">
				{networking.connectedNetworking?.iedName || '-'}
			</div>
			<dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-4">
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
</Accordion.Root>
