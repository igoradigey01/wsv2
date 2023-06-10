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
  title: 'Card-Product',
  component: ImageSliderComponent,
  tags: ['autodocs'],
  argTypes: {},

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
