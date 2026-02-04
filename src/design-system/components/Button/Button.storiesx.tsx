import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'
import { IconNames } from '../Icon/Icon'

const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: 'Button variant',
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Button size',
    },
    icon: {
      control: 'select',
      options: IconNames,
      description: 'The icon name from the icon resource map',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the icon relative to the text',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state with spinning icon',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const SolidText: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
  },
}

export const SolidLeadingIcon: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
  },
}

export const SolidTrailingIcon: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
  },
}

export const SolidIcon: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    icon: 'plus',
  },
}

export const SolidTextDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    disabled: true,
  },
}

export const SolidLeadingIconDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    disabled: true,
  },
}

export const SolidTrailingIconDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    disabled: true,
  },
}

export const SolidIconDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    icon: 'plus',
    disabled: true,
  },
}

export const SolidTextLoading: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    loading: true,
  },
}

export const SolidLeadingIconLoading: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    loading: true,
  },
}

export const SolidTrailingIconLoading: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    loading: true,
  },
}

export const SolidIconLoading: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    icon: 'plus',
    loading: true,
  },
}

// Outline

export const OutlineText: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
  },
}

export const OutlineLeadingIcon: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
  },
}

export const OutlineTrailingIcon: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
  },
}

export const OutlineIcon: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    icon: 'plus',
  },
}

export const OutlineTextDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    disabled: true,
  },
}

export const OutlineLeadingIconDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    disabled: true,
  },
}

export const OutlineTrailingIconDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    disabled: true,
  },
}

export const OutlineIconDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    icon: 'plus',
    disabled: true,
  },
}

export const OutlineTextLoading: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    loading: true,
  },
}

export const OutlineLeadingIconLoading: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    loading: true,
  },
}

export const OutlineTrailingIconLoading: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    loading: true,
  },
}

export const OutlineIconLoading: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    icon: 'plus',
    loading: true,
  },
}

// Ghost

export const GhostText: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
  },
}

export const GhostLeadingIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
  },
}

export const GhostTrailingIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
  },
}

export const GhostIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    icon: 'plus',
  },
}

export const GhostTextDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    disabled: true,
  },
}

export const GhostLeadingIconDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    disabled: true,
  },
}

export const GhostTrailingIconDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    disabled: true,
  },
}

export const GhostIconDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    icon: 'plus',
    disabled: true,
  },
}

export const GhostTextLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    loading: true,
  },
}

export const GhostLeadingIconLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    loading: true,
  },
}

export const GhostTrailingIconLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    loading: true,
  },
}

export const GhostIconLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    icon: 'plus',
    loading: true,
  },
}

// Small

export const SmallSolidText: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
  },
}

export const SmallSolidLeadingIcon: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
  },
}

export const SmallSolidTrailingIcon: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
  },
}

export const SmallSolidIcon: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    icon: 'plus',
  },
}

export const SmallSolidTextDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    disabled: true,
  },
}

export const SmallSolidLeadingIconDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    disabled: true,
  },
}

export const SmallSolidTrailingIconDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    disabled: true,
  },
}

export const SmallSolidIconDisabled: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    icon: 'plus',
    disabled: true,
  },
}

export const SmallSolidTextLoading: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    loading: true,
  },
}

export const SmallSolidLeadingIconLoading: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    loading: true,
  },
}

export const SmallSolidTrailingIconLoading: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    loading: true,
  },
}

export const SmallSolidIconLoading: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    icon: 'plus',
    loading: true,
  },
}

// Outline

export const SmallOutlineText: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
  },
}

export const SmallOutlineLeadingIcon: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
  },
}

export const SmallOutlineTrailingIcon: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
  },
}

export const SmallOutlineIcon: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    icon: 'plus',
  },
}

export const SmallOutlineTextDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    disabled: true,
  },
}

export const SmallOutlineLeadingIconDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    disabled: true,
  },
}

export const SmallOutlineTrailingIconDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    disabled: true,
  },
}

export const SmallOutlineIconDisabled: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    icon: 'plus',
    disabled: true,
  },
}

export const SmallOutlineTextLoading: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    loading: true,
  },
}

export const SmallOutlineLeadingIconLoading: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    loading: true,
  },
}

export const SmallOutlineTrailingIconLoading: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    loading: true,
  },
}

export const SmallOutlineIconLoading: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    icon: 'plus',
    loading: true,
  },
}

// Ghost

export const SmallGhostText: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
  },
}

export const SmallGhostLeadingIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
  },
}

export const SmallGhostTrailingIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
  },
}

export const SmallGhostIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    icon: 'plus',
  },
}

export const SmallGhostTextDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    disabled: true,
  },
}

export const SmallGhostLeadingIconDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    disabled: true,
  },
}

export const SmallGhostTrailingIconDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    disabled: true,
  },
}

export const SmallGhostIconDisabled: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    icon: 'plus',
    disabled: true,
  },
}

export const SmallGhostTextLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    loading: true,
  },
}

export const SmallGhostLeadingIconLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'left',
    loading: true,
  },
}

export const SmallGhostTrailingIconLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    children: 'Button',
    icon: 'plus',
    iconPosition: 'right',
    loading: true,
  },
}

export const SmallGhostIconLoading: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    icon: 'plus',
    loading: true,
  },
}
