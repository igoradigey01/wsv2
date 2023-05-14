import type { Meta, StoryObj } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { AppHeaderLayoutComponent } from './app-header-layout.component';
import {UserRole} from '@wsv2/app-common'
import { moduleMetadata } from '@storybook/angular';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
//import { RouterModule } from '@angular/router';


const meta: Meta<AppHeaderLayoutComponent> = {
    title: 'Header-Layout',
    component: AppHeaderLayoutComponent,
    decorators: [
      moduleMetadata({
        imports: [
          NoopAnimationsModule,
        //  RouterModule
        ],
      }),
    ],
    tags: ['autodocs'],
    argTypes: {
      UserRole: {
        name: "UserRole",
        description: "роль пользователя определяет вид appHeader",
        options: [0, 1, 2,3,4,5],
      
       control: {type: 'select', labels: ['default', 'opt','shoper','shoperOpt','manager','admin']}
        
      },
      isShopHeader:{
        name:"IsShopHeader",
        description:"Это витрина магазина или панель admin or manager"
      },
      /** return this.userRole */
      onClickCart: { action: 'clicked', return:'default' },
      onClickLogin:{action: 'clicked', return:'default'},
      onClickOrder:{action: 'clicked', return:'default'}
      

    }

};

export default meta;


const repozitoryMenyShop=[{
    "id": 0,
    "name": "Как заказать?",
    "url": "menu/kak-zakazat"  
  },
  {
    "id": 1,
    "name": "Оплата&Доставка",
    "url": "menu/oplata-i-dostavka"
    
  },
  {
    "id": 2,
    "name": "Гарантии",
    "url": "menu/garantiya"
    
  },
  {
    "id": 3,
    "name": "Как доехать",
    "url": "menu/about"
    
  }
]

const repozitoryMenyManager=[
    { "id": 1, "name": "КАТЕГОРИЯ", "url": "/manager/categoria-n" },
    { "id": 2, "name": "КАТАЛОГ", "url": "/manager/katalog-n" },
    { "id": 3, "name": "БРЕНД", "url": "/manager/brand-n" },
    { "id": 4, "name": "ЦВЕТ", "url": "/manager/color-n" },
    { "id": 5, "name": "АРТИКУЛ ", "url": "/manager/article-n" },
    { "id": 6, "name": "НОМЕНКЛАТУРА", "url": "/manager/katalog-n" },
    { "id": 6, "name": "info", "url": "/manager/nomenclature" }
  ]

 const logo='/company-information/logo.webp' 

export const HeaderLayouttUI = {
    render: (args: AppHeaderLayoutComponent) => ({
        props: args,
    }),
    args: {
        UserRole:0,
        isShopHeader:true,
        menuItems:repozitoryMenyShop,
        srcLogo:logo,
        company_name_2:"name-2",
        company_name_1:"name_1",
        company_phone:'+7-903-466-83-68',
        company_normalize_phone:'+79034668368',
       

    }

};
