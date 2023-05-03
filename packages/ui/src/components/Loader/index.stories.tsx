import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Loader } from '.';

export default {
  title: 'Atom/Loader',
  component: Loader,
  argTypes: {
    variant: { options: ['dots', 'bars', 'oval'], control: { type: 'select' } },
  },
} as ComponentMeta<typeof Loader>;

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'dots',
};

export const Bars = Template.bind({});
Bars.args = {
  variant: 'bars',
};

export const Oval = Template.bind({});
Oval.args = {
  variant: 'oval',
};
