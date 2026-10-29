import { Component } from '@angular/core';

import { CartListComponent } from "../cart-list/cart-list.component";
import { CartTotalComponent } from "../cart-total/cart-total.component";
import { CartService } from '../_shared/services/cart.service';
import {MatCardModule} from '@angular/material/card';


@Component({
    selector: 'wsv2-shop-cart',
    imports: [
    MatCardModule,
    CartListComponent,
    CartTotalComponent
],
    templateUrl: './cart-shell.component.html',
    styleUrls: ['./cart-shell.component.scss']
})
export class CartShellComponent {

  cartItems = this.cartService.cartItems;
  constructor(private cartService: CartService) { }
}
