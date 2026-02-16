<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight, CirclePlus } from '@lucide/svelte'
import { dndStore, bayStore } from '@/headless/stores'
import { buildEditsForDeleteAccessPoint } from '@/headless/ied/delete-elements'
import type { LNodeTemplate } from '@/headless/common-types'
import IedLnode from './ied-lnode.svelte'
import { getEditor } from '@/headless/utils'

interface Props {
	accessPoint: Element
	lNodes: LNodeTemplate[]
	sIedName: string
}

const { accessPoint, lNodes, sIedName }: Props = $props()

let isOpen = $state(false)
let hasLNodes = $derived(lNodes.length > 0)
let isDropTarget = $state(false)

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

	dndStore.handleDrop(accessPoint, sIedName)
}

function handleDelete() {
	try {
		const editor = getEditor()

		if (hasLNodes && !bayStore.scdBay) {
			console.error(
				'[AccessPoint] No bay selected - required to clear LNode references'
			)
			return
		}

		const edits = buildEditsForDeleteAccessPoint(accessPoint, sIedName)

		if (!(edits.length > 0)) {
			console.warn(
				'[AccessPoint] No edits generated for deleting AccessPoint - check if it still exists'
			)
			return
		}

		editor.commit(edits, {
			title: `Delete AccessPoint ${accessPoint.getAttribute('name') ?? '(unnamed)'} from ${sIedName}`
		})
	} catch (error) {
		console.error('[AccessPoint] Error deleting AccessPoint:', error)
	}
}
</script>

<div class="space-y-1">
  <button
    class="w-full"
    onclick={() => hasLNodes && (isOpen = !isOpen)}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    <Card.Root
      class="{hasLNodes
        ? 'hover:bg-gray-50 cursor-pointer'
        : 'border border-dashed'} 
		{isDropTarget ? 'border-primary ring-2 ring-primary ring-offset-2' : ''} 
		transition-all"
    >
      <Card.Content class="p-2 relative">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            {#if hasLNodes}
              <ChevronRight
                class="size-4 transition-transform duration-200 {isOpen
                  ? 'rotate-90'
                  : ''}"
              />
            {/if}
            <span class="text-sm font-medium text-left">
              {sIedName} - Access Point {accessPoint.getAttribute("name") ??
                "(unnamed)"}
            </span>
          </div>
          <div class="flex items-center gap-2">
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
                  { label: "Delete", disabled: false, callback: handleDelete },
                ]}
              />
            </span>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </button>
  {#if isOpen && hasLNodes}
    <div class="ml-4 space-y-1">
      {#each lNodes as lnode}
        <IedLnode
          {lnode}
          lDeviceName={lnode.lDeviceName ?? "Unknown"}
          {sIedName}
          {accessPoint}
        />
      {/each}
    </div>
  {/if}
</div>
