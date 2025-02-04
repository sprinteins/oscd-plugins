<script lang="ts">
    import Checkbox from '@smui/checkbox';
    import Textfield from "@smui/textfield";
    import {createEventDispatcher} from "svelte";
	import type { SignalRow, LabelText, Label } from './types.signal-list';

    import {debounce} from '@/utils/';

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

</script>


<div class="signal-row">
    {#if isFirstRow()}
        <div>
            <Checkbox 
                on:click={toggleAllCheckboxes}
                bind:checked={areAllCheckboxesSelected}
            />
        </div>
        <small>Choose the columns you want to display and rename if needed</small>
        <small>Use the filter to limit the content of the columns to certain values</small>
        
    {/if}
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


<style lang="scss">
    .signal-row{
        display: grid;
        grid-template-columns: 3% repeat(2, 1fr);
        grid-gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;

       & :global(.mdc-text-field__input[disabled]){
            cursor: not-allowed;
        }

        small{
            color: #4d5d63;
            text-align: center;
        }

    }
</style>