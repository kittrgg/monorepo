import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { NumberInput } from '.';

export default {
  title: 'Atom/NumberInput',
  component: NumberInput,
  args: {
    variant: 'default',
  },
} as ComponentMeta<typeof NumberInput>;

const Template: ComponentStory<typeof NumberInput> = (args) => (
  <NumberInput value={0} {...args} />
);

export const Default = Template.bind({});

export const Filled = Template.bind({});
Filled.args = {
  variant: 'filled',
};

export const Description = Template.bind({});
Description.args = {
  description: 'Button Description/Title',
};

export const Step_and_Precision = Template.bind({});
Step_and_Precision.args = {
  step: 0.1,
  precision: 1,
};
