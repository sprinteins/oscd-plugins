<script lang="ts">
    import Checkbox from '@smui/checkbox';
    import Textfield from "@smui/textfield"
    import {createEventDispatcher} from "svelte"
	import type { SignalRow, HintText, LabelText, Label } from './types.signal-list';

    //Props
    export let idx = 1;
    export let label: LabelText = {col1Label: {name: "", hasSuffix: false}, col2Label: {name: "", hasSuffix: false}};
    export let hintText: HintText = {col1Hint: "", col2Hint: ""};
    export let isSelected = false;
    export let column1 = "";
    export let column2 = "";


    const dispatch = createEventDispatcher()

    function handleInputChange(key: keyof SignalRow, event: CustomEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement | null;
        if(target === null) {
            throw new Error('Event target is null');
        }
        const value = target.value;
        column1 = key === 'column1' ? value : column1;
        column2 = key === 'column2' ? value : column2;
        dispatch('update', { key, value });
  }

  function isFirstRow(){
        return idx === 0;
  }
  function isThereHintText(){
        return hintText.col1Hint.length > 0 || hintText.col2Hint.length > 0;
  }

  function createSuffixForLabelIfNeeded(label: Label){
    const {name, hasSuffix} = label;
    return hasSuffix ? `${name} ${idx+1}` : name;
  }
</script>



<div class="signal-row">
    {#if isFirstRow() && isThereHintText()}
        <div></div>
        <small>{hintText.col1Hint}</small>
        <small>{hintText.col2Hint}</small>
        
    {/if}
    <Checkbox bind:checked={isSelected} />
    <Textfield
        bind:value={column1}
        variant="outlined"
        label={createSuffixForLabelIfNeeded(label.col1Label)}
        on:input= {e => handleInputChange('column1', e)}
        disabled={!isSelected}
        >
    </Textfield>
    <Textfield
        bind:value={column2}
        variant="outlined"
        label={createSuffixForLabelIfNeeded(label.col2Label)}
        on:input= {e => handleInputChange('column2', e)}
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
        }

    }
</style>