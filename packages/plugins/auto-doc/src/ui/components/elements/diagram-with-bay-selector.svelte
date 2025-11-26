<script lang="ts">
import FormField from '@smui/form-field'
import Radio from '@smui/radio'
import Menu from '@smui/menu'
import List, { Item, Text } from '@smui/list'
import Checkbox from '@smui/checkbox'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { IEDService } from '@oscd-plugins/core'
import { onMount, untrack } from 'svelte'

interface Props {
	selectedBays: string[]
}

let { selectedBays = $bindable([]) }: Props = $props()

let availableBays: string[] = $state([])
let mode: 'all' | 'bay' = $state('all')
let menu: Menu
let selectedBaysSet = $state(new Set<string>())
let isMenuOpen = $state(false)
let anchorElement: HTMLDivElement | null = $state(null)
let menuElement: HTMLDivElement

function handleClickOutside(event: MouseEvent) {
	if (isMenuOpen && menuElement && anchorElement) {
		const target = event.target as Node
		if (!menuElement.contains(target) && !anchorElement.contains(target)) {
			isMenuOpen = false
		}
	}
}

$effect(() => {
	if (isMenuOpen) {
		setTimeout(() => {
			document.addEventListener('click', handleClickOutside)
		}, 0)
	} else {
		document.removeEventListener('click', handleClickOutside)
	}

	return () => {
		document.removeEventListener('click', handleClickOutside)
	}
})

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

function handleSegmentChange() {
	if (mode === 'all') {
		selectedBays = []
		isMenuOpen = false
	}
}

function toggleBaySelection(bay: string) {
	if (selectedBays.includes(bay)) {
		selectedBays = selectedBays.filter((b) => b !== bay)
	} else {
		selectedBays = [...selectedBays, bay]
	}
	selectedBaysSet = new Set(selectedBays)
}

function isBaySelected(bay: string): boolean {
	return selectedBaysSet.has(bay)
}

const displayText = $derived.by(() => {
	if (mode === 'all' || selectedBays.length === 0) {
		return 'Select bays...'
	}
	if (selectedBays.length === 1) {
		return selectedBays[0]
	}
	return `${selectedBays.length} bays selected`
})

onMount(() => {
	loadAvailableBays()
	selectedBaysSet = new Set(selectedBays)
})
</script>

<div class="diagram-bay-selector">
    <div class="mode-controls">
        {#each segments as segment}
            <FormField>
                <Radio
                    id="radio-{segment.value}"
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

    <div class="bay-select-wrapper" class:disabled={mode === "all"}>
        <div
            bind:this={anchorElement}
            class="select-trigger"
            class:disabled={mode === "all"}
            onclick={() => {
                if (mode !== "all") {
                    isMenuOpen = true;
                }
            }}
            onkeydown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && mode !== "all") {
                    isMenuOpen = true;
                }
            }}
            role="button"
            tabindex={mode === "all" ? -1 : 0}
        >
            <span class="select-text">{displayText}</span>
            <span class="select-dropdown-icon">▼</span>
        </div>
    </div>

    <div bind:this={menuElement}>
        <Menu
            bind:this={menu}
            bind:open={isMenuOpen}
            bind:anchorElement
            managed={true}
            class="bay-menu"
            anchorCorner="BOTTOM_START"
        >
            <List>
                {#each availableBays as bay (bay)}
                    <Item
                        onclick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            toggleBaySelection(bay);
                        }}
                        class="bay-item"
                    >
                        <span class="checkbox-wrapper">
                            <Checkbox
                                checked={isBaySelected(bay)}
                                tabindex={-1}
                            />
                        </span>
                        <Text>{bay}</Text>
                    </Item>
                {/each}
            </List>
        </Menu>
    </div>
</div>

<style>
    .diagram-bay-selector {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 1rem;
    }

    .mode-controls {
        display: flex;
        flex-direction: column;
    }

    .bay-select-wrapper {
        position: relative;
        max-width: 400px;
    }

    .bay-select-wrapper.disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    .select-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid rgba(0, 0, 0, 0.38);
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    }

    .select-trigger:hover:not(.disabled) {
        border-color: rgba(0, 0, 0, 0.87);
    }

    .select-trigger:focus {
        outline: none;
        border-color: var(--mdc-theme-primary, #6200ee);
        border-width: 2px;
        padding: 15px;
    }

    .select-trigger.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .select-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .select-dropdown-icon {
        margin-left: 8px;
        font-size: 10px;
        user-select: none;
    }

    :global(.bay-menu.mdc-menu-surface) {
        max-height: 300px;
        width: 400px;
    }

    :global(.bay-menu .bay-item) {
        min-height: 48px;
        padding: 0 16px;
        cursor: pointer;
        gap: 8px;
    }

    :global(.bay-menu .bay-item:hover) {
        background-color: rgba(0, 0, 0, 0.04);
    }

    :global(.bay-menu .checkbox-wrapper) {
        pointer-events: none;
    }
</style>
