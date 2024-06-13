import { Component, Input, computed, signal } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../_shared/interfaces/cart-item.model';
import { CartService } from '../_shared/services/cart.service';

@Component({
  selector: 'wsv2-cart-item',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgFor, NgIf,MatButtonModule,MatIconModule],
  templateUrl: './cart-item.component.html', 
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {


  // Use a setter to emit whenever a new item is set
  _item!: CartItem;
  get item(): CartItem {
    return this._item;
  }
  @Input() set item(item: CartItem) {
    this._item = item;
    this.cartItem.set(item);
  }

  

  // Cart item signal
  cartItem = signal(this.item);

  // When the item changes, recalculate the extended price
  exPrice = computed(() =>
    this.cartItem().quantity * Number(this.cartItem().product.cost_total));

  constructor(private _repositoryCart: CartService) { }

  

  onRemove( ): void {
    //debugger
    this._repositoryCart.putInCart(this.cartItem());
  /*   this.cartItem.mutate(
      d=>{
        if(d.quantity>1){
          d.quantity=d.quantity-1;
        }
      }
    )      
     */
  }
  onAdd():void{
   // this.cartItem.mutate((item) => item.quantity = item.quantity+1);
    this._repositoryCart.addToCart(this.cartItem().product);
  }

  public get ServerUrl(): string {

    return `${this._repositoryCart.ServerUrl}`
  }

}
