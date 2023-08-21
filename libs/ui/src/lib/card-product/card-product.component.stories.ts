import type { Meta} from '@storybook/angular';
import {data} from '../_shared/servises/data-fake3'
import { action } from '@storybook/addon-actions';
import { CardProductComponent } from './card-product.component';
import { Product} from '@wsv2/app-common'

const i=  data as Product;
const meta: Meta<CardProductComponent> = {
    title: 'Card-Product',
    component: CardProductComponent,
    tags: ['autodocs'],
    argTypes: {
        flagOpt: {
            name: "flagOpt",
            description: "переключатель оптовая to рознечная цена"
          },
          _onBack:{ action: 'clicked'},
          _onQRCode:{action: 'clicked'},
          addCart:{action: 'clicked', return:0},
    },
   


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
     
        product:i

    }

};
