

<script lang="ts">
    import type { ButtonGroupOption } from "./types"
    import SegmentedButton, { Segment } from "@smui/segmented-button"
    import { Label } from "@smui/common"
    import { createEventDispatcher } from "svelte"

    // Inputs
    export let selectedIndex = -1
    export let options: ButtonGroupOption[] = []
    export let disabled = false
    export let testid = ""
    
    $: selected = options[selectedIndex]
    const dispatch = createEventDispatcher()

    function handleChange(event: CustomEvent<{index: number, segmentedId: string, selected: boolean}>){
    	dispatch("change", {index: event.detail.index})
    }

    const dataProps = {
    	"data-testid": testid
    }

</script>

<button-group {disabled} class="button-group" class:disabled>
    <SegmentedButton 
        segments={options} 
        {selected} 
        singleSelect 
        on:change={handleChange}
        let:segment 
        {disabled}
        {...dataProps}
    >
        <Segment {segment} {disabled} {...{"data-testid": `${dataProps["data-testid"]}_${segment.value}`}}>
        <Label disabled>{segment.label}</Label>
        </Segment>
    </SegmentedButton>
</button-group>

<style>

    button-group :global(button:disabled.mdc-segmented-button__segment) {
        background: rgba(0, 0, 0, 0.12);
    }

    button-group:not(.disabled) :global(.mdc-segmented-button__segment--selected){
        background-color: var(--mdc-theme-primary);
        color: var(--mdc-theme-on-primary, var(--color-white));
    }
    
    button-group.disabled :global(.mdc-segmented-button__segment--selected){
        color: inherit;
    }

    .button-group.disabled{
        pointer-events: none;
    }
</style>
