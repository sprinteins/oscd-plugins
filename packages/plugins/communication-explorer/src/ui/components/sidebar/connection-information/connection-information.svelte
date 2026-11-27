<script lang="ts">
import { Table } from '@oscd-plugins/core-ui-svelte'
import type { IEDConnectionWithCustomValues } from '../../diagram'

interface Props {
	ConnectionSelection: IEDConnectionWithCustomValues
}

let { ConnectionSelection }: Props = $props()
</script>

<Table.Root class="text-xs leading-normal">
	<Table.Body>
		<Table.Row class="border-0">
			<Table.Cell class="py-0 pl-0 pr-4 align-top">ID:</Table.Cell>
			<Table.Cell class="p-0 align-top">{ConnectionSelection.id}</Table.Cell>
		</Table.Row>
		<Table.Row class="border-0">
			<Table.Cell class="py-0 pl-0 pr-4 align-top">Sources:</Table.Cell>
			<Table.Cell class="p-0 align-top"
				>{ConnectionSelection.sourceIED?.iedName}</Table.Cell
			>
		</Table.Row>
		<Table.Row class="border-0">
			<Table.Cell class="py-0 pl-0 pr-4 align-top">Targets:</Table.Cell>
			<Table.Cell class="p-0 align-top"
				>{ConnectionSelection.targetIED?.iedName}</Table.Cell
			>
		</Table.Row>
		<Table.Row class="border-0">
			<Table.Cell class="py-0 pl-0 pr-4 align-top">ServiceType:</Table.Cell>
			<Table.Cell class="p-0 align-top"
				>{ConnectionSelection.messageType}</Table.Cell
			>
		</Table.Row>
		<Table.Row class="border-0">
			<Table.Cell class="py-0 pl-0 pr-4 align-top"
				>ServiceType Label:</Table.Cell
			>
			<Table.Cell class="p-0 align-top"
				>{ConnectionSelection.messageTypeLabel}</Table.Cell
			>
		</Table.Row>
	</Table.Body>
</Table.Root>
