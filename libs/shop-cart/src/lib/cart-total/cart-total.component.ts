import { Component } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';

import { CartService } from '../_shared/services/cart.service';

@Component({
  selector: 'wsv2-cart-total',
  standalone: true,
  imports: [DecimalPipe, NgIf],
  templateUrl: './cart-total.component.html'
})
export class CartTotalComponent {

  cartItems = this.cartService.cartItems;

 /*  subTotal = this.cartService.subTotal;

  deliveryFee = this.cartService.deliveryFee;

  tax = this.cartService.tax;
 */
  
  totalPrice = this.cartService.totalPrice;
  
  constructor(private cartService: CartService) { }
}
