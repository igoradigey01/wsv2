// https://storybook.js.org/docs/angular/configure/overview#configure-story-loading

import type { Meta, StoryObj } from '@storybook/angular';

import { action } from '@storybook/addon-actions';
import { KatalogComponent } from './katalog.component';
//import { IButton } from '../../_interfaces/button.model'
//import { ButtonComponent } from '../../button/button.component';

const meta: Meta<KatalogComponent> = {

  title: 'Katalog',
  component: KatalogComponent,
  tags: ['autodocs'],

  argTypes: {
    items: {
      name: "Items",
      description: " Массив имён подкаталогов или названий товара в формате item:IButton"
    },
    componetVisible: {
      name: "Visible",
      description: "displey:block or none this component"

    },
    urlBackgroundImgs: {
      name: "background img",
      description: "path for background img this componet"
    },
    flagButtonOpacity:{
      name:"button opacity",
      type:"boolean"

    },
    flagBackgroundImg: {
      name: "flag show background-img",
      type:"boolean"
    },
    onSelectBt: { action: 'clicked', return: { id: "10", name: "название категории" } }




  }
};

export default meta;

const tempRepozitory = [
  { id: 1, name: "каталог-1" },
  { id: 2, name: "каталог-2" },
  { id: 3, name: "каталог-3" },
  { id: 4, name: "каталог-4" },
  { id: 5, name: "каталог-5" },
  { id: 6, name: "каталог-6" },
  { id: 7, name: "каталог-7" },
  { id: 8, name: "каталог-8" },
  { id: 9, name: "каталог-9" },
  { id: 10, name: "каталог-10" },
  { id: 11, name: "каталог-11" },
];

const imgs = ['/bg_img/photo_1.webp', '/bg_img/photo_2.webp', '/bg_img/photo_3.webp']

type Story = StoryObj<KatalogComponent>;

export const KatalogButtonUI: Story = {
  args: {
    items: tempRepozitory,
    urlBackgroundImgs:imgs,
    componetVisible: true,
    flagBackgroundImg:true,
    flagButtonOpacity:true,    
    flagButtonId:true,
    timer:5000
  },

};
