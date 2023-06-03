// https://storybook.js.org/docs/angular/configure/overview#configure-story-loading

import type { Meta, StoryObj } from '@storybook/angular';


//import { action } from '@storybook/addon-actions';
import { KatalogImgComponent } from './katalog-img.component';
//import {DataPresentationService} from '../../_shared/servises/data-presentation.service'
import {katalog_data2} from '../../_shared/servises/data-fake2'

//import { APP_INITIALIZER } from '@angular/core';
//import { moduleMetadata } from '@storybook/angular';
import {  signal } from '@angular/core';;
import {Nomenclature} from '@wsv2/app-common'
//import { toSignal, toObservable } from '@angular/core/rxjs-interop';



// function myServiceFactory(myService: DataPresentationService) {
//   return () =>  i=myService.products() ;
// } 

 
 
const i= signal<Nomenclature[]>( katalog_data2 as Nomenclature[]);

const meta: Meta< KatalogImgComponent> = {

  title: 'Katalog',
  component:  KatalogImgComponent,

  argTypes: {
  },
  // decorators: [
  //   moduleMetadata({
  //     imports: [
        
  //     ],
  //     providers: [
  //       {
  //         provide: APP_INITIALIZER,
  //         useFactory: myServiceFactory,
  //         deps: [DataPresentationService]
  //       }
  //     ]
  //   })
  // ]
};

export default meta;

type Story = StoryObj< KatalogImgComponent>;

export const  SubKatalogImgUI: Story = {
  args: {
    flagView:false,
    flagOpt:false,
    serverUrl:'https://s.x-01.ru/',
   
    products:i
  
  },

};
