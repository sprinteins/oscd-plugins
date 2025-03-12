<script lang="ts">
    import Checkbox from '@smui/checkbox';
    import Textfield from "@smui/textfield";
    import {createEventDispatcher} from "svelte";
	import type { SignalRow, LabelText, Label } from './types.signal-list';

    import {debounce} from '@/utils/';
    import { signalDndStore } from '../../../stores/signal-dnd.store'

    //Props
    export let idx = 1;
    export let label: LabelText = {col1Label: {name: "", hasSuffix: false}, col2Label: {name: "", hasSuffix: false}};
    export let isSelected = false;
    export let column1 = "";
    export let column2 = "";

    let areAllCheckboxesSelected = false;

    const ONE_SECOND_IN_MS = 1000;

    const debounceUserInput = debounce(handleInputChange, ONE_SECOND_IN_MS);


    const dispatch = createEventDispatcher()

    function handleInputChange(key: keyof SignalRow, value: string) {
        column1 = key === 'column1' ? value : column1;
        column2 = key === 'column2' ? value : column2;
        dispatch('update', { key, value });
  }

  function isFirstRow(){
        return idx === 0;
  }

  function createSuffixForLabelIfNeeded(label: Label){
    const {name, hasSuffix} = label;
    return hasSuffix ? `Column ${idx+1} "${name}"` : name;
  }

  $: if(isSelected || !isSelected){
    dispatch('update', { key: 'isSelected', value: isSelected });
  }

  function toggleAllCheckboxes(){
    dispatch('toggleAllCheckboxes', {value: areAllCheckboxesSelected});
  }

  $: isDropTarget = signalDndStore.draggedIndex !== -1 && 
                   signalDndStore.dropIndex === idx;

</script>


<div class="signal-row" class:dragging={signalDndStore.draggedIndex === idx}>
    {#if isFirstRow()}
        <div>
            <div></div>
            <div>
                <Checkbox 
                    on:click={toggleAllCheckboxes}
                    bind:checked={areAllCheckboxesSelected}
                />
            </div>
            <small>Choose the columns you want to display and rename if needed</small>
            <small>Use the filter to limit the content of the columns to certain values</small>
        </div>
    {/if}
    <div draggable="true"
        on:dragstart={() => signalDndStore.handleDragStart(idx)}
        on:dragend={() => signalDndStore.handleDragEnd()}>
        <div 
            class="drag-handle"
        >
            <svg viewBox="0 0 24 24" width="24" height="24" class="grip-dots">
                <circle cx="6" cy="6" r="2"/>
                <circle cx="12" cy="6" r="2"/>
                <circle cx="6" cy="12" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="6" cy="18" r="2"/>
                <circle cx="12" cy="18" r="2"/>
            </svg>
        </div>
        <Checkbox bind:checked={isSelected} />
        <Textfield
            bind:value={column1}
            variant="outlined"
            label={createSuffixForLabelIfNeeded(label.col1Label)}
            on:input= {e => debounceUserInput('column1', e.target.value)}
            disabled={!isSelected}
            >
        </Textfield>
        <Textfield
            bind:value={column2}
            variant="outlined"
            label={createSuffixForLabelIfNeeded(label.col2Label)}
            on:input= {e => debounceUserInput('column2', e.target.value)}
            disabled={!isSelected}
            >
        </Textfield>
    </div>
</div>

<div 
    class="drop-zone" 
    class:active={isDropTarget}
    on:dragover|preventDefault={() => signalDndStore.updateDropIndex(idx)}
>
</div>

<style lang="scss">
    .signal-row {
        display: grid;
        grid-template-columns: auto 3% repeat(2, 1fr);
        grid-gap: 1rem;
        align-items: center;
        padding: 0.5rem;
        border: 1px solid #ff0000;
        border-radius: 4px;
        background: white;
        
        &.dragging {
            opacity: 0.5;
        }

        &:hover .drag-handle {
            opacity: 1;
        }

        & :global(.mdc-text-field__input[disabled]) {
            cursor: not-allowed;
        }

        small {
            color: #4d5d63;
            text-align: center;
        }
    }

    .drag-handle {
        cursor: grab;
        opacity: 0.3;
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
        
        &:active {
            cursor: grabbing;
        }
    }

    .grip-dots {
        fill: currentColor;
    }

    .drop-zone {
        height: 0;
        transition: height 0.2s ease;
        border: 2px dashed transparent;
        margin: 0 0.5rem;
        
        &.active {
            height: 60px;
            border-color: #00ff00;
            background: rgba(0, 255, 0, 0.1);
        }
    }
</style>