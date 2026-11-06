<script lang="ts">
import { ChevronRight } from '@lucide/svelte'
import {
	Card,
	DropdownMenuWorkaround,
	dialogStore
} from '@oscd-plugins/core-ui-svelte'
import { deleteAccessPointFromIed } from '@/headless/actions'
import type { IedLDeviceData } from '@/headless/common-types'
import type { FilteredAccessPoint } from '@/headless/scl'
import { queryServerAtAccessPointsFromHost } from '@/headless/scl'
import { dndStore } from '@/headless/stores'
import DeleteHostAccessPointConfirmation from './delete-host-access-point-confirmation.svelte'
import LDevice from './l-device.svelte'
import { RenameCombinedDialogForm } from './rename-dialogs'
import ServerAtAccessPoint from './server-at-access-point.svelte'

interface Props {
	accessPoint: Element
	apName: string | null
	lDevices: IedLDeviceData[]
	serverAtAccessPoints: FilteredAccessPoint[]
	iedName: string
	iedElement: Element
}

const {
	accessPoint,
	apName,
	lDevices,
	serverAtAccessPoints,
	iedName,
	iedElement
}: Props = $props()

let isOpen = $state(true)
let hasContents = $derived(
	lDevices.length > 0 || serverAtAccessPoints.length > 0
)
let isDropTarget = $state(false)
let hoverExpandTimeout: NodeJS.Timeout | null = $state(null)

const apLabel = $derived(`Access Point ${apName}`)

function handleDragOver(event: DragEvent) {
	event.preventDefault()
	if (!dndStore.isDragging) return
	isDropTarget = true
	if (!isOpen && hasContents && !hoverExpandTimeout) {
		hoverExpandTimeout = setTimeout(() => {
			isOpen = true
			hoverExpandTimeout = null
		}, 600)
	}
}

function handleDragLeave(event: DragEvent) {
	const relatedTarget = event.relatedTarget as HTMLElement
	const currentTarget = event.currentTarget as HTMLElement
	if (!currentTarget?.contains(relatedTarget)) {
		isDropTarget = false
		isOpen = false
		if (hoverExpandTimeout) {
			clearTimeout(hoverExpandTimeout)
			hoverExpandTimeout = null
		}
	}
}

function handleDrop(event: DragEvent) {
	event.preventDefault()
	isDropTarget = false
	if (hoverExpandTimeout) {
		clearTimeout(hoverExpandTimeout)
		hoverExpandTimeout = null
	}

	if (!dndStore.currentDraggedItem) {
		console.warn('[AccessPoint] No dragged item in store')
		return
	}

	dndStore.handleDrop(accessPoint, iedName)
}

async function handleDelete() {
	const serverAtNames = queryServerAtAccessPointsFromHost(accessPoint).map(
		(serverAtAccessPoint) =>
			serverAtAccessPoint.getAttribute('name') ?? '(unnamed)'
	)

	if (serverAtNames.length > 0) {
		dialogStore.mountInnerComponent({
			innerComponent: DeleteHostAccessPointConfirmation,
			innerComponentProps: {
				hostName: apName ?? '(unnamed)',
				serverAtNames
			}
		})
		const result = await dialogStore.openDialog()
		if (result !== 'delete') return
	}

	deleteAccessPointFromIed({
		iedName,
		accessPoint
	})
}

async function handleRename() {
	dialogStore.mountInnerComponent({
		innerComponent: RenameCombinedDialogForm,
		innerComponentProps: {
			currentIedName: iedName,
			currentIedDescription: iedElement?.getAttribute('desc') ?? '',
			currentApName: accessPoint.getAttribute('name') ?? '',
			currentApDescription: accessPoint.getAttribute('desc') ?? '',
			iedElement,
			accessPointElement: accessPoint
		}
	})
	await dialogStore.openDialog()
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="rounded-md"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
	<Card.Root
		class="border {isDropTarget
			? 'border-primary ring-2 ring-primary ring-offset-2'
			: 'border-gray-300'} transition-all"
	>
		<Card.Content class="space-y-2 p-2">
			<div class="flex min-w-0 items-center justify-between gap-2">
				<div class="flex min-w-0 items-center gap-2">
					{#if hasContents}
						<button
							type="button"
							class="rounded p-1 hover:bg-gray-100"
							aria-label="{isOpen ? 'Collapse' : 'Expand'} {apLabel}"
							onclick={() => (isOpen = !isOpen)}
						>
							<ChevronRight
								class="size-4 shrink-0 transition-transform duration-200 {isOpen
									? 'rotate-90'
									: ''}"
							/>
						</button>
					{/if}
					<span class="truncate text-sm font-semibold" title={apLabel}>
						{apLabel}
					</span>
				</div>
				<div>
					<DropdownMenuWorkaround
						size="sm"
						actions={[
							{ label: 'Rename', disabled: false, callback: handleRename },
							{ label: 'Delete', disabled: false, callback: handleDelete }
						]}
					/>
				</div>
			</div>
			{#if isOpen}
				<div class="space-y-1">
					{#each serverAtAccessPoints as serverAtAccessPoint}
						<ServerAtAccessPoint
							accessPoint={serverAtAccessPoint.element}
							apName={serverAtAccessPoint.name}
							serverAtApName={apName ?? ''}
							{iedName}
							{iedElement}
						/>
					{/each}
					{#each lDevices as { ldInst, lns }}
						<LDevice {ldInst} {lns} {iedName} {accessPoint} />
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
