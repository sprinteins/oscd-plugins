<script context="module" lang="ts">
import DevMenuBar from './menu-bar.dev.svelte'
// TYPES
import type { Meta } from '@storybook/svelte'

export const meta = {
	title: 'Dev/Menu Bar',
	component: DevMenuBar,
	tags: ['autodocs'],
	argTypes: {
		pluginType: {
			control: { type: 'select' },
			options: ['editor', 'menu', 'validator']
		}
	}
} satisfies Meta<DevMenuBar>
</script>
	
<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
	// DECORATORS
	import ThemeDecorator from '@/components/storybook/decorators/theme-decorator.svelte';

</script>
	 
	<Template let:args>
		<ThemeDecorator>
			<DevMenuBar {...args} />
		</ThemeDecorator>
	</Template>
	
	<Story name="Plugin type Editor"  args={{ pluginType: "editor"}}/>

	<Story name="Plugin type Menu"  args={{ pluginType: "menu"}}/>

	<Story name="Plugin type Validator"  args={{ pluginType: "validator"}}/>