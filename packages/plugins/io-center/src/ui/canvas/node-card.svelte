<script lang="ts">
// CORE
import { Card, Button } from '@oscd-plugins/core-ui-svelte'
// STORES
import { canvasStore, logicalStore } from '@/headless/stores'
// COMPONENTS
import Port from './port.svelte'
import { X } from 'lucide-svelte'
// TYPES
import type {
	DataObject,
	RawLogical,
	LogicalConditionerClass,
	LogicalPhysicalClass,
	PortConfig,
	PortSide,
	LogicalKind
} from '@/headless/stores'

const {
	title,
	node,
	logicalKind
}: {
	title: string
	node:
		| DataObject
		| RawLogical<LogicalConditionerClass | LogicalPhysicalClass>
	logicalKind?: LogicalKind
} = $props()

//====== DERIVED ======//

const portsBySide = $derived(
	node.ports.reduce(
		(acc, port) => {
			if (!acc[port.side]) {
				acc[port.side] = []
			}
			acc[port.side].push(port)
			return acc
		},
		{} as Record<PortSide, PortConfig[]>
	)
)

const highestPortLength = $derived(
	Math.max(portsBySide.left?.length || 0, portsBySide.right?.length || 0)
)

//====== FUNCTIONS ======//

function unselectCurrentLogical() {
	if (!logicalKind) return
	logicalStore.unselectLogical(logicalKind, node.id)
}
</script>
	 
	<Card.Root class="w-full relative">
		{#if !canvasStore.isAtLeastOnePortConnected(node.ports)}
			<Button.Root
				onclick={unselectCurrentLogical}
				class="size-8 rounded-full p-0 absolute top-2 right-2 bg-transparent text-muted-foreground  hover:text-muted-foreground hover:bg-muted">
				<X class="!size-5" />
			</Button.Root>
		{/if}
		<Card.Header class="pb-4">
				<Card.Title class="text-sm flex justify-between item-center">
					<span>{ title }</span>

				</Card.Title>
				
		</Card.Header>
		<Card.Content class="relative p-2" style={`height: ${highestPortLength * 2}rem`}>
			
			
			{#each portsBySide.left as port, index (port.payload.uuid)}
			<div
					class="absolute -left-2.5"
					style={`top: ${index * 2}rem;`}
				>
					<Port {port}/>
				</div>

			{/each}

			{#each portsBySide.right as port, index (port.payload.uuid)}
			<div
					class="absolute -right-2.5"
					style={`top: ${index * 2}rem;`}
				>
					<Port {port}/>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>