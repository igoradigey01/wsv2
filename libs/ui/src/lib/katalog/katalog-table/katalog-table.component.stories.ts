

import type { Meta, StoryObj } from '@storybook/angular';
import {katalog_data2} from '../../_shared/servises/data-fake2'
import {Product} from '@wsv2/app-common'
import { KatalogTableComponent } from './katalog-table.component';

const i= katalog_data2 as Product[];

const meta: Meta<KatalogTableComponent> = {

  title: 'Katalog-table',
  component: KatalogTableComponent,
  tags: ['autodocs'],

  argTypes: {
    flagOpt: {
      name: "flagOpt",
      description: "переключатель оптовая to рознечная цена"
    },
    
    changeProduct: { action: 'clicked' }



  }
};

export default meta;



type Story = StoryObj<KatalogTableComponent>;

export const SubKatalogTableUI: Story = {
  args: {
   
    flagOpt:false,
    serverUrl:'https://s.x-01.ru/',
   
    products:i
 
  },

};
