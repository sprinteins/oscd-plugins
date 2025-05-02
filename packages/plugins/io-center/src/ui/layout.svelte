<!-- 
╭──────────────────────╮              
│ ◎ ○ ○ ░░░░░░░░░░░░░░░│              
├────┬────────────┬────┤              
│    │            │    │              
│    │            │    │              
│    │            │    │              
│    │            │    │              
│    │            │    │              
│    │            │    │              
└──┬─┴────────────┴────┘              
           │        │                 
   │                 ─ ─ Sidebar Right
           └ ─ ─ Content              
   └ ─ ─ Sidebar Left                             
-->
<script lang="ts">
// STORES
import { iedStore } from '@/headless/stores'
</script>
<layout class="layout">
	<sidebar-left class="sidebar sidebar-left">
		<slot name="sidebar-left" />
	</sidebar-left>
	{#if iedStore.selectedDataObject}
		<content class="content">
			<slot name="content" />
		</content>
		<sidebar-right class="sidebar sidebar-right">
			<slot name="sidebar-right" />
		</sidebar-right>
	{:else}
		<div class="flex items-center justify-center h-full w-full">
			<p class="font-black text-xl">Please select a data object in the left sidebar.</p>
		</div>
	{/if}
</layout>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: "sidebar-left content sidebar-right";
		@apply h-full gap-4;
	}
	.sidebar {
		display: flex;
		flex-direction: column;
		overflow: scroll;
		scrollbar-width: none;
		@apply w-full h-full p-0 m-0;
	}

	.sidebar::-webkit-scrollbar {
		display: none;
	}

	.sidebar-left{
		grid-area: sidebar-left;
	}

	.sidebar-right{
		grid-area: sidebar-right;
	}

	.content {
		grid-area: content;
		@apply h-full p-0 m-0;
	}
</style>
