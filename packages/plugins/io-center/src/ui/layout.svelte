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
import { iedTreeStore } from '@/headless/stores'
</script>
<layout>
	<sidebar-left>
		<slot name="sidebar-left" />
	</sidebar-left>
	<content>
		{#if iedTreeStore.selectedDataObject}
			<slot name="content" />
		{:else}
		<div class="flex items-center justify-center h-full w-full">
			<p class="font-black text-xl">Please select a data object in the left sidebar.</p>
		</div>
		{/if}
	</content>
	<sidebar-right>
		<slot name="sidebar-right" />
	</sidebar-right>
</layout>

<style>
	layout {
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: "sidebar-left content sidebar-right";
		@apply h-full gap-4;
	}
	sidebar-left {
		grid-area: sidebar-left;
		overflow: scroll;
		scrollbar-width: none;
		@apply w-full h-full p-0 m-0;
	}

	sidebar-left::-webkit-scrollbar {
		display: none;
	}

	content {
		grid-area: content;
		@apply h-full p-0 m-0;
	}
	sidebar-right {
		display: flex;
		flex-direction: column;
		grid-area: sidebar-right;
		@apply h-full p-0 m-0;
	}
</style>
