<script module lang="ts">
import CustomIconButton from './custom-icon-button.svelte'
// ARGS
import availableIcons from '@/components/icons/icons-draw'
// TYPES
import type { Meta } from '@storybook/svelte'

export const meta = {
	title: 'SMUI/Custom IconButton',
	component: CustomIconButton,
	tags: ['autodocs'],
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: Object.keys(availableIcons)
		},
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		},
		color: {
			control: {
				type: 'color',
				presetColors: ['#2aa198', '#6c71c4', '#f3ecda', '#fff9eb']
			}
		}
	}
} satisfies Meta<CustomIconButton>
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
 
  import ThemeDecorator from '@/components/storybook/decorators/theme-decorator.svelte';
 
</script>
 
<Template >
	{#snippet children({ args })}
		<ThemeDecorator>
			<CustomIconButton {...args} />
		</ThemeDecorator>
	{/snippet}
</Template>

<Story name="Default"  args={{ icon: "download" }}/>