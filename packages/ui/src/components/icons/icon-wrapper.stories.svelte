<script context="module" lang="ts">
import IconWrapper from './icon-wrapper.svelte'
import availableIcons from './icons-draw'
// TYPES
import type { Meta } from '@storybook/svelte'

export const meta = {
	title: 'Components/Icon Wrapper',
	component: IconWrapper,
	argTypes: {
		fillColor: {
			control: {
				type: 'color',
				presetColors: ['#2aa198', '#6c71c4', '#f3ecda', '#fff9eb']
			}
		},
		icon: {
			control: { type: 'select' },
			options: Object.keys(availableIcons)
		}
	}
} satisfies Meta<IconWrapper>
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
	// DECORATORS
	import ThemeDecorator from '@/components/storybook/decorators/theme-decorator.svelte';

</script>
	 
	<Template let:args>
		<ThemeDecorator>
			<IconWrapper {...args} />
		</ThemeDecorator>
	</Template>
	
	<Story name="Download"  args={{ icon: "download", fillColor: "black"}}/>
	<Story name="Upload File"  args={{ icon: "upload_file", fillColor: "black"}}/>