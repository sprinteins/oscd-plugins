<script lang="ts">
// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
import {
	dialogStore,
	Button,
	SelectWorkaround,
	Input,
	Label,
	Alert
} from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import {
	ALLOWED_LOGICAL_CONDITIONER_CLASS_BY_CDC,
	L_NODE_TYPE_HELPER_TEXT,
	LOGICAL_CONDITIONER_CLASS,
	LOGICAL_PHYSICAL_CLASS
} from '@/headless/constants'
// STORES
import { iedStore, logicalStore } from '@/headless/stores'
// COMPONENTS
import { TriangleAlert } from 'lucide-svelte'
// TYPES
import type {
	LogicalKind,
	LogicalConditionerClass,
	LogicalPhysicalClass,
	DataObject,
	RawLogical
} from '@/headless/stores'

//====== INITIALIZATION ======//

// props
const {
	logicalToEdit,
	logicalKind
}: {
	logicalToEdit?: RawLogical<LogicalConditionerClass | LogicalPhysicalClass>
	logicalKind: LogicalKind
} = $props()

//====== REACTIVE STATE ======//

let lnClass = $state<
	LogicalConditionerClass | LogicalPhysicalClass | undefined
>(logicalToEdit?.attributes.lnClass)
let numberOfPorts = $state<number | null>(
	logicalToEdit?.attributes?.numberOfPorts
		? Number(logicalToEdit.attributes.numberOfPorts)
		: null
)
let desiredNumberOfLogicalToCreate = $state<number>(1)
let description = $state<string | null>(logicalToEdit?.attributes.desc || null)
let prefix = $state<string | null>(logicalToEdit?.attributes.prefix || null)

//====== COMPUTED ======//

const logicalTypeOptions = $derived.by(() => {
	if (!iedStore.selectedDataObject) return undefined
	let currentOptions: Readonly<
		LogicalConditionerClass[] | LogicalPhysicalClass[]
	>

	if (logicalKind === 'conditioner') {
		currentOptions = getConditionerTypes(iedStore.selectedDataObject)
	} else currentOptions = Object.values(LOGICAL_PHYSICAL_CLASS)

	return currentOptions.map((option) => ({
		value: option,
		label: option
	}))
})

const displayAlert = $derived(
	lnClass && !logicalStore.hasLNodeTypeOfClass(lnClass)
)

//====== FUNCTIONS ======//

function getConditionerTypes(selectedDataObject: DataObject) {
	let currentOptions: Readonly<LogicalConditionerClass[]>

	if (
		typeGuard.isPropertyOfObject(
			selectedDataObject.commonDataClass,
			ALLOWED_LOGICAL_CONDITIONER_CLASS_BY_CDC
		)
	) {
		currentOptions =
			ALLOWED_LOGICAL_CONDITIONER_CLASS_BY_CDC[
				selectedDataObject.commonDataClass
			]
	} else currentOptions = Object.values(LOGICAL_CONDITIONER_CLASS)

	return currentOptions
}

async function handleCreateOrEdit() {
	if (!lnClass) return

	if (logicalToEdit)
		logicalStore.updateLogical({
			...logicalToEdit,
			attributes: {
				uuid: logicalToEdit.attributes.uuid,
				lnClass,
				inst: logicalToEdit.attributes.inst,
				lnType: logicalToEdit.attributes.lnType,
				numberOfPorts: `${numberOfPorts}`,
				desc: description,
				prefix
			}
		})
	else
		logicalStore.createLogicals({
			lnClass,
			desiredNumberOfLogicalToCreate,
			numberOfPorts,
			description,
			prefix
		})

	await resetDialog()
}

async function resetDialog() {
	await dialogStore.closeDialog()
	lnClass = undefined
	numberOfPorts = null
	desiredNumberOfLogicalToCreate = 1
}
</script>

<section >
	<header class="pb-4">
		{#if logicalToEdit}
			<h2 class="text-xl font-bold">Edit logical {logicalKind} : {logicalToEdit.attributes.lnClass} - {logicalToEdit.attributes.inst}</h2>
		{:else}
			<h2 class="text-xl font-bold">Add logical {logicalKind}</h2>
		{/if}
	</header>
	<div class="space-y-5">
		{#if !logicalToEdit}
			<Label.Root for="logical-prefix">
				Logical {logicalKind} class
			</Label.Root>
			<SelectWorkaround
				bind:value={lnClass}
				placeholder={`Select a logical ${logicalKind} class`}
				options={logicalTypeOptions}
				handleChange={() => numberOfPorts = null}
			/>
		{/if}
		
		{#if displayAlert}
			<Alert.Root variant="destructive" class="mb-5">
				<TriangleAlert class="size-4" />
				<Alert.Title>Missing {lnClass} LNodeType!</Alert.Title>
				<Alert.Description>
					{ L_NODE_TYPE_HELPER_TEXT }
				</Alert.Description>
			</Alert.Root>
		{/if}

		<div class="space-y-2">
			<Label.Root for="logical-prefix">
				Prefix - optional
			</Label.Root>
			<Input.Root
				bind:value={prefix}
				placeholder="Optional prefix"
				id="logical-prefix"
			/>
		</div>

		<div class="space-y-2">
			<Label.Root for="logical-description">
				Desc - optional
			</Label.Root>
			<Input.Root
				bind:value={description}
				placeholder="Optional description"
				id="logical-description"
			/>
		</div>

		{#if lnClass === LOGICAL_CONDITIONER_CLASS.LCIV || lnClass === LOGICAL_PHYSICAL_CLASS.LPDO}
			<div class="space-y-2">
				<Label.Root for="port-number">
					Number of ports to add
				</Label.Root>
				<Input.Root
					bind:value={() => numberOfPorts ? numberOfPorts : numberOfPorts = 1, (value) => numberOfPorts = Number(value) }
					id="port-number"
					type="number"
					min="1"
				/>
			</div>
		{/if}

		{#if !logicalToEdit}
			<div class="space-y-2">
				<Label.Root for="logical-number">
					Number of Logical {logicalKind === 'conditioner' ? 'Conditioners' : 'Physicals'} to create
				</Label.Root>
				<Input.Root
					bind:value={desiredNumberOfLogicalToCreate}
					id="logical-number"
					type="number"
					min="1"
				/>
			</div>
		{/if}

	</div>
	<footer class="flex justify-end space-x-2 mt-4">
		<Button.Root 
			variant="outline"
			class="hover:bg-destructive hover:text-destructive-foreground"
			onclick={resetDialog}
		>
			Cancel
		</Button.Root>
		<Button.Root onclick={handleCreateOrEdit} disabled={lnClass === undefined}>
			{ logicalToEdit ? 'Save' : 'Add' }
		</Button.Root>
	</footer>
</section>