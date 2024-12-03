<script context="module" lang="ts">
import CustomDrawer from './custom-drawer.svelte'
// TYPES
import type { Meta } from '@storybook/svelte'

export const meta = {
	title: 'SMUI/Custom Drawer',
	component: CustomDrawer
} satisfies Meta<CustomDrawer>
</script>
	
<script>
import { Story, Template } from '@storybook/addon-svelte-csf';

import ThemeDecorator from '@/components/storybook/decorators/theme-decorator.svelte';
// STORES
import drawerStore from './custom-drawer.store';
	
const { open } = drawerStore

//====== FUNCTIONS ======//

function handleDrawer() {
	return drawerStore.switchDrawer({
		title:"Storybook drawer", 
		description:"This is an example of the custom drawer"
	})
}
</script>
	 
	<Template>
		<ThemeDecorator>
			<CustomDrawer>
				<main>
					<h1>Main Content</h1>
					<p>Main content goes here</p>
					
					<button on:click={handleDrawer}>
						{ $open ? 'Close drawer' : 'Open drawer' }
					</button>
				</main>
			</CustomDrawer>
		</ThemeDecorator>
	</Template>
	
	<Story name="Default"/>