<script lang="ts">
    import { Example } from "../internal"
    import { Button } from "."

    function handleClick() {
    	console.log("clicked")
    }
</script>

<h1>Add Button</h1>

<Example name="Primary">
    <Button on:click={handleClick} testid="button-primary">Create</Button>
    <Button on:click={handleClick} disabled>Create</Button>
</Example>

<Example name="Secondary">
    <Button type="secondary" on:click={handleClick}>Create</Button>
    <Button type="secondary" on:click={handleClick} disabled>Create</Button>
</Example>

<Example name="Tertiary">
    <Button type="tertiary" on:click={handleClick}>Create</Button>
    <Button type="tertiary" on:click={handleClick} disabled>Create</Button>
</Example>

‚
