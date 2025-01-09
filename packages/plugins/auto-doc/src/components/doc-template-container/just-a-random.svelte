<div class="container" bind:this={currentHtmlContext} >
	{#if showFields}
		<div class="input-fields">
			<Button on:click={addElement}>
				Create element
			</Button>
		</div>
	{/if}
	{#each buttons as { name, onClick }}
		<Button on:click={onClick}>{name}</Button>
	{/each}
</div>

<script lang="ts">
// COMPONENTS
import Button from '@smui/button'
// STORES
import { docTemplatesStore, signallistStore } from '@/stores'
// CONSTANTS
// TYPES
import type { AllowedElements } from '@oscd-plugins/core'

//==== INITIALIZATION ====//




//refs
let showFields = false
let currentFieldsToShow: string
let currentElementTypeAttributes: { [key: string]: string | null } = {}
let currentHtmlContext: HTMLElement

//==== FUNCTIONS ====//



function handleInputChange(event: Event) {
	const target = event.target as HTMLInputElement
	currentElementTypeAttributes[target.name] = target.value
}

const buttons = [
	{
		name: "add doc",
		onClick: () => addElement()
	},
]

function addElement() {
	console.log('create signallist')
	const signallist = signallistStore.getSignallist()
	console.log('Message Publishers:', signallist.messagePublishers);
    console.log('Message Subscribers:', signallist.messageSubscribers);
    console.log('Invalidities Reports:', signallist.invaliditiesReports);
}
</script>

<style>
	.container {
		position: fixed;
		bottom: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		padding: 16px;
	}
</style>
