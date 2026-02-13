import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Layer } from '../Layer/Layer';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'UI Kit/Button',
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'text'],
      description: 'Visual style',
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Size',
    },
    icon: {
      control: false,
      description: 'Leading icon; use "Show icon" to toggle a placeholder',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    children: {
      control: 'text',
      description: 'Button label',
    },
  },
  args: {
    variant: 'solid',
    size: 'default',
    disabled: false,
    children: 'Button',
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

/** Placeholder icon; size is enforced by Button's icon wrapper (Recursica token). */
const placeholderIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M8 3a.75.75 0 0 1 .75.75v3.5h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5v-3.5A.75.75 0 0 1 8 3Z" />
  </svg>
);

/** Default story wraps component in Layer; layer control changes the Layer, not the Button. */
export const Default: Story = {
  argTypes: {
    ...meta.argTypes,
    icon: { table: { disable: true } },
    showIcon: {
      control: 'boolean',
      description: 'Show leading icon (placeholder)',
    },
    layer: {
      control: 'select',
      options: [0, 1, 2, 3],
      description: 'Layer (0–3) of the wrapping Layer; not a Button prop',
    },
  } as Meta<typeof Button>['argTypes'] & Record<string, unknown>,
  args: {
    ...meta.args,
    showIcon: false,
    layer: 1,
  } as typeof meta.args & { showIcon?: boolean; layer?: 0 | 1 | 2 | 3 },
  render: (args: typeof meta.args & { showIcon?: boolean; layer?: 0 | 1 | 2 | 3 }) => {
    const { showIcon, layer = 1, ...rest } = args;
    return (
      <Layer layer={layer} style={{ padding: 16 }}>
        <Button {...rest} icon={showIcon ? placeholderIcon : undefined} />
      </Layer>
    );
  },
};

/*
 * Static stories: major axes = variant, size, with/without icon.
 * Layer is set via wrapping <Layer>; no layer prop on Button.
 */
export const SolidDefault: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Solid default',
  },
  parameters: { controls: { disable: true } },
};

export const SolidSmall: Story = {
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Solid small',
  },
  parameters: { controls: { disable: true } },
};

export const OutlineDefault: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Outline default',
  },
  parameters: { controls: { disable: true } },
};

export const OutlineSmall: Story = {
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Outline small',
  },
  parameters: { controls: { disable: true } },
};

export const TextDefault: Story = {
  args: {
    variant: 'text',
    size: 'default',
    children: 'Text default',
  },
  parameters: { controls: { disable: true } },
};

export const TextSmall: Story = {
  args: {
    variant: 'text',
    size: 'small',
    children: 'Text small',
  },
  parameters: { controls: { disable: true } },
};

export const WithIcon: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    children: 'With icon',
    icon: placeholderIcon,
  },
  parameters: { controls: { disable: true } },
};

export const Layer1Solid: Story = {
  render: () => (
    <Layer layer={1} style={{ padding: 16 }}>
      <Button variant="solid" size="default">
        Layer 1 solid
      </Button>
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};

export const Layer2Outline: Story = {
  render: () => (
    <Layer layer={2} style={{ padding: 16 }}>
      <Button variant="outline" size="default">
        Layer 2 outline
      </Button>
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};

export const Disabled: Story = {
  args: {
    variant: 'solid',
    size: 'default',
    disabled: true,
    children: 'Disabled',
  },
  parameters: { controls: { disable: true } },
};

/** Min-width: icon-only (no text) so button is at Recursica min-width. */
export const MinWidth: Story = {
  render: () => (
    <Layer layer={0} style={{ padding: 16 }}>
      <Button variant="solid" size="default" icon={placeholderIcon} aria-label="Action" />
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};

/** Max-width: long label so button hits Recursica max-width (500px). */
export const MaxWidth: Story = {
  render: () => (
    <Layer layer={0} style={{ padding: 16 }}>
      <Button variant="solid" size="default">
        This is an example of a button label that is long enough to hit the maximum width constraint of five hundred pixels defined by the design token
      </Button>
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};
