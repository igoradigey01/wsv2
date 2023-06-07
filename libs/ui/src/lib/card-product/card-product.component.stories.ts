import type { Meta} from '@storybook/angular';
import {katalog_data2} from '../_shared/servises/data-fake2'
import { action } from '@storybook/addon-actions';
import { CardProductComponent } from './card-product.component';
import {Nomenclature} from '@wsv2/app-common'

const i=  katalog_data2 as Nomenclature[];
const meta: Meta<CardProductComponent> = {
    title: 'Card-Product',
    component: CardProductComponent,
    tags: ['autodocs'],
    argTypes: {
        flagOpt: {
            name: "flagOpt",
            description: "переключатель оптовая to рознечная цена"
          },
    },
  //  add_cart: { action: 'clicked',return  }

};

export default meta;

export const CardProductUI = {
    render: (args: CardProductComponent) => ({
        props: args,
    }),
    args: {
       
        flagOpt:false,
        katalog_name:"Ручки",
        productURL:'https://xf-01.ru/content/opt/optkatalog/optnomenclature/48',
        katalogURL:'https://xf-01.ru/content/opt/optkatalog/1',
        serverUrl:'https://s.x-01.ru/',
     
       
        product:i[0]

    }

};
