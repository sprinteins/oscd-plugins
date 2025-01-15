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
	}
	sidebar-left {
		grid-area: sidebar-left;
	}
	content {
		grid-area: content;
		border: red thin solid;
	}
	sidebar-right {
		grid-area: sidebar-right;
	}
</style>