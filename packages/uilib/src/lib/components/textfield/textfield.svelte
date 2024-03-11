<script lang="ts">
	import Textfield from '@smui/textfield';

	/**
	 * Thin wrapper around @smui/textfield, see https://sveltematerialui.com/demo/textfield/
	 * Add inputs / bindings / eventhandlers as necessary
	 */
	export let value: string | number | null | undefined = undefined
	export let invalid: boolean = false
	export let label: string | undefined = undefined
	export let variant: "filled" | "outlined" | undefined = undefined
</script>

<Textfield bind:value
	bind:invalid
	on:input
	on:change
	{ variant }
	{ label }>
	<slot name="helper" slot="helper"></slot>
</Textfield>
