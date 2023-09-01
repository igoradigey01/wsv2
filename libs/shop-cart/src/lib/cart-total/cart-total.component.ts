import { Component } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { CartService } from '../_shared/services/cart.service';

@Component({
  selector: 'wsv2-cart-total',
  standalone: true,
  imports: [DecimalPipe, NgIf,MatCardModule, MatButtonModule,MatProgressBarModule],
  templateUrl: './cart-total.component.html',
  styleUrls: ['./cart-total.component.scss'],
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
