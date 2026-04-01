<script lang="ts">
import { ChevronRight, CirclePlus } from '@lucide/svelte'
import {
	Card,
	DropdownMenuWorkaround,
	dialogStore
} from '@oscd-plugins/core-ui-svelte'
import { deleteAccessPointFromIed } from '@/headless/actions'
import type { LDeviceData } from '@/headless/common-types'
import { dndStore } from '@/headless/stores'
import { RenameCombinedDialogForm } from './rename-dialogs'
import LDevice from './l-device.svelte'

interface Props {
	accessPoint: Element
	lDevices: LDeviceData[]
	iedName: string
	iedElement: Element
}

const { accessPoint, lDevices, iedName, iedElement }: Props = $props()

let isOpen = $state(false)
let hasLDevices = $derived(lDevices.length > 0)
let isDropTarget = $state(false)

let isInUse = $derived(lDevices.some((ld) => !ld.ldInst?.startsWith('LD0')))

const apLabel = $derived(
	`${iedName} - Access Point ${accessPoint.getAttribute('name')}`
)

function handleDragOver(event: DragEvent) {
	event.preventDefault()
	if (!dndStore.isDragging) return
	isDropTarget = true
}

function handleDragLeave(event: DragEvent) {
	const relatedTarget = event.relatedTarget as HTMLElement
	const currentTarget = event.currentTarget as HTMLElement
	if (!currentTarget?.contains(relatedTarget)) {
		isDropTarget = false
	}
}

function handleDrop(event: DragEvent) {
	event.preventDefault()
	isDropTarget = false

	if (!dndStore.currentDraggedItem) {
		console.warn('[AccessPoint] No dragged item in store')
		return
	}

	dndStore.handleDrop(accessPoint, iedName)
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

<div class="space-y-1">
  <button
    class="w-full"
    onclick={() => hasLDevices && (isOpen = !isOpen)}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    <Card.Root
      class="{isInUse
        ? 'hover:bg-gray-50 cursor-pointer'
        : 'border border-dashed'} 
		{isDropTarget ? 'border-primary ring-2 ring-primary ring-offset-2' : ''} 
		transition-all"
    >
      <Card.Content class="p-2 relative">
        <div class="flex items-center justify-between gap-2 min-w-0">
          <div class="flex items-center gap-2 min-w-0">
            {#if hasLDevices}
              <ChevronRight
                class="size-4 shrink-0 transition-transform duration-200 {isOpen
                  ? 'rotate-90'
                  : ''}"
              />
            {/if}
            <span
              class="text-sm font-medium text-left line-clamp-2 break-all"
              title={apLabel}
            >
              {apLabel}
            </span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            {#if isDropTarget}
              <CirclePlus class="size-5 text-primary animate-pulse" />
            {/if}
            <span
              onclick={(e) => e.stopPropagation()}
              role="button"
              tabindex="0"
              onkeydown={(e) => e.key === "Enter" && e.stopPropagation()}
            >
              <DropdownMenuWorkaround
                size="sm"
                actions={[
                  {
                    label: "Rename",
                    disabled: false,
                    callback: handleRename,
                  },
                  {
                    label: "Delete",
                    disabled: false,
                    callback: () =>
                      deleteAccessPointFromIed({
                        iedName,
                        accessPoint,
                        hasLDevices,
                      }),
                  },
                ]}
              />
            </span>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </button>
  {#if isOpen && hasLDevices}
    <div class="ml-4 space-y-1">
      {#each lDevices as { ldInst, lNodes: ldLNodes }}
        <LDevice {ldInst} lNodes={ldLNodes} {iedName} {accessPoint} />
      {/each}
    </div>
  {/if}
</div>
