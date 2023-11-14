<script lang="ts">
	import { Example } from "../internal"
	import { Checkbox } from "."

	let checked = false

</script>

<h1>Add Button</h1>


<Example name="Checkbox">
    <Checkbox
		label="is this working?"
		bind:checked={checked}
		on:change={console.log}
		on:input={console.log}
	/>
	<div>is it checked: {checked}</div>
</Example>

