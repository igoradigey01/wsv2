import { Component } from '@angular/core';

import {MatCardModule} from '@angular/material/card';

import { CartService } from '../_shared/services/cart.service';
import { CartItemComponent } from "../cart-item/cart-item.component";

@Component({
    selector: 'wsv2-cart-list',
    templateUrl: 'cart-list.component.html',
    styleUrls: ['./cart-list.component.scss'],
    imports: [MatCardModule, CartItemComponent]
})
export class CartListComponent {
  cartItems = this.cartService.cartItems;

  constructor(private cartService: CartService) { }
}
