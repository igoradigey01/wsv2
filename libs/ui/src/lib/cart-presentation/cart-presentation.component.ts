import { ChangeDetectionStrategy, Component,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartShellComponent ,CartService,Nomenclature} from '@wsv2/shop-cart'
import { AppHeaderLayoutComponent } from '../layout/app-header-layout/app-header-layout.component'
import {DataPresentationService } from '../_shared/servises/data-presentation.service'

import {  IMenyItem } from '@wsv2/app-config'

import { UserRole } from '@wsv2/app-common'

@Component({
  selector: 'wsv2-cart-presentation',
  standalone: true,
  imports: [
    CommonModule,
    CartShellComponent,
    AppHeaderLayoutComponent

  ],
  providers: [DataPresentationService ] ,
  templateUrl: './cart-presentation.component.html',
  styleUrls: ['./cart-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

   cartItemsCount = 0; // haader
  
  flagPanel: boolean = true; 

  public _srcLogo: string = '/company-information/logo.webp' ;

  _company_name_1="";
  public _company_name_2: string = "cart-presentation"
  public _company_phone: string = '+7-903-466-83-68';
  public _company_normalize_phone: string = '+79034668368';
  public roleUser: UserRole = UserRole.default;



  errorMessage = ''; 

  constructor(
    private cartService: CartService,
    private repository:DataPresentationService
    ) { }

  addToCart(product: Nomenclature| undefined) {
    if (product) {
      this.cartService.addToCart(product);
    }
  }

  


  public onClickCart(userRole:UserRole){

    this.flagPanel=!this.flagPanel;
    

  }
  
 
  onSideBarVisible() {
   
  }
  


}
