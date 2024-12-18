<script lang="ts">
    import Checkbox from '@smui/checkbox';
    import Textfield from "@smui/textfield"
    import {createEventDispatcher} from "svelte"
    //Props
    export let isSelected = false;
    export let column1 = "";
    export let column2 = "";
    export let idx = 1;

    const dispatch = createEventDispatcher()
    const label = `Column ${idx}`;

    function handleInputChange(key, event) {
        const value = event.target.value;
        column1 = key === 'column1' ? value : column1;
        column2 = key === 'column2' ? value : column2;
        dispatch('update', { key, value });
  }
</script>



<div class="signal-row">
    <Checkbox bind:checked={isSelected} />
    <Textfield
        bind:value={column1}
        variant="outlined"
        label={label}
        on:input= {e => handleInputChange('column1', e)}
        disabled={!isSelected}
        >
    </Textfield>
    <Textfield
        bind:value={column2}
        variant="outlined"
        label={label}
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

    }
</style>