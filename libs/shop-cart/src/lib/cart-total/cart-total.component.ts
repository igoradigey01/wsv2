/* eslint-disable @nx/enforce-module-boundaries */
import { Component,inject } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {Router} from '@angular/router';

import { CartService } from '../_shared/services/cart.service';
//import {} from '@wsv2/shop-cart/'
import {OrderService,OrderItem} from '@wsv2/shop-orders'



@Component({
  selector: 'wsv2-cart-total',
  standalone: true,
  imports: [DecimalPipe, NgIf,MatCardModule, MatButtonModule,MatProgressBarModule],
  templateUrl: './cart-total.component.html',
  styleUrls: ['./cart-total.component.scss'],
})
export class CartTotalComponent {

  repozitoryOrder= inject( OrderService);
  repositoryCart=inject(CartService)

  cartItems =   this.repositoryCart.cartItems; 
  totalPrice = this.repositoryCart.totalPrice;
  constructor(
    private router: Router
  ){}
  
  public createOrder(){
    this.repozitoryOrder.CreateOrder(this.cartItems() as OrderItem[],this.totalPrice())
    this.router.navigate(['index/order']);
  }
  
}
