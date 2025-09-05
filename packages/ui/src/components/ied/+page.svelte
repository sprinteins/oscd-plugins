<script lang="ts">
    import { Example } from "../internal"
    import Ied from "./ied.svelte"

    let IEDselectedText = "deselected"

    function IEDselectionHandler() {
    	const nowDate = new Date()
    	IEDselectedText = `${nowDate.toDateString()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}:${nowDate.getMilliseconds()}`
    }

    function IEDdeselectionHandler() {
    	IEDselectedText = "deselected"
    }
</script>

<Example name="IED is NOT selectable">
    <Ied isSelectable={false} isSelected={false} label="myIED label" />
    <Ied isSelectable={false} isSelected={true} label="myIED label" />
</Example>

<Example name="IED is selectable">
    <Ied
        isSelectable={true}
        label="myIED label"
        on:select={IEDselectionHandler}
        on:deselect={IEDdeselectionHandler}
    /><br /><br />
    <span>{IEDselectedText}</span>
</Example>
