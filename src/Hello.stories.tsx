import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Example/Hello',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HelloWorld: Story = {
  render: () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Hello World!</h1>
      <p>Your PR preview is working! 🎉</p>
    </div>
  ),
};
