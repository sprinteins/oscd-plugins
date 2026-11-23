<script lang="ts">
import { Table } from '@oscd-plugins/core-ui-svelte'
import type { IEDConnectionWithCustomValues } from '../../diagram'

interface Props {
	ConnectionSelection: IEDConnectionWithCustomValues
}

let { ConnectionSelection }: Props = $props()
</script>

<Table.Root>
	<Table.Body>
		<Table.Row>
			<Table.Cell>ID:</Table.Cell>
			<Table.Cell>{ConnectionSelection.id}</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Cell>Sources:</Table.Cell>
			<Table.Cell>{ConnectionSelection.sourceIED?.iedName}</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Cell>Targets:</Table.Cell>
			<Table.Cell>{ConnectionSelection.targetIED?.iedName}</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Cell>ServiceType:</Table.Cell>
			<Table.Cell>{ConnectionSelection.messageType}</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Cell>ServiceType Label:</Table.Cell>
			<Table.Cell>{ConnectionSelection.messageTypeLabel}</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>
