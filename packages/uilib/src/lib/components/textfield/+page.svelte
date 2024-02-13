<script lang="ts">
	import { Example } from "../internal"
	import { Textfield } from "."
  
	export let value = "Hello World!"
	export let label = "Motto"
</script>

<Example name="Textfield">
	<Textfield
		{ label }
		bind:value
	/>
</Example>

<Example name="Textfield outlined">
	<Textfield
		{ label }
		variant={"outlined"}
		bind:value
	/>
</Example>

<Example name="Textfield filled">
	<Textfield
		{ label }
		variant={"filled"}
		bind:value
	/>
</Example>

<div style="margin-top: 16px">
	Input value: { value }
</div>
