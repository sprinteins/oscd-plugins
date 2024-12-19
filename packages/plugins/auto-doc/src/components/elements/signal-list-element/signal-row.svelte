<script lang="ts">
    import Checkbox from '@smui/checkbox';
    import Textfield from "@smui/textfield"
    import {createEventDispatcher} from "svelte"
	import type { SignalRow, HintText } from './types.signal-list';

    //Props
    export let isSelected = false;
    export let column1 = "";
    export let column2 = "";
    export let label = "";
    export let idx = 1;
    export let hintText: HintText = {col1: "", col2: ""};

    const dispatch = createEventDispatcher()
    const labelWithSuffix = `${label} ${idx+1}`;

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
        return hintText.col1.length > 0 || hintText.col2.length > 0;
  }
</script>



<div class="signal-row">
    {#if isFirstRow() && isThereHintText()}
        <div></div>
        <small>{hintText.col1}</small>
        <small>{hintText.col2}</small>
        
    {/if}
    <Checkbox bind:checked={isSelected} />
    <Textfield
        bind:value={column1}
        variant="outlined"
        label={labelWithSuffix}
        on:input= {e => handleInputChange('column1', e)}
        disabled={!isSelected}
        >
    </Textfield>
    <Textfield
        bind:value={column2}
        variant="outlined"
        label={labelWithSuffix}
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