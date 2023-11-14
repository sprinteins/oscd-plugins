<script lang="ts">
    import { createEventDispatcher } from "svelte"

    export let label: string
    export let isSelectable = false
    export let isSelected = false

    const eventDispatcher = createEventDispatcher()
    function selectIED() {
    	if (isSelectable) {
    		isSelected = !isSelected
    		if (isSelected) {
    			eventDispatcher("select")
    		} else {
    			eventDispatcher("deselect")
    		}
    	}
    }
</script>

<!-- "ied-node-component" is used for printing adaptions -->
<div
    class="ied ied-node-component"
    class:selected={isSelected}
    on:click={selectIED}
    on:keydown
>
    <span>{label}</span>
</div>

<style lang="scss">
    div.ied {
        padding: 0.7rem 1rem;
        background-color: #f9f7f1;
        border-radius: 5px;
        border: 1px solid #2aa198;
        display: inline-block;
        transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
        cursor: pointer;

        &.selected {
            background-color: #2aa198;
            color: white;
        }

        &:hover {
            background-color: #2aa198;
            color: white;
        }
    }
</style>
