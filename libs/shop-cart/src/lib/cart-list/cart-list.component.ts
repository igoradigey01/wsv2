import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import {MatCardModule} from '@angular/material/card';

import { CartService } from '../_shared/services/cart.service';
import { CartItemComponent } from "../cart-item/cart-item.component";

@Component({
  selector: 'wsv2-cart-list',
  standalone: true,  
  templateUrl: 'cart-list.component.html', 
  styleUrls: ['./cart-list.component.scss'],
  imports: [NgFor,MatCardModule, CartItemComponent]
})
export class CartListComponent {
  cartItems = this.cartService.cartItems;

  constructor(private cartService: CartService) { }
}
