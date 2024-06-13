import type { Meta } from '@storybook/angular';


import { QrCodeComponent } from './qr-code.component';





const meta: Meta<QrCodeComponent> = {
  title: 'QrCodeComponentUI',
  component: QrCodeComponent,
  tags: ['autodocs'],
  argTypes: {
    productURL: {
      name: "productURL",
      description: "link on prduct",
    
      
    },
    katalogURL: {
      name: "katalogURL",
      description: " link on catalog"
    },
    productName: {
      name: "productName",
      description: " название товара"
    },
    katalogName: {
      name: "katalogName",
      description: "название каталога в ктором находится товар"
    },
    flagShowQrKatlog: {
      name: "  flagShowQrKatlog",
      description: "видимость Qr каталога"
    }
  },

  //  add_cart: { action: 'clicked',return  }
};

export default meta;

export const ImageSliderUI = {
  render: (args: QrCodeComponent) => ({
    props: args,
  }),
  args: {
    productURL: 'https://xf-01.ru/content/categoria/katalog/1?katalog=%D0%A0%D1%83%D1%87%D0%BA%D0%B8',
    katalogURL : 'https://xf-01.ru/content/categoria/katalog/1?katalog=%D0%A0%D1%83%D1%87%D0%BA%D0%B8',
    productName: 'С15 Серебро 160',
    katalogName: 'РУЧКИ',
    
    flagShowQrKatlog: true
  },
};
