<script lang="ts">
import FormField from '@smui/form-field'
import Radio from '@smui/radio'
import Select, { Option } from '@smui/select'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { IEDService } from '@oscd-plugins/core'
import { onMount } from 'svelte'

interface Props {
	selectedBays: string[]
}

let { selectedBays = $bindable([]) }: Props = $props()

let availableBays: string[] = $state([])
let selectedBay: string | null = $state(null)
let mode: 'all' | 'bay' = $state('all')

function loadAvailableBays() {
	if (!pluginGlobalStore.xmlDocument) {
		availableBays = []
		return
	}
	try {
		const svc = new IEDService(
			pluginGlobalStore.xmlDocument.documentElement
		)
		availableBays = Array.from(svc.Bays())
	} catch (e) {
		console.error('Failed to load bays from IEDService', e)
		availableBays = []
	}
}

const segments = [
	{ value: 'all', label: 'All bays' },
	{ value: 'bay', label: 'Bay selection' }
]

function handleSegmentChange(event?: Event) {
    if (mode === 'all') {
        selectedBays = []
    } else {
        selectedBays = selectedBay ? [selectedBay] : []
    }
}

$effect(() => {
	if (selectedBay) {
		mode = 'bay'
		selectedBays = [selectedBay]
	} else if (mode === 'bay') {
		selectedBays = []
	}
})

onMount(() => {
	loadAvailableBays()
})
</script>

<div class="diagram-bay-selector">
    <div class="mode-controls">
            {#each segments as segment}
                <FormField>
                    <Radio
                        id="radio-all"
                        bind:group={mode}
                        value={segment.value}
                        onchange={handleSegmentChange}
                    />
                    {#snippet label()}
                        {segment.label}
                    {/snippet}
                </FormField>
            {/each}
    </div>

    <div class="bay-select">
        <Select
            bind:value={selectedBay}
            disabled={mode !== "bay"}
            variant="outlined"
            label="Bay Name"
        >
            {#each availableBays as bay}
                <Option value={bay}>{bay}</Option>
            {/each}
        </Select>
    </div>
</div>

<style>
    .diagram-bay-selector {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 0;
        margin-bottom: 1rem;
    }

    .mode-controls {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
    }
</style>