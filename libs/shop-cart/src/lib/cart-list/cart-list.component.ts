import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

import { CartService } from '../_shared/services/cart.service';
import { CartItemComponent } from "../cart-item/cart-item.component";

@Component({
  selector: 'wsv2-cart-list',
  standalone: true,
  template: `
  <div *ngFor="let item of cartItems()">
     <wsv2-cart-item [item]='item'></wsv2-cart-item>
  </div>
  `,
  imports: [NgFor, CartItemComponent]
})
export class CartListComponent {
  cartItems = this.cartService.cartItems;

  constructor(private cartService: CartService) { }
}
