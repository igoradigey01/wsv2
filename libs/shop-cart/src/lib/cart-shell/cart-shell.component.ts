import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartListComponent } from "../cart-list/cart-list.component";
import { CartTotalComponent } from "../cart-total/cart-total.component";


@Component({
  selector: 'wsv2-shop-cart',
  standalone: true,
  imports: [
    CommonModule,
    CartListComponent, 
    CartTotalComponent
  ],
  templateUrl: './cart-shell.component.html',
  styleUrls: ['./cart-shell.component.scss'],
})
export class CartShellComponent {}
