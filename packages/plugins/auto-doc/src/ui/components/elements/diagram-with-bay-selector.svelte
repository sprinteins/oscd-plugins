<script lang="ts">
import FormField from '@smui/form-field'
import Radio from '@smui/radio'
import Menu from '@smui/menu'
import List, { Item, Text } from '@smui/list'
import Checkbox from '@smui/checkbox'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { IEDService } from '@oscd-plugins/core'
import { onMount } from 'svelte'

interface Props {
	selectedBays: Set<string>
	onchange?: () => void
}

let { selectedBays = $bindable(new Set<string>()), onchange }: Props = $props()

const MODE_ALL = 'all'
const MODE_BAY = 'bay'
type ModeType = typeof MODE_ALL | typeof MODE_BAY

let availableBays: string[] = $state([])
let mode: ModeType = $state(selectedBays.size > 0 ? MODE_BAY : MODE_ALL)
let isMenuOpen = $state(false)
let anchorElement: HTMLDivElement | null = $state(null)
let menuElement: HTMLDivElement

const segments = [
	{ value: MODE_ALL, label: 'All bays' },
	{ value: MODE_BAY, label: 'Bay selection' }
]

function closeMenuOnOutsideClick(event: MouseEvent) {
	if (!isMenuOpen || !menuElement || !anchorElement) return

	const target = event.target as Node
	const isClickOutside =
		!menuElement.contains(target) && !anchorElement.contains(target)

	if (isClickOutside) {
		isMenuOpen = false
	}
}

$effect(() => {
	if (!isMenuOpen) return

	const timeoutId = setTimeout(() => {
		document.addEventListener('click', closeMenuOnOutsideClick)
	}, 0)

	return () => {
		clearTimeout(timeoutId)
		document.removeEventListener('click', closeMenuOnOutsideClick)
	}
})

function loadAvailableBays() {
	if (!pluginGlobalStore.xmlDocument) {
		availableBays = []
		return
	}
	try {
		const service = new IEDService(
			pluginGlobalStore.xmlDocument.documentElement
		)
		availableBays = Array.from(service.Bays())
	} catch (e) {
		console.error('Failed to load bays from IEDService', e)
		availableBays = []
	}
}

function onModeChange() {
	if (mode === MODE_ALL) {
		selectedBays = new Set<string>()
		isMenuOpen = false
		onchange?.()
	}
}

function toggleBaySelection(bay: string) {
	const newSet = new Set(selectedBays)
	if (newSet.has(bay)) {
		newSet.delete(bay)
	} else {
		newSet.add(bay)
	}
	selectedBays = newSet
	onchange?.()
}

function isBaySelected(bay: string): boolean {
	return selectedBays.has(bay)
}

function openMenuIfBayModeActive(e: MouseEvent) {
	if (mode !== MODE_ALL) {
		e.stopPropagation()
		isMenuOpen = true
	}
}

function handleKeyboardMenuOpen(e: KeyboardEvent) {
	const isActivationKey = e.key === 'Enter' || e.key === ' '
	if (isActivationKey && mode !== MODE_ALL) {
		isMenuOpen = true
	}
}

function handleBayItemClick(e: MouseEvent, bay: string) {
	e.stopPropagation()
	e.preventDefault()
	toggleBaySelection(bay)
}

const dropdownText = $derived.by(() => {
	const hasNoBaysSelected = mode === MODE_ALL || selectedBays.size === 0
	if (hasNoBaysSelected) return 'Select bays...'

	const hasSingleBay = selectedBays.size === 1
	if (hasSingleBay) return Array.from(selectedBays)[0]

	return `${selectedBays.size} bays selected`
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
          id="radio-{segment.value}"
          bind:group={mode}
          value={segment.value}
          onchange={onModeChange}
        />
        {#snippet label()}
          {segment.label}
        {/snippet}
      </FormField>
    {/each}
  </div>

  <div class="bay-select-wrapper" class:disabled={mode === MODE_ALL}>
    <div
      bind:this={anchorElement}
      class="select-trigger"
      class:disabled={mode === MODE_ALL}
      onclick={openMenuIfBayModeActive}
      onkeydown={handleKeyboardMenuOpen}
      role="button"
      tabindex={mode === MODE_ALL ? -1 : 0}
    >
      <span class="select-text">{dropdownText}</span>
      <span class="select-dropdown-icon">▼</span>
    </div>
  </div>

  <div bind:this={menuElement}>
    <Menu
      bind:open={isMenuOpen}
      bind:anchorElement
      managed={true}
      class="bay-menu"
      anchorCorner="BOTTOM_START"
    >
      <List>
        {#each availableBays as bay (bay)}
          <Item onclick={(e) => handleBayItemClick(e, bay)} class="bay-item">
            <span class="checkbox-wrapper">
              <Checkbox checked={isBaySelected(bay)} tabindex={-1} />
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
