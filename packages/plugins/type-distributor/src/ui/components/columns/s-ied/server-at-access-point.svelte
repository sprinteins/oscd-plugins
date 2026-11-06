<script lang="ts">
import { AtSign } from '@lucide/svelte'
import {
	Card,
	DropdownMenuWorkaround,
	dialogStore
} from '@oscd-plugins/core-ui-svelte'
import { deleteAccessPointFromIed } from '@/headless/actions'
import { RenameCombinedDialogForm } from './rename-dialogs'

interface Props {
	accessPoint: Element
	apName: string | null
	serverAtApName: string
	iedName: string
	iedElement: Element
	hostAvailable?: boolean
}

const {
	accessPoint,
	apName,
	serverAtApName,
	iedName,
	iedElement,
	hostAvailable = true
}: Props = $props()

const apLabel = $derived(`Access Point ${apName}`)
const serverAtDescription = $derived(
	hostAvailable
		? `ServerAt uses Access Point ${serverAtApName}`
		: `ServerAt references missing Access Point ${serverAtApName || '(unnamed)'}`
)

async function handleRename() {
	dialogStore.mountInnerComponent({
		innerComponent: RenameCombinedDialogForm,
		innerComponentProps: {
			currentIedName: iedName,
			currentIedDescription: iedElement.getAttribute('desc') ?? '',
			currentApName: accessPoint.getAttribute('name') ?? '',
			currentApDescription: accessPoint.getAttribute('desc') ?? '',
			iedElement,
			accessPointElement: accessPoint
		}
	})
	await dialogStore.openDialog()
}

async function handleDelete() {
	deleteAccessPointFromIed({
		iedName,
		accessPoint
	})
}
</script>

<Card.Root class="border border-gray-300">
	<Card.Content class="flex min-w-0 items-center justify-between gap-2 p-2">
		<div class="min-w-0">
			<span class="truncate text-sm font-medium" title={apLabel}>
				{apLabel}
			</span>
		</div>
		<div class="flex shrink-0 items-center gap-2">
			<span
				class={hostAvailable ? 'text-gray-500' : 'text-destructive'}
				role="img"
				aria-label={serverAtDescription}
				title={serverAtDescription}
			>
				<AtSign class="size-4" aria-hidden="true" />
			</span>
			<DropdownMenuWorkaround
				size="sm"
				actions={[
					{ label: 'Rename', disabled: false, callback: handleRename },
					{ label: 'Delete', disabled: false, callback: handleDelete }
				]}
			/>
		</div>
	</Card.Content>
</Card.Root>
