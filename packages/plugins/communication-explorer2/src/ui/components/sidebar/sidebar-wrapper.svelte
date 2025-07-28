<script lang="ts">
// COMPONENTS
import { Sidebar } from '@oscd-plugins/core-ui-svelte'
</script>

<Sidebar.Root side="right" class="sidebar-root z-0" collapsible="none" >

	<Sidebar.Header class="text-xl font-black">Sidebar header</Sidebar.Header>
	<Sidebar.Content class="p-4 space-y-5">
		
		<p>Sidebar content updated</p>
	</Sidebar.Content>
	<Sidebar.Footer> <p>Sidebar footer</p></Sidebar.Footer>

</Sidebar.Root>


