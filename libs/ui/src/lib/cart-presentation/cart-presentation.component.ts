import { ChangeDetectionStrategy, Component,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

import { AppHeaderLayoutComponent } from '../layout/app-header-layout/app-header-layout.component'
import { CartShellComponent ,CartService} from '@wsv2/shop-cart'
import { Product} from '@wsv2/app-common'
import {DataPresentationService } from '../_shared/servises/data-presentation.service'
import {katalog_data2} from '../_shared/servises/data-fake2'

import {  IMenyItem } from '@wsv2/app-config'

import { UserRole } from '@wsv2/app-common'
import {KatalogImgComponent} from '../katalog/katalog-img/katalog-img.component'



@Component({
    selector: 'wsv2-cart-presentation',
    standalone: true,
  
    templateUrl: './cart-presentation.component.html',
    styleUrls: ['./cart-presentation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        CartShellComponent,
        AppHeaderLayoutComponent,
        KatalogImgComponent
        
    ],
    providers: [DataPresentationService],
})
export class CartPresentationComponent {

  public _menuItems: IMenyItem[] = [{
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

 public data_fake= signal<Product[]>( katalog_data2 as Product[]);
 
 @Input() public flagView = false;
  @Input() public flagOpt = false;
  @Input() public serverUrl = 'https://s.x-01.ru/';

   cartItemsCount = 0; // haader

  flagPanel = true;

  public _srcLogo = '/company-information/logo.webp' ;

  _company_name_1="";
  public _company_name_2 = "cart-presentation"
  public _company_phone = '+7-903-466-83-68';
  public _company_normalize_phone= '+79034668368';
  public roleUser: UserRole = UserRole.default;



  errorMessage = '';

  constructor(
    private cartService: CartService,
    private repository:DataPresentationService
    ) { }

  addToCart(product: Product| undefined) {
    if (product) {
      this.cartService.addToCart(product);
    }
  }




  public onClickCart(userRole:UserRole){

    this.flagPanel=!this.flagPanel;


  }


  onSideBarVisible(role:UserRole) {
    throw Error("not Implement");
  
  }



}
