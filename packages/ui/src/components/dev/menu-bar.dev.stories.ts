import type { Meta, StoryObj } from '@storybook/svelte'

import DevMenuBar from './menu-bar.dev.svelte'

const meta = {
	title: 'Development/Menu Bar',
	component: DevMenuBar,
	tags: ['autodocs']
} satisfies Meta<DevMenuBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
