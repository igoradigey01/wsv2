import type { Meta } from '@storybook/angular';
import { data } from '../_shared/servises/data-fake3';
import { action } from '@storybook/addon-actions';
import { ImageSliderComponent } from './image-slider.component';
import { Nomenclature } from '@wsv2/app-common';
import { ISliderImage } from '@wsv2/app-common';

const i = data as Nomenclature;

const img_urls:ISliderImage[]= [];
const  serverUrl='https://s.x-01.ru/';
data.img_guids.map(d=>{img_urls.push( {url:`${serverUrl}images/L${d}.webp`,title:''})  });


const meta: Meta<ImageSliderComponent> = {
  title: 'ImageSliderUI',
  component: ImageSliderComponent,
  tags: ['autodocs'],
  argTypes: {
    minHeight: {
      name: "minHeight",
      description: "min-height img css - задавать обязательно ,sample '450px' or 'auto' or '15rem' ,задать желательно для каждого "+
      "@media (min-width: 413px) ,@media (min-width: 768px), @media (min-width:992px)",
    
      
    },
    minWidth: {
      name: " minWidth",
      description: " min-width img css,sample '450px' or 'auto' or '15rem'"
    },
    marginTopSlideBar: {
      name: " marginTopSlideBar",
      description: "опустить от верха контейнера img на 85%,задавать в %"
    },
    marginLeftSlideBar: {
      name: "marginLeftSlideBar",
      description: "опустить от верха отсптупить с лева контейнера img на 40%(для шести точек 30%) ,зависит от количества img в [],задавать в %"
    },
  },

  //  add_cart: { action: 'clicked',return  }
};

export default meta;

export const ImageSliderUI = {
  render: (args: ImageSliderComponent) => ({
    props: args,
  }),
  args: {
    minHeight: '500px',
    minWidth : '200px',
    
    marginTopSlideBar: '85%', // опустить от верха на 85%
    marginLeftSlideBar: '40%', //отсптупить с лева на 40%(для шести точек 30%)
     

    slideImgs: img_urls ,
    //   serverUrl:'https://s.x-01.ru/',
  },
};
