// https://storybook.js.org/docs/angular/configure/overview#configure-story-loading

import type { Meta, StoryObj } from '@storybook/angular';

import { action } from '@storybook/addon-actions';
import { KatalogTableComponent } from './katalog-table.component';
//import { IButton } from '../../_interfaces/button.model'
//import { ButtonComponent } from '../../button/button.component';

const meta: Meta<KatalogTableComponent> = {

  title: 'Katalog',
  component: KatalogTableComponent,

  argTypes: {
    



  }
};

export default meta;



type Story = StoryObj<KatalogTableComponent>;

export const SubKatalogTableUI: Story = {
  args: {
 
  },

};
