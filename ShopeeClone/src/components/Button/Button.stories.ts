import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Button from './Button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Shopee/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Button',
    className:
      'ml-4 mt-5 flex h-10 w-52 items-center justify-center rounded-sm bg-orange text-sm uppercase text-white hover:bg-orange/80 sm:mt-0'
  }
}

export const LoadingButton: Story = {
  args: {
    children: 'Button',
    isLoading: true,
    className:
      'ml-4 mt-5 flex h-10 w-52 items-center justify-center rounded-sm bg-orange text-sm uppercase text-white hover:bg-orange/80 sm:mt-0'
  }
}
