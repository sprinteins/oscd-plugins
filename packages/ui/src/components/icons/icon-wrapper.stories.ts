import type { Meta, StoryObj } from '@storybook/svelte'

import IconWrapper from './icon-wrapper.svelte'
import availableIcons from './icons-draw'

const meta = {
	title: 'Icons',
	component: IconWrapper,
	tags: ['autodocs'],
	argTypes: {
		fillColor: { control: 'color' },
		icon: {
			control: { type: 'select' },
			options: Object.keys(availableIcons)
		}
	}
} satisfies Meta<IconWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		icon: 'download',
		fillColor: 'black'
	}
}
