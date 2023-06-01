// https://storybook.js.org/docs/angular/configure/overview#configure-story-loading

import type { Meta, StoryObj } from '@storybook/angular';

import { action } from '@storybook/addon-actions';
import { KatalogImgComponent } from './katalog-img.component';


const meta: Meta< KatalogImgComponent> = {

  title: 'Katalog',
  component:  KatalogImgComponent,

  argTypes: {
  }
};

export default meta;


type Story = StoryObj< KatalogImgComponent>;

export const  KatalogImgUI: Story = {
  args: {
  
  },

};
