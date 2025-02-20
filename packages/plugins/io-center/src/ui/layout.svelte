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

<layout>
	<sidebar-left>
		<slot name="sidebar-left" />
	</sidebar-left>
	<content>
		<slot name="content" />
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
		@apply w-full h-full p-0 m-0 border border-green-700;
	}
	content {
		grid-area: content;
		@apply h-full p-0 m-0 border border-red-500;
	}
	sidebar-right {
		grid-area: sidebar-right;
		@apply h-full p-0 m-0 border border-blue-700;
	}
</style>
